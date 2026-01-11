interface SkeletonProps {
  className?: string;
  variant?: 'circular' | 'rectangular' | 'text';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton = ({ 
  className = '', 
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse'
}: SkeletonProps) => {
  const baseClasses = 'bg-slate-200';
  const variantClasses = {
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    text: 'rounded'
  };
  
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]',
    none: ''
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
};

