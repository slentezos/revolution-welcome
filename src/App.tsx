import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import APropos from "./pages/APropos";
import NotreDémarche from "./pages/NotreMethode";
import Conseils from "./pages/Conseils";
import ContactRouter from "./pages/ContactRouter";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import MotDePasseOublie from "./pages/MotDePasseOublie";
import ReinitialiserMotDePasse from "./pages/ReinitialiserMotDePasse";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Messages from "./pages/Messages";
import Profil from "./pages/Profil";
import NotFound from "./pages/NotFound";
import EmailPreview from "./pages/EmailPreview";
import CharteBienveillance from "./pages/CharteBienveillance";
import Parrainage from "./pages/Parrainage";
import FAQ from "./pages/FAQ";
import Editorial from "./pages/Editorial";
import EditorialArticle from "./pages/EditorialArticle";
import ListeAttente from "./pages/ListeAttente";
import MentionsLegales from "./pages/MentionsLegales";
import Cookies from "./pages/Cookies";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
import CGU from "./pages/CGU";
import SignalerContenu from "./pages/SignalerContenu";
import ContactMember from "./pages/ContactMember";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/notre-démarche" element={<NotreDémarche />} />
          <Route path="/conseils" element={<Conseils />} />
          <Route path="/contact" element={<ContactRouter />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/mot-de-passe-oublie" element={<MotDePasseOublie />} />
          <Route path="/reinitialiser-mot-de-passe" element={<ReinitialiserMotDePasse />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/email-preview" element={<EmailPreview />} />
          <Route path="/charte-bienveillance" element={<CharteBienveillance />} />
          <Route path="/parrainage" element={<Parrainage />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/editorial" element={<Editorial />} />
          <Route path="/editorial/:slug" element={<EditorialArticle />} />
          <Route path="/liste-attente" element={<ListeAttente />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
          <Route path="/cgu" element={<CGU />} />
          <Route path="/signaler-contenu" element={<SignalerContenu />} />
          <Route path="/contact-prive" element={<ContactMember />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
