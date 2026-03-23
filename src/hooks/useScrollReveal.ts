import { useEffect, useRef } from "react";

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * Applies a gentle fade-in + slide-up scroll reveal to all children
 * matching `[data-reveal]` inside the given container ref.
 * 
 * Usage: add `ref={containerRef}` to a wrapper, then put `data-reveal`
 * on any element you want animated. Optional `data-reveal-delay="200"`
 * for staggered timing.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
) {
  const ref = useRef<T>(null);
  const { threshold = 0.12, rootMargin = "0px 0px -40px 0px", once = true } = options;

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const elements = container.querySelectorAll("[data-reveal]");
    if (elements.length === 0) return;

    // Set initial hidden state via inline styles (avoids flash)
    elements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.opacity = "0";
      htmlEl.style.transform = "translateY(32px)";
      htmlEl.style.transition = "opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      const delay = htmlEl.dataset.revealDelay;
      if (delay) {
        htmlEl.style.transitionDelay = `${delay}ms`;
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const htmlEl = entry.target as HTMLElement;
            htmlEl.style.opacity = "1";
            htmlEl.style.transform = "translateY(0)";
            if (once) observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return ref;
}
