import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from './components/Hero';
import Stations from './components/Stations';
import OffClock from './components/OffClock';
import Contact from './components/Contact';
import Hud from './components/Hud';
import Cinema from './components/Cinema';
import { prefersReducedMotion } from './lib/webgl';
import { setActive, state } from './store';
import { stations } from './data/stations';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
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

    const tail = ScrollTrigger.create({
      trigger: '#contact',
      start: 'top center',
      onToggle: (self) => {
        if (self.isActive) {
          setActive(stations.length - 1);
          state.zoom = 0;
          state.phase = 'end';
        }
      },
    });
    const head = ScrollTrigger.create({
      trigger: '#top',
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => {
        if (self.isActive) {
          setActive(0);
          state.zoom = 0;
          state.phase = 'hero';
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
  }, []);

  return (
    <>
      <Cinema />
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
