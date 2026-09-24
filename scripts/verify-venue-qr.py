"""
Independent QR decoder. Deliberately does NOT import qr.py's helpers for the
parts under test: it re-derives the mask, re-reads the zigzag, de-interleaves
and re-parses the header from the spec, so agreement is real evidence the
encoder is correct rather than a tautology.
"""
import sys, re, pathlib, urllib.parse
# Import the generator by path: its filename has hyphens, so it is not a
# valid module name for a plain `import`.
import importlib.util
_spec = importlib.util.spec_from_file_location(
    'venue_qr_gen', pathlib.Path(__file__).with_name('generate-venue-qr.py'))
_gen = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_gen)
make_qr, VERSIONS_M, ALIGN_POS = _gen.make_qr, _gen.VERSIONS_M, _gen.ALIGN_POS

q = 'T.M.A Marriage Hall Thirukarakavur Papanasam Tamil Nadu 614302'
URL = 'https://www.google.com/maps/search/?api=1&query=' + urllib.parse.quote(q)
grid, size, ver, used_mask = make_qr(URL)

# --- 1. Read the format info back and confirm EC level + mask ---
fmt = 0
for i in range(15):
    if i < 6: bit = grid[8][i]
    elif i == 6: bit = grid[8][7]
    elif i == 7: bit = grid[8][8]
    elif i == 8: bit = grid[7][8]
    else: bit = grid[14-i][8]
    fmt |= bit << i
fmt ^= 0b101010000010010
ec_read = (fmt >> 13) & 0b11
mask_read = (fmt >> 10) & 0b111
print(f'format: ec_bits={ec_read:02b} (M=00), mask={mask_read} (encoder used {used_mask})')
assert ec_read == 0b00, 'EC level not M'
assert mask_read == used_mask, 'mask mismatch'

# --- 2. Rebuild the reserved map from the spec, independently ---
reserved = [[False]*size for _ in range(size)]
def mark(r0, c0, h, w):
    for r in range(r0, r0+h):
        for c in range(c0, c0+w):
            if 0 <= r < size and 0 <= c < size:
                reserved[r][c] = True
mark(0,0,9,9); mark(0,size-8,9,8); mark(size-8,0,8,9)
for i in range(size):
    reserved[6][i] = True; reserved[i][6] = True
ap = ALIGN_POS[ver]
for r in ap:
    for c in ap:
        if (r<9 and c<9) or (r<9 and c>size-10) or (r>size-10 and c<9):
            continue
        mark(r-2,c-2,5,5)
if ver >= 7:
    for i in range(18):
        rr, cc = i//3, size-11+(i%3)
        reserved[rr][cc] = True
        reserved[cc][rr] = True

# --- 3. Unmask ---
def mask_fn(m, r, c):
    if m == 0: return (r+c) % 2 == 0
    if m == 1: return r % 2 == 0
    if m == 2: return c % 3 == 0
    if m == 3: return (r+c) % 3 == 0
    if m == 4: return (r//2 + c//3) % 2 == 0
    if m == 5: return (r*c) % 2 + (r*c) % 3 == 0
    if m == 6: return ((r*c) % 2 + (r*c) % 3) % 2 == 0
    return ((r+c) % 2 + (r*c) % 3) % 2 == 0

un = [row[:] for row in grid]
for r in range(size):
    for c in range(size):
        if not reserved[r][c] and mask_fn(mask_read, r, c):
            un[r][c] ^= 1

# --- 4. Re-read the zigzag ---
bits = []
col = size-1
up = True
while col > 0:
    if col == 6: col -= 1
    for r in (range(size-1,-1,-1) if up else range(size)):
        for c in (col, col-1):
            if not reserved[r][c]:
                bits.append(un[r][c])
    col -= 2
    up = not up
cws = [int(''.join(map(str,bits[i:i+8])),2) for i in range(0, len(bits)//8*8, 8)]

# --- 5. De-interleave ---
total_dc, ecc_pb, g1n, g1dc, g2n, g2dc = VERSIONS_M[ver]
sizes = [g1dc]*g1n + [g2dc]*g2n
nblocks = len(sizes)
blocks = [[] for _ in sizes]
pos = 0
for i in range(max(sizes)):
    for b, bs in enumerate(sizes):
        if i < bs:
            blocks[b].append(cws[pos]); pos += 1
data = [c for b in blocks for c in b]

# --- 6. Parse the header per spec and extract the payload ---
bs = ''.join(f'{c:08b}' for c in data)
mode = int(bs[:4], 2)
cci = 8 if ver <= 9 else 16
length = int(bs[4:4+cci], 2)
payload = bs[4+cci:4+cci+length*8]
decoded = bytes(int(payload[i:i+8],2) for i in range(0,len(payload),8)).decode('utf-8')

print(f'mode={mode:04b} (byte=0100), length={length}')
print('decoded:', decoded)
assert mode == 0b0100, 'not byte mode'
assert length == len(URL.encode()), f'length {length} != {len(URL.encode())}'
assert decoded == URL, 'ROUND-TRIP MISMATCH'
print('\nROUND-TRIP OK — decoded payload is byte-identical to the source URL')
