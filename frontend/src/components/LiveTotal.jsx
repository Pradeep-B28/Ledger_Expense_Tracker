import { useEffect, useRef, useState } from 'react';

export default function LiveTotal({ total, count }) {
  const [displayValue, setDisplayValue] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    const start = displayValue;
    const end = total;
    const duration = 400;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(start + (end - start) * eased);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayValue(end);
      }
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  return (
    <div className="total-card">
      <div className="eyebrow">Total spent</div>
      <div className="total-value">
        <span className="currency">₹</span>
        {displayValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
      </div>
      <div className="subline">
        {count} {count === 1 ? 'entry' : 'entries'} · updates instantly, no page refresh
      </div>
    </div>
  );
}
