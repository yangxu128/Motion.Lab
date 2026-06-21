import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';
export function Button({ variant = 'default', className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'primary' | 'ghost' }) {
  return <button className={`${styles.btn} ${className ?? ''}`} data-variant={variant} {...rest} />;
}
