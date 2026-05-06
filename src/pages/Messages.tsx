import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Search,
  Send,
  ArrowLeft,
  ShieldCheck,
  Lightbulb,
  Lock,
  X,
  Flag,
  Clock,
  Eye,
  Mic,
  MicOff,
  Volume2,
  Check,
  Phone,
  Video,
  Info,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import MatchProfileModal from "@/components/dashboard/MatchProfileModal";
import ReportModal from "@/components/messages/ReportModal";
import UnmatchModal from "@/components/messages/UnmatchModal";
import ChatTooltipOverlay from "@/components/messages/ChatTooltipOverlay";
import BenevolenceModal from "@/components/messages/BenevolenceModal";
import { checkMessage } from "@/utils/wordFilter";

// Parseur de ponctuation et de mise en forme pour le français
const formatSpeech = (text: string) => {
  if (!text) return "";
  return (
    text
      // Ordre important : expressions longues d'abord
      .replace(/\bpoints? d['']interrogation\b/gi, "?")
      .replace(/\bpoints? d['']exclamation\b/gi, "!")
      .replace(/\bpoints de suspension\b/gi, "...")
      .replace(/\bnouveau paragraphe\b/gi, "\n\n")
      .replace(/\b(à|a) la ligne\b/gi, "\n")
      .replace(/\bretour (à|a) la ligne\b/gi, "\n")
      .replace(/\bvirgule\b/gi, ",")
      .replace(/\bpoint-virgule\b/gi, ";")
      .replace(/\bdeux points\b/gi, ":")
      .replace(/\bpoint\b/gi, ".")
      .replace(/\s+([,;:?.!])/g, "$1") // Supprime l'espace inutile avant la ponctuation
      .replace(/([?.!])\s*([a-zà-ÿ])/gi, (match, p1, p2) => `${p1} ${p2.toUpperCase()}`)
  ); // Majuscule auto après ponctuation
};

const capitalizeFirst = (str: string) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const conseils = [
  "Prenez le temps de bien lire le profil de votre correspondant(e).",
  "Posez des questions ouvertes pour mieux connaître l'autre.",
  "Restez authentique et sincère dans vos échanges.",
  "Ne partagez pas d'informations personnelles trop rapidement.",
  "Privilégiez les échanges sur notre plateforme au début.",
  "Faites confiance à votre intuition si quelque chose vous semble suspect.",
  "Proposez un premier rendez-vous dans un lieu public.",
  "Prévenez un proche de votre rendez-vous.",
  "Profitez de chaque échange, c'est le début d'une belle aventure !",
];

const initialConversations = [
  {
    id: 1,
    name: "Marie",
    age: 67,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
    lastMessage: "Bonjour ! Comment allez-vous ?",
    time: "14:30",
    unread: 2,
    online: true,
    location: "Paris, France",
    affinity: 87,
    height: "1m65",
    origin: "Française",
    isNew: true,
    myTurn: true,
  },
  {
    id: 2,
    name: "Sophie",
    age: 59,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    lastMessage: "Merci pour votre message !",
    time: "Hier",
    unread: 0,
    online: false,
    location: "Lyon, France",
    affinity: 79,
    height: "1m62",
    origin: "Française",
    isNew: false,
    myTurn: false,
  },
  {
    id: 3,
    name: "Catherine",
    age: 71,
    avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=300&h=300&fit=crop&crop=face",
    lastMessage: "À bientôt !",
    time: "Lundi",
    unread: 0,
    online: true,
    location: "Nice, France",
    affinity: 92,
    height: "1m58",
    origin: "Italienne",
    isNew: false,
    myTurn: true,
  },
];

const mockMessages = [
  { id: 1, sender: "them", text: "Bonjour ! Comment allez-vous ?", time: "14:25", read: true },
  { id: 2, sender: "me", text: "Très bien merci ! Et vous ?", time: "14:27", read: true },
  {
    id: 3,
    sender: "them",
    text: "Je vais bien aussi. J'ai vu votre profil et je trouve que nous avons beaucoup de points communs.",
    time: "14:28",
    read: true,
  },
  { id: 4, sender: "them", text: "Aimez-vous voyager ?", time: "14:30", read: false },
];

const FONT_SIZES = [13, 14, 15, 16, 18, 20, 22, 24, 26]; // Tailles de police pour le zoom

export default function Messages() {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);

  // ÉTATS GLOBAUX
  const [message, setMessage] = useState("");
  const [showConseils, setShowConseils] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileToView, setProfileToView] = useState<(typeof initialConversations)[number] | null>(null);
  const [showNewConvPopup, setShowNewConvPopup] = useState(false);
  const [dismissedNewConv, setDismissedNewConv] = useState<Set<number>>(new Set());
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<string>("");
  const [unmatchModalOpen, setUnmatchModalOpen] = useState(false);
  const [unmatchTarget, setUnmatchTarget] = useState<string>("");
  const [benevolenceModalOpen, setBenevolenceModalOpen] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);

  // ÉTATS DE LA DICTÉE INTELLIGENTE
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const recognitionRef = useRef<any>(null);

  const [speakingMsgId, setSpeakingMsgId] = useState<number | null>(null);
  const [isSent, setIsSent] = useState(false);
  const [chatFontSizeIndex, setChatFontSizeIndex] = useState(4); // Démarre à 18px
  const sendTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const prevConversationsRef = useRef(conversations);

  const [chatTooltipShown, setChatTooltipShown] = useState<Set<number>>(() => {
    try {
      const stored = localStorage.getItem("kalimera_chat_tooltip_shown");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [showChatTooltip, setShowChatTooltip] = useState(false);
  const navigate = useNavigate();
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const chatFontSize = FONT_SIZES[chatFontSizeIndex];

  useEffect(() => {
    audioRef.current = new Audio("/sounds/new-message.mp3");
  }, []);

  useEffect(() => {
    const prevUnread = prevConversationsRef.current.reduce((sum, c) => sum + (c.unread || 0), 0);
    const currUnread = conversations.reduce((sum, c) => sum + (c.unread || 0), 0);
    if (currUnread > prevUnread && document.hidden && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
    prevConversationsRef.current = conversations;
  }, [conversations]);

  // FONCTION DE REDIMENSIONNEMENT DU TEXTAREA
  const adjustTextareaHeight = useCallback(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      const scrollHeight = ta.scrollHeight;
      // Max height set to 150px
      if (scrollHeight > 150) {
        ta.style.height = "150px";
      } else {
        ta.style.height = `${scrollHeight}px`;
      }
      // Force le scroll vers le bas pendant la dictée ou la frappe
      ta.scrollTop = ta.scrollHeight;
    }
  }, []);

  // Ajustement quand le message ou le texte intermédiaire (dictée) change
  useEffect(() => {
    adjustTextareaHeight();
  }, [message, interimText, chatFontSize, adjustTextareaHeight]);

  // Ref miroir pour éviter les closures stales sur isListening
  const listeningRef = useRef(false);
  useEffect(() => {
    listeningRef.current = isListening;
  }, [isListening]);

  // MOTEUR DE DICTÉE VOCALE — initialisé UNE SEULE FOIS
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "fr-FR";

    recognition.onresult = (event: any) => {
      // Si l'utilisateur a demandé l'arrêt, on ignore les derniers résultats
      if (!listeningRef.current) return;

      let finalSegment = "";
      let interimSegment = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result?.[0]?.transcript || "";
        if (!transcript) continue;
        if (result.isFinal) finalSegment += transcript + " ";
        else interimSegment += transcript;
      }

      if (finalSegment) {
        setMessage((prev) => {
          const currentVal = prev || "";
          let formattedFinal = formatSpeech(finalSegment).trim();
          if (currentVal.trim() === "" || /[.!?]\s*$/.test(currentVal)) {
            formattedFinal = capitalizeFirst(formattedFinal);
          }
          const needsSpace =
            currentVal.length > 0 &&
            !currentVal.endsWith(" ") &&
            !currentVal.endsWith("\n") &&
            !formattedFinal.startsWith(",") &&
            !formattedFinal.startsWith(".");
          const space = needsSpace ? " " : "";
          return currentVal + space + formattedFinal;
        });
      }

      setInterimText(formatSpeech(interimSegment));
      setTimeout(adjustTextareaHeight, 0);
    };

    recognition.onerror = () => {
      listeningRef.current = false;
      setIsListening(false);
      setInterimText("");
    };
    recognition.onend = () => {
      listeningRef.current = false;
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {}
      try {
        recognition.abort?.();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleListening = useCallback(() => {
    if (listeningRef.current) {
      // Stop
      listeningRef.current = false;
      setIsListening(false);
      try {
        recognitionRef.current?.stop();
      } catch {}
      try {
        recognitionRef.current?.abort?.();
      } catch {}

      // Valide le texte intermédiaire en cours
      if (interimText) {
        setMessage((prev) => {
          const currentVal = prev || "";
          let finalInterim = interimText.trim();
          if (currentVal.trim() === "" || /[.!?]\s*$/.test(currentVal)) {
            finalInterim = capitalizeFirst(finalInterim);
          }
          const space = currentVal.length > 0 && !currentVal.endsWith(" ") ? " " : "";
          return currentVal + space + finalInterim + " ";
        });
      }
      setInterimText("");
    } else {
      if (!recognitionRef.current) {
        toast.error("La dictée vocale n'est pas supportée par votre navigateur.");
        return;
      }
      setInterimText("");
      setMessage((prev) => {
        const currentVal = prev || "";
        if (currentVal !== "" && !currentVal.endsWith(" ") && !currentVal.endsWith("\n")) {
          return currentVal + " ";
        }
        return currentVal;
      });
      try {
        recognitionRef.current.start();
        listeningRef.current = true;
        setIsListening(true);
      } catch {
        listeningRef.current = false;
        setIsListening(false);
      }
    }
  }, [interimText]);

  // GESTION DU SCROLL DYNAMIQUE À LA FRAPPE MANUELLE
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    // Majuscule automatique sur la première lettre de la phrase
    const capitalizedValue = val.length === 1 ? capitalizeFirst(val) : val;

    setMessage(capitalizedValue);

    // Si frappe manuelle pendant/après dictée, on tue le texte fantôme
    if (interimText) setInterimText("");

    adjustTextareaHeight();
  };

  const speakMessage = useCallback(
    (msgId: number, text: string) => {
      if (speakingMsgId === msgId) {
        window.speechSynthesis.cancel();
        setSpeakingMsgId(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "fr-FR";
      utterance.rate = 0.9;
      const voices = window.speechSynthesis.getVoices();
      const frVoice = voices.find((v) => v.lang.startsWith("fr"));
      if (frVoice) utterance.voice = frVoice;
      utterance.onend = () => setSpeakingMsgId(null);
      setSpeakingMsgId(msgId);
      window.speechSynthesis.speak(utterance);
    },
    [speakingMsgId],
  );

  const scrollToBottom = useCallback((smooth = true) => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: smooth ? "smooth" : "auto" });
    }
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      setTimeout(() => scrollToBottom(false), 100);
    }
  }, [selectedConversation, scrollToBottom]);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/connexion");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_step")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!profile || profile.onboarding_step !== "completed") {
        navigate("/onboarding");
        return;
      }
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  const handleSend = () => {
    if (message.trim() && !isSent) {
      const { isSafe } = checkMessage(message);
      if (!isSafe) {
        setBenevolenceModalOpen(true);
        if (isListening) toggleListening();
        return;
      }
      setMessage("");
      setIsSent(true);
      if (isListening) toggleListening();
      if (sendTimeoutRef.current) clearTimeout(sendTimeoutRef.current);
      sendTimeoutRef.current = setTimeout(() => setIsSent(false), 1500);
      setTimeout(() => scrollToBottom(), 150);
      setComposerOpen(false);

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  useEffect(() => {
    return () => {
      if (sendTimeoutRef.current) clearTimeout(sendTimeoutRef.current);
      if (isListening && recognitionRef.current) recognitionRef.current.stop();
    };
  }, [isListening]);

  const handleSelectConversation = (convId: number) => {
    setSelectedConversation(convId);
    if (isListening) toggleListening();
    const conv = conversations.find((c) => c.id === convId);
    if (conv?.isNew && !dismissedNewConv.has(convId)) setShowNewConvPopup(true);
    if (!chatTooltipShown.has(convId)) setTimeout(() => setShowChatTooltip(true), 600);
  };

  const handleDismissChatTooltip = () => {
    setShowChatTooltip(false);
    if (selectedConversation) {
      const updated = new Set(chatTooltipShown).add(selectedConversation);
      setChatTooltipShown(updated);
      localStorage.setItem("kalimera_chat_tooltip_shown", JSON.stringify([...updated]));
    }
  };

  const handleDismissNewConv = () => {
    if (selectedConversation) setDismissedNewConv((prev) => new Set(prev).add(selectedConversation));
    setShowNewConvPopup(false);
  };

  const handleUnmatch = (name: string) => {
    setConversations((prev) => prev.filter((c) => c.name !== name));
    setSelectedConversation(null);
    toast.success(`Vous avez retiré ${name} de vos matchs.`);
  };

  const handleReport = (name: string) => {
    setReportTarget(name);
    setReportModalOpen(true);
  };

  const handleAvatarClick = (conv: (typeof initialConversations)[number], e: React.MouseEvent) => {
    e.stopPropagation();
    setProfileToView(conv);
    setProfileModalOpen(true);
  };

  const handleViewProfile = (conv: (typeof initialConversations)[number]) => {
    setProfileToView(conv);
    setProfileModalOpen(true);
  };

  const selectedChat = conversations.find((c) => c.id === selectedConversation);

  const matchProfileData = profileToView
    ? {
        id: profileToView.id,
        name: profileToView.name,
        age: profileToView.age,
        location: profileToView.location,
        affinity: profileToView.affinity,
        avatar: profileToView.avatar,
        height: profileToView.height,
        origin: profileToView.origin,
      }
    : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="animate-pulse text-muted-foreground text-lg">Chargement...</div>
      </div>
    );
  }

  // Sécurité ultime pour l'affichage (fusion du texte tapé + texte en cours de dictée sans undefined)
  const safeMessage = message || "";
  const displayValue = isListening || interimText ? safeMessage + interimText : safeMessage;

  return (
    <Layout>
      <div className="h-[calc(100vh-64px)] bg-secondary overflow-hidden flex flex-col">
        {/* RETOUR À MAX-W-6XL : Largeur idéale pour le confort visuel senior */}
        <div className="max-w-6xl mx-auto w-full px-4 md:px-8 py-6 flex-1 overflow-hidden">
          <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-amber-50/50 overflow-hidden flex h-full">
            {/* ===== PRIVATE LOUNGE SIDEBAR ===== */}
            <div
              className={`w-full md:w-96 shrink-0 border-r border-amber-100/40 flex flex-col bg-white ${selectedConversation ? "hidden md:flex" : "flex"}`}
            >
              <div className="p-6 border-b border-amber-100/40">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-2xl font-bold text-[#1B2333]">Mes conversations</h2>
                  {/* Le Tooltip Cercle privé a été retiré d'ici pour être placé en bas */}
                </div>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    className="pl-11 h-11 bg-secondary border-amber-100/60 rounded-xl text-[15px]"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`w-full px-6 py-5 flex items-center gap-4 transition-all text-left border-b border-amber-50/60 ${
                      selectedConversation === conv.id
                        ? "bg-amber-50/30 border-l-2 border-l-[hsl(var(--gold))]"
                        : "hover:bg-amber-50/20"
                    }`}
                  >
                    <div className="relative shrink-0 cursor-pointer group" onClick={(e) => handleAvatarClick(conv, e)}>
                      <img
                        src={conv.avatar}
                        alt={conv.name}
                        className="w-16 h-16 rounded-full object-cover ring-2 ring-amber-100/40 group-hover:ring-[hsl(var(--gold))]/50 transition-all"
                      />
                      {conv.online && (
                        <div
                          className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full ring-2 ring-white"
                          style={{ backgroundColor: "hsl(142, 71%, 45%)" }}
                        />
                      )}
                      {conv.unread > 0 && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#1B2333] text-white text-base rounded-full flex items-center justify-center font-semibold">
                          {conv.unread}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-heading font-semibold text-[#1B2333] text-2xl truncate">
                          {conv.name}, {conv.age}
                        </h4>
                        <span className="text-muted-foreground font-medium text-xl shrink-0 ml-2">{conv.time}</span>
                      </div>
                      <p className="text-muted-foreground truncate text-xl">{conv.lastMessage}</p>
                      {conv.myTurn && (
                        <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full font-semibold bg-[hsl(var(--gold))]/10 text-[hsl(var(--gold))] text-xl">
                          À vous de répondre
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <div className="p-5 border-t border-amber-100/40 bg-amber-50/20 flex flex-col gap-3">
                <button
                  onClick={() => setShowConseils(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl hover:bg-amber-50/60 transition-colors"
                >
                  <ShieldCheck className="h-5 w-5 text-[hsl(var(--gold))]" />
                  <span className="font-medium text-muted-foreground text-xl">9 conseils de sécurité</span>
                </button>

                {/* TOOLTIP CERCLE PRIVÉ (Déplacé en bas et relooké) */}
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="w-full flex items-center justify-center gap-2 py-2 rounded-xl cursor-help opacity-80 hover:opacity-100 transition-opacity">
                        <Lock className="h-4 w-4 text-[hsl(var(--gold))]" />
                        <span className="font-medium text-[#1B2333] text-lg">Cercle privé</span>
                        <Info className="h-4 w-4 text-muted-foreground/50" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="max-w-[320px] bg-[#1B2333] text-white border border-[hsl(var(--gold))]/30 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] rounded-2xl p-6 z-50 animate-in fade-in zoom-in-95"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Lock className="h-5 w-5 text-[hsl(var(--gold-light))]" />
                        <p className="font-heading font-semibold text-[hsl(var(--gold-light))] text-3xl">
                          Votre Cercle Privé
                        </p>
                      </div>
                      <p className="text-white/90 text-xl leading-relaxed mb-3">
                        Espace exclusif et confidentiel où vos échanges sont protégés. Seuls vos matchs validés peuvent
                        vous écrire.
                      </p>
                      <p className="leading-relaxed italic text-xl text-primary-foreground">
                        La confidentialité est absolue : vos messages sont strictement personnels et ne peuvent être lus
                        par nos équipes, administrateurs inclus.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* ===== CHAT AREA ===== */}
            <div
              className={`flex-1 flex flex-col bg-[hsl(var(--cream))]/20 min-w-0 ${selectedConversation ? "flex" : "hidden md:flex"}`}
            >
              {selectedChat ? (
                <>
                  <div className="px-6 py-4 lg:px-8 lg:py-5 border-b border-amber-100/40 bg-white">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setSelectedConversation(null)}
                        className="md:hidden p-2 hover:bg-amber-50 rounded-xl transition-colors shrink-0"
                      >
                        <ArrowLeft className="h-6 w-6 text-[#1B2333]" />
                      </button>
                      <div
                        className="relative cursor-pointer group shrink-0"
                        onClick={(e) => handleAvatarClick(selectedChat, e)}
                      >
                        <img
                          src={selectedChat.avatar}
                          alt={selectedChat.name}
                          className="w-12 h-12 lg:w-14 lg:h-14 rounded-full object-cover ring-2 ring-amber-100/40 group-hover:ring-[hsl(var(--gold))]/50 transition-all"
                        />
                        {conversations.find((c) => c.id === selectedConversation)?.online && (
                          <div
                            className="absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white"
                            style={{ backgroundColor: "hsl(142, 71%, 45%)" }}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 pr-4">
                        <h3 className="font-heading font-bold text-[#1B2333] leading-tight text-2xl lg:text-3xl truncate">
                          {selectedChat.name}, {selectedChat.age}
                        </h3>
                        <p className="font-medium text-base lg:text-lg mt-0.5" style={{ color: "hsl(142, 71%, 35%)" }}>
                          En ligne
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 overflow-x-auto no-scrollbar">
                        <button
                          onClick={() => setChatFontSizeIndex((i) => Math.max(0, i - 1))}
                          className="h-10 px-3.5 rounded-lg border border-amber-100 bg-white hover:bg-amber-50 flex items-center justify-center transition-colors shrink-0"
                          aria-label="Réduire la taille du texte"
                        >
                          <span className="text-base font-bold text-[#1B2333]">A−</span>
                        </button>
                        <button
                          onClick={() => setChatFontSizeIndex((i) => Math.min(FONT_SIZES.length - 1, i + 1))}
                          className="h-10 px-3.5 rounded-lg border border-amber-100 bg-white hover:bg-amber-50 flex items-center justify-center transition-colors shrink-0"
                          aria-label="Augmenter la taille du texte"
                        >
                          <span className="text-base font-bold text-[#1B2333]">A+</span>
                        </button>
                        <div className="w-px h-6 bg-amber-100/60 mx-1 shrink-0" />
                        {(() => {
                          const messageCount = mockMessages.length;
                          const isLocked = messageCount < 5;
                          return (
                            <>
                              <button
                                className="h-10 px-4 rounded-lg border border-amber-100 bg-white hover:bg-amber-50 flex items-center gap-2 transition-colors shrink-0"
                                aria-label="Appel audio"
                                onClick={() => {
                                  if (isLocked) {
                                    toast(
                                      "🔒 Pour votre sécurité, les appels se débloquent automatiquement après quelques messages échangés.",
                                      { position: "bottom-left", duration: 4000 },
                                    );
                                  } else {
                                    toast.info("Lancement de l'appel...");
                                  }
                                }}
                              >
                                {isLocked ? (
                                  <Lock className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Phone className="h-4 w-4 text-[#1B2333]" />
                                )}
                                <span className="text-xl font-medium text-[#1B2333] hidden xl:inline">Appeler</span>
                              </button>
                              <button
                                className="h-10 px-4 rounded-lg border border-amber-100 bg-white hover:bg-amber-50 flex items-center gap-2 transition-colors shrink-0"
                                aria-label="Appel vidéo"
                                onClick={() => {
                                  if (isLocked) {
                                    toast(
                                      "🔒 Pour votre sécurité, les appels se débloquent automatiquement après quelques messages échangés.",
                                      { position: "bottom-left", duration: 4000 },
                                    );
                                  } else {
                                    toast.info("Lancement de l'appel vidéo...");
                                  }
                                }}
                              >
                                {isLocked ? (
                                  <Lock className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Video className="h-4 w-4 text-[#1B2333]" />
                                )}
                                <span className="text-xl font-medium text-[#1B2333] hidden xl:inline">Vidéo</span>
                              </button>
                            </>
                          );
                        })()}
                        <div className="w-px h-6 bg-amber-100/60 mx-1 shrink-0" />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewProfile(selectedChat)}
                          className="gap-2 text-[#1B2333] hover:bg-amber-50 rounded-lg h-10 text-xl font-medium shrink-0"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="hidden lg:inline">Voir profil</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReport(selectedChat.name)}
                          className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg h-10 text-xl font-medium shrink-0"
                        >
                          <Flag className="h-4 w-4" />
                          <span className="hidden lg:inline">Signaler</span>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* MESSAGES AREA */}
                  <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 flex flex-col">
                    {selectedChat.isNew && !dismissedNewConv.has(selectedChat.id) ? (
                      <div className="flex-1 flex flex-col items-center justify-center h-full gap-6 py-12 px-6">
                        <img
                          src={selectedChat.avatar}
                          alt={selectedChat.name}
                          className="w-28 h-28 rounded-full object-cover ring-4 ring-amber-100/40 cursor-pointer hover:ring-[hsl(var(--gold))]/60 transition-all"
                          onClick={(e) => handleAvatarClick(selectedChat, e)}
                        />
                        <p className="text-muted-foreground text-xl text-center italic">
                          Cliquez sur la photo pour en savoir plus sur {selectedChat.name}.
                        </p>
                        <p className="text-foreground text-xl font-medium text-center max-w-lg leading-relaxed">
                          ⏳ Voici une nouvelle proposition. Le temps est précieux. Sans premier échange de votre part
                          d'ici <span className="font-bold text-[#1B2333]">6 jours</span>, votre mise en relation avec{" "}
                          <span className="font-heading font-bold text-[#1B2333]">{selectedChat.name}</span> sera
                          discrètement archivée pour laisser place à de nouvelles rencontres.
                        </p>
                        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1B2333]/10 text-[#1B2333] font-semibold text-xl">
                          <Send className="h-5 w-5" />
                          Démarrer le chat
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3 my-4">
                          <div className="flex-1 h-px bg-amber-100/50" />
                          <span className="text-muted-foreground font-medium px-4 py-1.5 rounded-full bg-white border border-amber-100/40 text-lg">
                            Aujourd'hui
                          </span>
                          <div className="flex-1 h-px bg-amber-100/50" />
                        </div>
                        {mockMessages.map((msg) => (
                          <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                            {msg.sender === "them" && (
                              <img
                                src={selectedChat.avatar}
                                alt=""
                                className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover mr-4 mt-auto shrink-0 cursor-pointer hover:ring-2 hover:ring-[hsl(var(--gold))]/40 transition-all"
                                onClick={(e) => handleAvatarClick(selectedChat, e)}
                              />
                            )}
                            <div
                              className={`max-w-[85%] lg:max-w-[75%] rounded-2xl px-5 py-4 shadow-sm ${msg.sender === "me" ? "bg-[#1B2333] text-white rounded-br-md" : "bg-white rounded-bl-md border border-amber-100/40"}`}
                            >
                              <p
                                className={`leading-relaxed ${msg.sender === "them" ? "text-foreground" : "text-white"}`}
                                style={{ fontSize: `${chatFontSize}px` }}
                              >
                                {msg.text}
                              </p>
                              <div
                                className={`flex items-center gap-2 mt-2 ${msg.sender === "me" ? "justify-end" : ""}`}
                              >
                                <p
                                  className={`text-base ${msg.sender === "me" ? "text-white/50" : "text-muted-foreground"}`}
                                >
                                  {msg.sender === "me"
                                    ? msg.read
                                      ? `Lu à ${msg.time}`
                                      : `Remis à ${msg.time}`
                                    : msg.time}
                                </p>
                                {msg.sender === "them" && (
                                  <button
                                    onClick={() => speakMessage(msg.id, msg.text)}
                                    className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-amber-50 transition-colors"
                                    aria-label="Écouter le message"
                                  >
                                    <Volume2
                                      className={`h-5 w-5 transition-colors ${speakingMsgId === msg.id ? "text-[hsl(var(--gold))]" : "text-muted-foreground"}`}
                                    />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                  {/* INPUT AREA — déclencheur compact */}
                  <div className="p-4 lg:p-6 border-t border-amber-100/40 bg-white">
                    <button
                      onClick={() => setComposerOpen(true)}
                      className="w-full min-h-[64px] flex items-center justify-between gap-4 px-5 py-4 rounded-2xl bg-[hsl(var(--cream))] border-2 border-amber-100/70 hover:border-[hsl(var(--gold))] transition-all text-left shadow-sm"
                    >
                      <span className="flex-1 truncate text-xl text-muted-foreground">
                        {safeMessage.length > 0 ? safeMessage : "Écrivez votre message..."}
                      </span>
                      <span className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1B2333] text-white text-lg font-semibold">
                        <Send className="h-5 w-5" />
                        Rédiger
                      </span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-6">
                  <div className="w-20 h-20 rounded-full bg-amber-50/60 flex items-center justify-center">
                    <Send className="h-10 w-10 text-[hsl(var(--gold))]/40" />
                  </div>
                  <p className="font-heading text-[#1B2333] font-semibold text-center text-3xl">
                    Reprenez le fil de vos belles rencontres
                  </p>
                  <p className="text-muted-foreground text-2xl">Cliquez sur un profil à gauche pour lui écrire.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* COMPOSER MODAL — élégant, accessible seniors 60+ */}
      <Dialog
        open={composerOpen}
        onOpenChange={(v) => {
          setComposerOpen(v);
          if (!v && listeningRef.current) toggleListening();
        }}
      >
        <DialogContent className="max-w-3xl w-[calc(100%-2rem)] p-0 gap-0 bg-white border-0 rounded-[28px] shadow-[0_30px_80px_-20px_rgba(27,35,51,0.35)] overflow-hidden">
          {/* En-tête avec avatar */}
          <div className="relative bg-gradient-to-br from-[#1B2333] via-[#1B2333] to-[#2a3348] px-8 py-6 flex items-center gap-5">
            <div
              className="absolute inset-0 opacity-[0.07] pointer-events-none"
              style={{ backgroundImage: "radial-gradient(circle at 20% 30%, hsl(var(--gold)) 0%, transparent 50%)" }}
            />
            {selectedChat && (
              <div className="relative shrink-0">
                <img
                  src={selectedChat.avatar}
                  alt={selectedChat.name}
                  className="w-16 h-16 lg:w-20 lg:h-20 rounded-full object-cover ring-4 ring-[hsl(var(--gold))]/40 shadow-lg"
                />
                {isListening && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-[hsl(var(--gold))] border-[3px] border-[#1B2333] rounded-full animate-pulse" />
                )}
              </div>
            )}
            <div className="relative flex-1 min-w-0">
              <p className="text-[hsl(var(--gold-light))] text-sm lg:text-base uppercase tracking-[0.18em] font-medium mb-1">
                Nouveau message
              </p>
              <h2 className="font-heading font-semibold text-white text-2xl lg:text-3xl truncate">
                Écrire à {selectedChat?.name}
              </h2>
            </div>
          </div>

          {/* Zone de texte */}
          <div className="px-6 lg:px-8 pt-7 pb-3">
            <div className="relative">
              <Textarea
                autoFocus
                ref={textareaRef}
                placeholder={`Bonjour ${selectedChat?.name ?? ""}, …`}
                value={displayValue}
                onChange={handleTextareaChange}
                className={`w-full min-h-[240px] resize-none bg-[hsl(var(--cream))]/60 border-2 rounded-2xl font-medium text-foreground placeholder:text-muted-foreground/60 focus:ring-0 focus:outline-none focus:ring-offset-0 px-6 py-5 leading-relaxed transition-all ${
                  isListening
                    ? "border-[hsl(var(--gold))] shadow-[0_0_0_4px_hsl(var(--gold)/0.12)]"
                    : "border-amber-100/80 focus:border-[hsl(var(--gold))]"
                }`}
                style={{ fontSize: `${Math.max(chatFontSize, 20)}px` }}
              />
              {isListening && (
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-[hsl(var(--gold))]/15 px-3 py-1.5 rounded-full">
                  <div className="flex items-end gap-0.5 h-4">
                    <span
                      className="w-1 bg-[hsl(var(--gold))] rounded-full animate-bounce h-[60%]"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-1 bg-[hsl(var(--gold))] rounded-full animate-bounce h-[100%]"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-1 bg-[hsl(var(--gold))] rounded-full animate-bounce h-[40%]"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-[hsl(var(--gold))]">En écoute</span>
                </div>
              )}
            </div>

            {/* Astuce dictée */}
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">
              💡 Astuce dictée : dites <span className="font-semibold text-foreground">« virgule »</span>,{" "}
              <span className="font-semibold text-foreground">« point »</span>,{" "}
              <span className="font-semibold text-foreground">« à la ligne »</span> ou{" "}
              <span className="font-semibold text-foreground">« point d'interrogation »</span>.
            </p>
          </div>

          {/* Actions */}
          <div className="px-6 lg:px-8 pb-7 pt-4 bg-gradient-to-b from-transparent to-[hsl(var(--cream))]/40">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={toggleListening}
                className={`min-h-[60px] flex-1 flex items-center justify-center gap-3 rounded-2xl text-lg lg:text-xl font-semibold transition-all duration-300 ${
                  isListening
                    ? "bg-[hsl(var(--gold))] text-white shadow-[0_8px_24px_-8px_hsl(var(--gold)/0.6)] hover:brightness-105"
                    : "bg-white border-2 border-[#1B2333]/15 text-[#1B2333] hover:border-[hsl(var(--gold))] hover:bg-[hsl(var(--cream))]/50"
                }`}
              >
                {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6 text-[hsl(var(--gold))]" />}
                {isListening ? "Arrêter la dictée" : "Dicter à voix haute"}
              </button>
              <Button
                onClick={() => {
                  setComposerOpen(false);
                  if (listeningRef.current) toggleListening();
                }}
                variant="outline"
                className="min-h-[60px] sm:w-auto rounded-2xl text-lg lg:text-xl font-semibold px-6 border-2"
              >
                Fermer
              </Button>
              <Button
                onClick={handleSend}
                disabled={isSent || (!message.trim() && !isListening)}
                className="min-h-[60px] sm:min-w-[180px] rounded-2xl text-lg lg:text-xl font-semibold gap-2 bg-[#1B2333] hover:bg-[#1B2333]/90 shadow-[0_8px_24px_-8px_rgba(27,35,51,0.5)]"
              >
                {isSent ? <Check className="h-6 w-6" /> : <Send className="h-5 w-5" />}
                {isSent ? "Envoyé" : "Envoyer"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showConseils && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setShowConseils(false)} />
          <div className="relative bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[hsl(var(--gold))]/40 max-w-2xl w-full p-0 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-[#1B2333] px-8 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Lightbulb className="h-8 w-8 text-[hsl(var(--gold-light))]" />
                <h2 className="font-heading font-semibold text-white text-3xl">9 conseils pour un bon départ</h2>
              </div>
              <button
                onClick={() => setShowConseils(false)}
                className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="px-8 py-6 max-h-[60vh] overflow-y-auto space-y-4">
              {conseils.map((conseil, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50/80 border border-gray-100 text-left"
                >
                  <span className="shrink-0 w-10 h-10 rounded-full bg-[#1B2333] text-white flex items-center justify-center font-semibold text-xl">
                    {index + 1}
                  </span>
                  <p className="leading-relaxed text-foreground pt-1.5 text-2xl">{conseil}</p>
                </div>
              ))}
            </div>
            <div className="px-8 py-5 border-t border-amber-100/40 bg-amber-50/20">
              <Button
                onClick={() => setShowConseils(false)}
                className="w-full h-14 rounded-xl bg-[#1B2333] hover:bg-[#1B2333]/90 text-white font-medium text-xl"
              >
                J'ai compris, merci !
              </Button>
            </div>
          </div>
        </div>
      )}

      <MatchProfileModal
        match={matchProfileData}
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        hideActions
        onReport={() => {
          if (matchProfileData) {
            setProfileModalOpen(false);
            handleReport(matchProfileData.name);
          }
        }}
      />

      <ReportModal
        open={reportModalOpen}
        onOpenChange={setReportModalOpen}
        name={reportTarget}
        onUnmatchInstead={() => handleUnmatch(reportTarget)}
      />

      <ChatTooltipOverlay
        contactName={selectedChat?.name || ""}
        show={showChatTooltip}
        onDismiss={handleDismissChatTooltip}
      />

      <UnmatchModal
        open={unmatchModalOpen}
        onOpenChange={setUnmatchModalOpen}
        name={unmatchTarget}
        onConfirmUnmatch={() => handleUnmatch(unmatchTarget)}
        onReportInstead={() => handleReport(unmatchTarget)}
      />

      <Dialog
        open={showNewConvPopup}
        onOpenChange={(open) => {
          if (!open) handleDismissNewConv();
        }}
      >
        <DialogContent className="max-w-xl rounded-[24px] p-0 overflow-hidden">
          <div className="bg-[#1B2333] px-8 py-6 flex items-center gap-4">
            <Clock className="h-8 w-8 text-[hsl(var(--gold-light))]" />
            <h2 className="font-heading text-3xl font-semibold text-white">Nouvelle conversation</h2>
          </div>
          <div className="px-8 py-8 space-y-5">
            <p className="text-foreground text-2xl leading-relaxed">
              Vous avez <span className="font-bold text-[#1B2333]">3 jours</span> pour répondre à ce premier message.
              Passé ce délai, la conversation sera automatiquement archivée.
            </p>
            <p className="text-muted-foreground text-xl leading-relaxed">
              Prenez le temps de découvrir le profil de votre correspondant(e) et n'hésitez pas à faire le premier pas !
            </p>
          </div>
          <div className="px-8 py-5 border-t border-amber-100/40 bg-amber-50/20">
            <Button
              onClick={handleDismissNewConv}
              className="w-full h-14 rounded-xl bg-[#1B2333] hover:bg-[#1B2333]/90 text-white font-medium text-xl"
            >
              J'ai compris, merci !
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <BenevolenceModal open={benevolenceModalOpen} onOpenChange={setBenevolenceModalOpen} />
    </Layout>
  );
}
