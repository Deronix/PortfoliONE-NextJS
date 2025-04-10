"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const SMOOTHNESS = 0.05;
const SCROLL_SPEED = 0.5;
const SCROLL_THRESHOLD = 0.1;

export const SmoothScroll = () => {
  const target = useRef(0);
  const current = useRef(0);
  const maxScroll = useRef(0);
  const isScrolling = useRef(false);
  const touchStartY = useRef(0);

  const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
  const setBodyHeight = () => {
    document.body.style.height = `${maxScroll.current + window.innerHeight}px`;
  };

  useEffect(() => {
    const updateMaxScroll = () => {
      maxScroll.current = document.documentElement.scrollHeight - window.innerHeight;
      setBodyHeight();
    };
    
    updateMaxScroll();
    
    const handleWheel = (e) => {
      if (isScrolling.current) return;
      const delta = e.deltaY * SCROLL_SPEED * (e.deltaMode === 1 ? 40 : 1);
      target.current = clamp(target.current + delta, 0, maxScroll.current);
      e.preventDefault();
    };

    const handleTouchStart = (e) => {
      isScrolling.current = true;
      touchStartY.current = e.touches[0].clientY;
      current.current = window.scrollY;
    };

    const handleTouchMove = (e) => {
      if (!isScrolling.current) return;
      const delta = (touchStartY.current - e.touches[0].clientY) * SCROLL_SPEED;
      target.current = clamp(target.current + delta, 0, maxScroll.current);
      touchStartY.current = e.touches[0].clientY;
      e.preventDefault();
    };

    const handleTouchEnd = () => {
      isScrolling.current = false;
    };

    const animate = () => {
      const delta = target.current - current.current;
      current.current += delta * SMOOTHNESS;
      
      if (Math.abs(delta) > SCROLL_THRESHOLD) {
        window.scrollTo(0, current.current);
      } else {
        current.current = target.current;
        window.scrollTo(0, target.current);
      }
    };

    gsap.ticker.add(animate);
    
    const resizeObserver = new ResizeObserver(updateMaxScroll);
    resizeObserver.observe(document.documentElement);

    // Hide scrollbar
    document.documentElement.style.overflow = "hidden";

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      gsap.ticker.remove(animate);
      resizeObserver.disconnect();
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      
      // Reset styles on cleanup

      document.body.style.height = "auto"; // Reset body height to default
      window.scrollTo(0, 0); // Reset scroll position to top for the new page
      document.documentElement.style.overflow = "";

    };
  }, []);

  return null;
}; 

