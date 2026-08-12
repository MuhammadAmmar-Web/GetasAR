import React, { useEffect, useRef, useState } from 'react';

/**
 * LazyBackground component
 * Renders a div with a background image that is only loaded when the element enters the viewport.
 * Uses IntersectionObserver for efficient lazy loading.
 *
 * @param {string} image - URL of the background image.
 * @param {string} className - Additional CSS classes for styling.
 * @param {object} rest - Any other props to pass to the div.
 */
const LazyBackground = ({ image, className = '', ...rest }) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '200px' }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const style = isVisible ? { backgroundImage: `url(${image})` } : {};

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ backgroundSize: 'cover', backgroundPosition: 'center', ...style }}
      {...rest}
    />
  );
};

export default LazyBackground;
