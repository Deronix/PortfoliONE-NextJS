// components/Loader.js
"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import styles2 from "./loading.module.css";

const Loader = ({ onLoadingComplete }) => {
  const loaderRef = useRef(null);
  const sandRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: () => {
        gsap.to(loaderRef.current, {
          autoAlpha: 0,
          duration: 0.5,
          onComplete: onLoadingComplete,
        });
      },
    });

    // Single sand animation from top to bottom
    tl.to(sandRef.current, {
      attr: { y: 120, height: 0 },
      duration: 2,
    }).to(
      textRef.current,
      {
        opacity: 0.2,
        repeat: 3,
        yoyo: true,
        duration: 0.5,
      },
      0
    );

    return () => tl.kill();
  }, [onLoadingComplete]);

  return (
    <div ref={loaderRef} className={styles2.fixeditem} style={{ zIndex: 9999 }}>
      <svg width="120" height="120" viewBox="0 0 120 120" className="relative">
        {/* Hourglass frame */}
        <path
          d="M36 120L84 120L69.6 60L84 0L36 0L50.4 60Z"
          fill="none"
          stroke="var(--background)"
          strokeWidth="5"
        />

        {/* Single sand element */}
        <rect
          ref={sandRef}
          x="36"
          y="0"
          width="48"
          height="120"
          fill="var(--foreground)"
          clipPath="url(#hourglass-clip)"
        />

        <clipPath id="hourglass-clip">
          <polygon points="36,120 84,120 70,60 84,0 36,0 50.4,60" />
        </clipPath>
      </svg>
      <div ref={textRef} className={styles2.fantasyText}>
        <span>​🇾​​🇺​​🇰​​🇱​​🇪​​🇳​​🇮​​🇾​​🇴​​🇷​
        </span>
        <span>...</span>
      </div>
    </div>
  );
};

export default Loader;
