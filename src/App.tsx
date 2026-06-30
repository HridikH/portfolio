import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from './components/Hero';
import Stations from './components/Stations';
import OffClock from './components/OffClock';
import Contact from './components/Contact';
import Hud from './components/Hud';
import Fallback from './components/Fallback';
import { hasWebGL, prefersReducedMotion } from './lib/webgl';
import { setActive, state } from './store';
import { stations } from './data/stations';

gsap.registerPlugin(ScrollTrigger);

const Scene = lazy(() => import('./r3f/Scene'));

export default function App() {
  const webgl = useMemo(hasWebGL, []);
  const [mobile, setMobile] = useState(
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 720px)').matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 720px)');
    const onChange = () => setMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!webgl) return;
    const reduce = prefersReducedMotion();

    const lenis = new Lenis({
      duration: reduce ? 0.6 : 1.1,
      smoothWheel: !reduce,
      lerp: reduce ? 0.2 : 0.09,
    });
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // camera reaches the feet through the closing sections
    const tail = ScrollTrigger.create({
      trigger: '#contact',
      start: 'top center',
      onToggle: (self) => {
        if (self.isActive) {
          setActive(stations.length - 1);
          state.target = 1;
        }
      },
    });
    // returning to the very top resets to the head
    const head = ScrollTrigger.create({
      trigger: '#top',
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => {
        if (self.isActive) {
          setActive(0);
          state.target = stations[0].bodyY;
        }
      },
    });

    ScrollTrigger.refresh();
    return () => {
      gsap.ticker.remove(raf);
      tail.kill();
      head.kill();
      lenis.destroy();
    };
  }, [webgl]);

  if (!webgl) return <Fallback />;

  return (
    <>
      <Suspense fallback={<div className="scene-fixed" aria-hidden="true" />}>
        <Scene mobile={mobile} />
      </Suspense>
      <Hud />
      <main className="overlay">
        <Hero />
        <Stations />
        <OffClock />
        <Contact />
        <footer>© 2026 Hridik Hingorani · built from scratch, no template</footer>
      </main>
    </>
  );
}
