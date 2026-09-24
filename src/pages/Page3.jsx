import { forwardRef } from 'react';
import BgImage from '../components/BgImage';
import WeddingEventCard from '../components/WeddingEventCard';
import { img } from '../imageMap';

const bgSrc = img('D4pzTjtAOLwhyi0UPGweoWoztA');

/**
 * PAGE 3 — ceremony schedule and venue card over a decorative background.
 *
 * Forwards a ref so PAGE 2's flower rain can observe this section and stop
 * when the reader arrives here.
 */
const Page3 = forwardRef(function Page3(props, ref) {
  return (
    <div ref={ref} className="framer-1q8leab" data-framer-name="PAGE 3">
      <BgImage src={bgSrc} loading="lazy" />
      <div className="framer-hofxkl-container" data-framer-name="Wedding Event Card">
        <WeddingEventCard />
      </div>
    </div>
  );
});

export default Page3;
