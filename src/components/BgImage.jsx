/**
 * Reproduces Framer's background-image-fill wrapper:
 *   <div data-framer-background-image-wrapper>
 *     <img style="...object-fit:cover..." />
 *   </div>
 * Used throughout for full-bleed section backgrounds.
 */
export default function BgImage({ src, alt = '', fit = 'cover', loading }) {
  return (
    <div
      style={{
        position: 'absolute',
        borderRadius: 'inherit',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      }}
      data-framer-background-image-wrapper="true"
    >
      <img
        decoding="async"
        loading={loading}
        src={src}
        alt={alt}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          borderRadius: 'inherit',
          objectPosition: 'center',
          objectFit: fit,
        }}
      />
    </div>
  );
}
