"use client";
import { useEffect } from "react";

// Sets root font-size so that 1rem scales relative to viewport for desktop
export default function RemUnit() {
  useEffect(() => {
    const setRemUnit = () => {
      const screenRatio = 16 / 9;
      const isLandscape = window.innerWidth / window.innerHeight >= screenRatio;
      const size = isLandscape
        ? window.innerHeight / 1080
        : window.innerWidth / 1920;
      document.documentElement.style.fontSize = `${size}px`;
    };
    window.addEventListener("resize", setRemUnit);
    setRemUnit();
    return () => window.removeEventListener("resize", setRemUnit);
  }, []);
  return null;
}
