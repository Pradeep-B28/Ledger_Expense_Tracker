export default function Skeleton({ className, width, height, borderRadius = '8px' }) {
  return (
    <div
      className={`skeleton-base ${className || ''}`}
      style={{
        width: width || '100%',
        height: height || '20px',
        borderRadius: borderRadius,
      }}
    />
  );
}
