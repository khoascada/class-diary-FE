// CustomTag.jsx
import { Tag } from 'antd';

const colors = {
  primary: '#F88888', // đỏ nhạt
  orange: '#FF9800', // cam tươi
  blue: '#2196F3', // xanh dương tươi
  green: '#4CAF50', // xanh lá tươi
  purple: '#9C27B0', // tím tươi
  pink: '#E91E63', // hồng tươi
  yellow: '#FFEB3B', // vàng sáng
  teal: '#009688', // xanh ngọc
  indigo: '#3F51B5', // chàm
  cyan: '#00BCD4', // xanh cyan
};

export default function CustomTag({
  color = 'primary',
  variant = 'solid', // solid | outline | light
  children,
  style,
  className = '',
  ...props
}) {
  const baseColor = colors[color] || colors.primary;

  const getTagStyle = () => {
    switch (variant) {
      case 'solid':
        return {
          backgroundColor: baseColor,
          borderColor: baseColor,
          color: '#fff',
          ...style,
        };

      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: baseColor,
          color: baseColor,
          ...style,
        };

      case 'light':
        return {
          backgroundColor: `${baseColor}22`, // màu nhạt (22 = 0.13 alpha)
          borderColor: `${baseColor}44`,
          color: baseColor,
          ...style,
        };

      default:
        return style;
    }
  };

  return (
    <Tag
      style={getTagStyle()}
      className={`${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
