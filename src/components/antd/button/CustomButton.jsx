// CustomButton.jsx
import { Button } from 'antd';
import styles from './CustomButton.module.css'; // Import như object

const colors = {
  primary: '#F88888',
  secondary: '#6B7280',
  success: '#10b926ff',
  add: '#3B82F6',
  save: '#22c55e',
  edit: '#f97316',
  delete: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  mark: '#f97316',
};

export default function CustomButton({
  color = 'primary',
  variant = 'solid',
  children,
  style,
  icon,
  className = '',
  ...props
}) {
  const baseColor = colors[color] || colors.primary;

  const getButtonStyle = () => {
    switch (variant) {
      case 'solid':
        return {
          '--btn-color': baseColor,
          backgroundColor: baseColor,
          borderColor: baseColor,
          color: '#ffffff',
          ...style,
        };

      case 'outline':
        return {
          '--btn-color': baseColor,
          backgroundColor: 'transparent',
          borderColor: baseColor,
          color: baseColor,
          ...style,
        };

      case 'text':
        return {
          '--btn-color': baseColor,
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          color: baseColor,
          ...style,
        };

      default:
        return style;
    }
  };

  return (
    <Button
      icon={icon}
      style={getButtonStyle()}
      className={`${styles.button} ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
}
