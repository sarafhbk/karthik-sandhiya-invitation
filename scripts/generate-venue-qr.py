"""
Generates src/assets/venue-qr.svg — the QR code on PAGE 3's venue block.

Run this whenever the venue URL in src/content.jsx changes:

    python3 scripts/generate-venue-qr.py > src/assets/venue-qr.svg
    python3 scripts/verify-venue-qr.py      # must print ROUND-TRIP OK

The URL is duplicated in __main__ below rather than imported, because
content.jsx is JS. If you change WEDDING_VENUE_MAPS_QUERY there, change it
here too — verify-venue-qr.py will not catch a mismatch between the two
files, only that the SVG matches whatever this script was told.

Self-contained QR encoder: byte mode, EC level M, smallest fitting version.
Written from the spec rather than pulling in a library so the project gains
no runtime dependency for what is ultimately one static image.
"""
import re

# ---- Galois field tables for Reed-Solomon ----
EXP = [0]*512
LOG = [0]*256
x = 1
for i in range(255):
    EXP[i] = x
    LOG[x] = i
    x <<= 1
    if x & 0x100:
        x ^= 0x11d
for i in range(255, 512):
    EXP[i] = EXP[i-255]

def gmul(a, b):
    if a == 0 or b == 0:
        return 0
    return EXP[(LOG[a] + LOG[b]) % 255]

def rs_generator(n):
    g = [1]
    for i in range(n):
        g2 = [0]*(len(g)+1)
        for j, c in enumerate(g):
            g2[j] ^= c
            g2[j+1] ^= gmul(c, EXP[i])
        g = g2
    return g

def rs_encode(data, n):
    gen = rs_generator(n)
    res = list(data) + [0]*n
    for i in range(len(data)):
        coef = res[i]
        if coef:
            for j, gc in enumerate(gen):
                res[i+j] ^= gmul(gc, coef)
    return res[len(data):]

# ---- Version/EC tables: (version, ec_level) -> (total_codewords, ec_per_block, [group sizes]) ----
# Only the versions we might need, EC level M (good balance, ~15% recovery).
# Format: version: (data_codewords_total, ec_codewords_per_block, num_blocks_g1, dc_g1, num_blocks_g2, dc_g2)
VERSIONS_M = {
    1:  (16, 10, 1, 16, 0, 0),
    2:  (28, 16, 1, 28, 0, 0),
    3:  (44, 26, 1, 44, 0, 0),
    4:  (64, 18, 2, 32, 0, 0),
    5:  (86, 24, 2, 43, 0, 0),
    6:  (108, 16, 4, 27, 0, 0),
    7:  (124, 18, 4, 31, 0, 0),
    8:  (154, 22, 2, 38, 2, 39),
    9:  (182, 22, 3, 36, 2, 37),
    10: (216, 26, 4, 43, 1, 44),
    11: (254, 30, 1, 50, 4, 51),
    12: (290, 22, 6, 36, 2, 37),
    13: (334, 22, 8, 37, 1, 38),
    14: (365, 24, 4, 40, 5, 41),
    15: (415, 24, 5, 41, 5, 42),
    16: (453, 28, 7, 45, 3, 46),
    17: (507, 28, 10, 46, 1, 47),
    18: (563, 26, 9, 43, 4, 44),
    19: (627, 26, 3, 44, 11, 45),
    20: (669, 26, 3, 41, 13, 42),
}

ALIGN_POS = {
    1: [], 2: [6,18], 3: [6,22], 4: [6,26], 5: [6,30], 6: [6,34],
    7: [6,22,38], 8: [6,24,42], 9: [6,26,46], 10: [6,28,50],
    11: [6,30,54], 12: [6,32,58], 13: [6,34,62], 14: [6,26,46,66],
    15: [6,26,48,70], 16: [6,26,50,74], 17: [6,30,54,78],
    18: [6,30,56,82], 19: [6,30,58,86], 20: [6,34,62,90],
}

# Version information bit strings for versions >= 7
VERSION_INFO = {
    7: 0x07C94, 8: 0x085BC, 9: 0x09A99, 10: 0x0A4D3, 11: 0x0BBF6,
    12: 0x0C762, 13: 0x0D847, 14: 0x0E60D, 15: 0x0F928, 16: 0x10B78,
    17: 0x1145D, 18: 0x12A17, 19: 0x13532, 20: 0x149A6,
}

def make_qr(text, ec='M'):
    data = text.encode('utf-8')
    # Pick smallest version that fits (byte mode, 8-bit count for v<=9 is 8 bits, else 16)
    for ver in range(1, 21):
        total_dc = VERSIONS_M[ver][0]
        cci_bits = 8 if ver <= 9 else 16
        need_bits = 4 + cci_bits + len(data)*8
        if need_bits <= total_dc*8:
            break
    else:
        raise ValueError('data too long')

    total_dc, ecc_per_block, g1_n, g1_dc, g2_n, g2_dc = VERSIONS_M[ver]
    cci_bits = 8 if ver <= 9 else 16

    # Build bitstream
    bits = []
    def put(val, n):
        for i in range(n-1, -1, -1):
            bits.append((val >> i) & 1)
    put(0b0100, 4)          # byte mode
    put(len(data), cci_bits)
    for b in data:
        put(b, 8)
    # Terminator + pad to byte boundary
    put(0, min(4, total_dc*8 - len(bits)))
    while len(bits) % 8:
        bits.append(0)
    # Pad codewords
    pad = [0xEC, 0x11]
    i = 0
    while len(bits)//8 < total_dc:
        put(pad[i % 2], 8)
        i += 1
    codewords = [int(''.join(map(str, bits[i:i+8])), 2) for i in range(0, len(bits), 8)]

    # Split into blocks, compute ECC
    blocks = []
    pos = 0
    for _ in range(g1_n):
        blocks.append(codewords[pos:pos+g1_dc]); pos += g1_dc
    for _ in range(g2_n):
        blocks.append(codewords[pos:pos+g2_dc]); pos += g2_dc
    eccs = [rs_encode(b, ecc_per_block) for b in blocks]

    # Interleave
    final = []
    maxlen = max(len(b) for b in blocks)
    for i in range(maxlen):
        for b in blocks:
            if i < len(b):
                final.append(b[i])
    for i in range(ecc_per_block):
        for e in eccs:
            final.append(e[i])

    size = 17 + ver*4
    mod = [[None]*size for _ in range(size)]
    reserved = [[False]*size for _ in range(size)]

    def place_finder(r, c):
        for dr in range(-1, 8):
            for dc in range(-1, 8):
                rr, cc = r+dr, c+dc
                if 0 <= rr < size and 0 <= cc < size:
                    inring = (0 <= dr <= 6 and 0 <= dc <= 6)
                    if inring:
                        d = max(abs(dr-3), abs(dc-3))
                        mod[rr][cc] = 1 if d != 2 else 0
                    else:
                        mod[rr][cc] = 0
                    reserved[rr][cc] = True
    place_finder(0, 0); place_finder(0, size-7); place_finder(size-7, 0)

    # Timing patterns
    for i in range(size):
        if mod[6][i] is None:
            mod[6][i] = 1 if i % 2 == 0 else 0; reserved[6][i] = True
        if mod[i][6] is None:
            mod[i][6] = 1 if i % 2 == 0 else 0; reserved[i][6] = True

    # Alignment patterns
    ap = ALIGN_POS[ver]
    for r in ap:
        for c in ap:
            # Only the three finder corners omit an alignment pattern. Testing
            # `reserved` instead wrongly skipped (6,22) etc., because row/col 6
            # is already reserved by the timing pattern — that left 40 extra
            # free modules and shifted the entire data zigzag.
            if (r < 9 and c < 9) or (r < 9 and c > size-10) or (r > size-10 and c < 9):
                continue
            for dr in range(-2, 3):
                for dc in range(-2, 3):
                    d = max(abs(dr), abs(dc))
                    mod[r+dr][c+dc] = 1 if d != 1 else 0
                    reserved[r+dr][c+dc] = True

    # Dark module + format info reservation
    mod[size-8][8] = 1; reserved[size-8][8] = True
    for i in range(9):
        if not reserved[8][i]: reserved[8][i] = True; mod[8][i] = 0
        if not reserved[i][8]: reserved[i][8] = True; mod[i][8] = 0
    for i in range(8):
        if not reserved[8][size-1-i]: reserved[8][size-1-i] = True; mod[8][size-1-i] = 0
        if not reserved[size-1-i][8]: reserved[size-1-i][8] = True; mod[size-1-i][8] = 0

    # Version info reservation (v>=7)
    if ver >= 7:
        for i in range(18):
            r, c = i//3, size-11+(i%3)
            reserved[r][c] = True; mod[r][c] = 0
            reserved[c][r] = True; mod[c][r] = 0

    # Place data in zigzag
    databits = []
    for cw in final:
        for i in range(7, -1, -1):
            databits.append((cw >> i) & 1)
    idx = 0
    col = size - 1
    upward = True
    while col > 0:
        if col == 6:
            col -= 1
        rows = range(size-1, -1, -1) if upward else range(size)
        for r in rows:
            for c in (col, col-1):
                if not reserved[r][c]:
                    mod[r][c] = databits[idx] if idx < len(databits) else 0
                    idx += 1
        col -= 2
        upward = not upward

    # Try all 8 masks, pick lowest penalty
    def mask_fn(m, r, c):
        if m == 0: return (r+c) % 2 == 0
        if m == 1: return r % 2 == 0
        if m == 2: return c % 3 == 0
        if m == 3: return (r+c) % 3 == 0
        if m == 4: return (r//2 + c//3) % 2 == 0
        if m == 5: return (r*c) % 2 + (r*c) % 3 == 0
        if m == 6: return ((r*c) % 2 + (r*c) % 3) % 2 == 0
        return ((r+c) % 2 + (r*c) % 3) % 2 == 0

    ECBITS = {'L':0b01, 'M':0b00, 'Q':0b11, 'H':0b10}
    def format_bits(maskn):
        d = (ECBITS[ec] << 3) | maskn
        v = d << 10
        g = 0b10100110111
        for i in range(4, -1, -1):
            if v & (1 << (i+10)):
                v ^= g << i
        return ((d << 10) | v) ^ 0b101010000010010

    def penalty(g):
        p = 0
        # Rule 1: runs of 5+
        for line in list(g) + [list(col) for col in zip(*g)]:
            run = 1
            for i in range(1, size):
                if line[i] == line[i-1]:
                    run += 1
                else:
                    if run >= 5: p += 3 + (run-5)
                    run = 1
            if run >= 5: p += 3 + (run-5)
        # Rule 2: 2x2 blocks
        for r in range(size-1):
            for c in range(size-1):
                if g[r][c] == g[r][c+1] == g[r+1][c] == g[r+1][c+1]:
                    p += 3
        # Rule 3: finder-like patterns
        pat1 = [1,0,1,1,1,0,1,0,0,0,0]
        pat2 = [0,0,0,0,1,0,1,1,1,0,1]
        for line in list(g) + [list(col) for col in zip(*g)]:
            for i in range(size-10):
                seg = line[i:i+11]
                if seg == pat1 or seg == pat2:
                    p += 40
        # Rule 4: dark ratio
        dark = sum(sum(row) for row in g)
        pct = dark*100/(size*size)
        p += 10 * (abs(pct-50)//5)
        return p

    best = None
    for m in range(8):
        g = [row[:] for row in mod]
        for r in range(size):
            for c in range(size):
                if not reserved[r][c] and mask_fn(m, r, c):
                    g[r][c] ^= 1
        fb = format_bits(m)
        for i in range(15):
            bit = (fb >> i) & 1
            if i < 6: g[8][i] = bit
            elif i == 6: g[8][7] = bit
            elif i == 7: g[8][8] = bit
            elif i == 8: g[7][8] = bit
            else: g[14-i][8] = bit
            if i < 8: g[size-1-i][8] = bit
            else: g[8][size-15+i] = bit
        g[size-8][8] = 1
        if ver >= 7:
            vi = VERSION_INFO[ver]
            for i in range(18):
                bit = (vi >> i) & 1
                g[i//3][size-11+(i%3)] = bit
                g[size-11+(i%3)][i//3] = bit
        pen = penalty(g)
        if best is None or pen < best[0]:
            best = (pen, g, m)
    return best[1], size, ver, best[2]

if __name__ == '__main__':
    import sys, urllib.parse
    q = 'T.M.A Marriage Hall Thirukarakavur Papanasam Tamil Nadu 614302'
    url = 'https://www.google.com/maps/search/?api=1&query=' + urllib.parse.quote(q)
    grid, size, ver, mask = make_qr(url)
    print('URL:', url, file=sys.stderr)
    print('version', ver, 'size', size, 'mask', mask, file=sys.stderr)
    # Emit SVG: one path of rects, quiet zone 4 modules
    qz = 4
    total = size + qz*2
    parts = []
    for r in range(size):
        for c in range(size):
            if grid[r][c]:
                parts.append(f'M{c+qz} {r+qz}h1v1h-1z')
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {total} {total}" '
        f'shape-rendering="crispEdges" role="img" aria-label="QR code linking to the wedding venue on Google Maps">'
        f'<rect width="{total}" height="{total}" fill="#fff"/>'
        f'<path fill="#0a307f" d="{"".join(parts)}"/>'
        f'</svg>'
    )
    sys.stdout.write(svg)
