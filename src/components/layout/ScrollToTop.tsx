import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // On remonte systématiquement en haut à chaque changement de page
    // On utilise "instant" pour éviter de voir la page défiler, ce qui fait plus "pro"
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}
