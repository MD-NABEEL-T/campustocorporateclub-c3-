import { useState, useEffect, useRef } from 'react';

// Mounts children when scrolled near, and UNMOUNTS them again once scrolled
// far away - unlike a mount-once approach, this actually frees GPU/WebGL
// resources instead of leaving every background running forever.
const ViewportGate = ({ children, rootMargin = '300px', className = 'absolute inset-0' }) => {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setMounted(entry.isIntersecting),
      { rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={className}>
      {mounted && children}
    </div>
  );
};

export default ViewportGate;