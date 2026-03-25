import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Contact from "./Contact";
import ContactMember from "./ContactMember";

export default function ContactRouter() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoggedIn === null) return null;

  return isLoggedIn ? <ContactMember /> : <Contact />;
}
