import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Un micro-délai pour assurer que le rendu de la page a commencé
    // Cela rend le démarrage du scroll beaucoup plus "naturel"
    const timeout = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth", // La clé pour la douceur
      });
    }, 10);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}
