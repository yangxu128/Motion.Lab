'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './lottie-loader.module.css';

// lottie-react is available for real Lottie JSON; for this demo we render
// three CSS/SVG-based loader styles so the preview is fully self-contained
// and does not depend on any external animation assets.
export default function LottieLoader({ params }: { params: { style: 'pulse' | 'orbit' | 'wave' } }) {
  const style = params.style;
  return (
    <PreviewFrame>
      <div className={styles.wrap}>
        {style === 'pulse' && (
          <div className={styles.pulse}>
            <span />
            <span />
            <span />
          </div>
        )}
        {style === 'orbit' && (
          <div className={styles.orbit}>
            <span />
            <span />
            <span />
          </div>
        )}
        {style === 'wave' && (
          <div className={styles.wave}>
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        )}
      </div>
    </PreviewFrame>
  );
}
