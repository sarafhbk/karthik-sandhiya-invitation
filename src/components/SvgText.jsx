import Reveal from './Reveal';

/**
 * Reproduces Framer's "fit text" SVG wrapper used for headings/paragraphs
 * that must scale to a fixed viewBox:
 *   <svg viewBox="0 0 W H">
 *     <foreignObject><p style="...">content</p></foreignObject>
 *   </svg>
 */
export default function SvgText({
  className,
  viewBox,
  scale = 1,
  textStyle,
  children,
  base = 'translate(-50%, -50%)',
  offset = 'translateY(40px)',
}) {
  return (
    <Reveal as="svg" className={className} viewBox={viewBox} base={base} offset={offset}>
      <foreignObject
        width="100%"
        height="100%"
        className="framer-fit-text"
        transform={`scale(${scale})`}
        style={{ overflow: 'visible', transformOrigin: 'center center' }}
      >
        <div style={{ ...textStyle, margin: 0 }} className="framer-text">
          {children}
        </div>
      </foreignObject>
    </Reveal>
  );
}
