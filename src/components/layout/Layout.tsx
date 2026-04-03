import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import AuthFooter from "./AuthFooter";
import FloatingChatButton from "./FloatingChatButton";
import GiftPopup from "./GiftPopup";
import ScrollToTop from "./ScrollToTop";
import BackToTopButton from "./BackToTopButton";
import { supabase } from "@/integrations/supabase/client";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  // Hide footer & floating elements during onboarding or messaging
  const isOnboardingFlow = location.pathname === "/onboarding";
  const isMessagesPage = location.pathname === "/messages";
  const isReservationFlow = location.pathname.startsWith("/reservation");
  const hideFooter = isOnboardingFlow || isMessagesPage || isReservationFlow;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
      <main key={location.pathname} className="flex-1 pt-16 md:pt-20 animate-in fade-in duration-[2000ms] ease-in-out">
        {children}
      </main>{" "}
      {!hideFooter && (isAuthenticated ? <AuthFooter /> : <Footer />)}
      {!hideFooter && <FloatingChatButton />}
      {!hideFooter && <BackToTopButton />}
      {!hideFooter && <GiftPopup />}
    </div>
  );
}
