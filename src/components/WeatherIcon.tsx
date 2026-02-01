interface WeatherIconProps {
  code: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16' };

export function WeatherIcon({ code, size = 'md', className = '' }: WeatherIconProps) {
  const s = sizeMap[size];
  const src = `https://openweathermap.org/img/wn/${code}@2x.png`;
  return <img src={src} alt="" className={`${s} ${className}`} />;
}
