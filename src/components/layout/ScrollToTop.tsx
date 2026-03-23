import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const legalRoutes = [
  "/mentions-legales",
  "/politique-confidentialite",
  "/cgu",
  "/cookies",
  "/charte-bienveillance",
  "/signaler-contenu",
  "/faq",
];

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    const wasLegal = legalRoutes.includes(prevPathname.current);
    const isLegal = legalRoutes.includes(pathname);

    // Don't scroll to top when navigating between legal pages
    if (!(wasLegal && isLegal)) {
      window.scrollTo(0, 0);
    }

    prevPathname.current = pathname;
  }, [pathname]);

  return null;
}
