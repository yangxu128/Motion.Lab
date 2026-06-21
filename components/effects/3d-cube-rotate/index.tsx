'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './3d-cube-rotate.module.css';
export default function Cube3DRotate({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.wrap} style={{ ['--duration' as any]: `${params.duration}s` }}>
        <div className={styles.cube}>
          <div className={`${styles.face} ${styles.f1}`}>1</div>
          <div className={`${styles.face} ${styles.f2}`}>2</div>
          <div className={`${styles.face} ${styles.f3}`}>3</div>
          <div className={`${styles.face} ${styles.f4}`}>4</div>
          <div className={`${styles.face} ${styles.f5}`}>5</div>
          <div className={`${styles.face} ${styles.f6}`}>6</div>
        </div>
      </div>
    </PreviewFrame>
  );
}
