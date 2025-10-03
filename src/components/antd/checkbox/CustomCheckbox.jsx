import { Checkbox } from 'antd';
import styles from './CustomCheckbox.module.css';

export default function CustomCheckbox({
  children,
  className = '',
  size = 'default',
  ...props
}) {
  return (
    <Checkbox
      className={`${styles.checkbox} ${styles[size]} ${className}`}
      {...props}
    >
      {children}
    </Checkbox>
  );
}