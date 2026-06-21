'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './morph-svg.module.css';

const PATHS = [
  'M10 50 Q50 10 90 50 Q50 90 10 50 Z',
  'M20 20 L80 20 L80 80 L20 80 Z',
  'M50 10 L90 80 L10 80 Z',
  'M10 10 Q90 10 90 50 Q90 90 50 90 Q10 90 10 50 Q10 10 50 10 Z',
];

export default function MorphSvg({ params }: { params: { duration: number } }) {
  const ref = useRef<SVGPathElement>(null);

  useEffect(() => {
    let i = 0;
    const id = window.setInterval(() => {
      i = (i + 1) % PATHS.length;
      const el = ref.current;
      if (el) el.setAttribute('d', PATHS[i]);
    }, Math.max(200, params.duration * 1000));
    return () => window.clearInterval(id);
  }, [params.duration]);

  return (
    <PreviewFrame>
      <svg className={styles.svg} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        <path
          ref={ref}
          className={styles.path}
          d={PATHS[0]}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </PreviewFrame>
  );
}
