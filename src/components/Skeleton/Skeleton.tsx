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
  animation = 'pulse',
}: SkeletonProps) => {
  const baseClasses = 'bg-slate-200';

  const variantClasses = {
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    text: 'rounded',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave:
      'bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]',
    none: '',
  };

  // ✅ создаём style только если реально нужен
  const style: React.CSSProperties | undefined =
    width !== undefined || height !== undefined
      ? {
          ...(width !== undefined && {
            width: typeof width === 'number' ? `${width}px` : width,
          }),
          ...(height !== undefined && {
            height: typeof height === 'number' ? `${height}px` : height,
          }),
        }
      : undefined;

  return (
    <div
    aria-label="Загрузка..."
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
};