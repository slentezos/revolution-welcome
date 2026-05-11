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
  Sparkles,
  TrendingUp,
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

// Parseur de ponctuation amélioré pour le français (Correction "à la ligne")
const formatSpeech = (text: string) => {
  if (!text) return "";
  return (
    text
      .replace(/\bpoints? d['']interrogation\b/gi, "?")
      .replace(/\bpoints? d['']exclamation\b/gi, "!")
      .replace(/\bpoints de suspension\b/gi, "...")
      .replace(/\bnouveau paragraphe\b/gi, "\n\n")
      // Capture agressive de toutes les variantes pour "à la ligne"
      .replace(/\b(?:aller|retour)?\s*(?:à|a)\s*la\s*ligne\b/gi, "\n")
      .replace(/\bvirgule\b/gi, ",")
      .replace(/\bpoint-virgule\b/gi, ";")
      .replace(/\bdeux points\b/gi, ":")
      .replace(/\bpoint\b/gi, ".")
      .replace(/\s+([,;:?.!])/g, "$1") // Supprime l'espace avant la ponctuation
      .replace(/([?.!])\s*([a-zà-ÿ])/gi, (match, p1, p2) => `${p1} ${p2.toUpperCase()}`)
  ); // Majuscule après ponctuation forte
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

const FONT_SIZES = [13, 14, 15, 16, 18, 20, 22, 24, 26];

export default function Messages() {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [userProfile, setUserProfile] = useState<{ city_name: string | null; region_name: string | null } | null>(null);

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
  const [callModalOpen, setCallModalOpen] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const recognitionRef = useRef<any>(null);
  const [speakingMsgId, setSpeakingMsgId] = useState<number | null>(null);
  const [isSent, setIsSent] = useState(false);
  const [chatFontSizeIndex, setChatFontSizeIndex] = useState(4);
  const sendTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const prevConversationsRef = useRef(conversations);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

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
  const chatFontSize = FONT_SIZES[chatFontSizeIndex];

  useEffect(() => {
    audioRef.current = new Audio("/sounds/new-message.mp3");

    const fetchUserLocation = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from("profiles")
          .select("city_name, region_name")
          .eq("user_id", session.user.id)
          .maybeSingle();
        setUserProfile(data);
      }
    };
    fetchUserLocation();
  }, []);

  useEffect(() => {
    const prevUnread = prevConversationsRef.current.reduce((sum, c) => sum + (c.unread || 0), 0);
    const currUnread = conversations.reduce((sum, c) => sum + (c.unread || 0), 0);
    if (currUnread > prevUnread && document.hidden && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
    prevConversationsRef.current = conversations;
  }, [conversations]);

  const adjustTextareaHeight = useCallback(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      const scrollHeight = ta.scrollHeight;
      ta.style.height = scrollHeight > 150 ? "150px" : `${scrollHeight}px`;
      if (listeningRef.current) ta.scrollTop = ta.scrollHeight;
    }
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [message, interimText, chatFontSize, adjustTextareaHeight]);

  const listeningRef = useRef(false);
  useEffect(() => {
    listeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "fr-FR";

    recognition.onresult = (event: any) => {
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
            !currentVal.endsWith("\n") && // Si on vient de faire "à la ligne", pas d'espace
            !formattedFinal.startsWith(",") &&
            !formattedFinal.startsWith(".");

          return currentVal + (needsSpace ? " " : "") + formattedFinal;
        });
      }

      setInterimText(formatSpeech(interimSegment));
      setTimeout(adjustTextareaHeight, 0);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setInterimText("");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    return () => {
      try {
        recognition.stop();
      } catch {}
    };
  }, [adjustTextareaHeight]);

  const toggleListening = useCallback(() => {
    if (listeningRef.current) {
      setIsListening(false);
      try {
        recognitionRef.current?.stop();
      } catch {}
      if (interimText) {
        setMessage((prev) => {
          const currentVal = prev || "";
          let finalInterim = interimText.trim();
          if (currentVal.trim() === "" || /[.!?]\s*$/.test(currentVal)) finalInterim = capitalizeFirst(finalInterim);
          return currentVal + (currentVal.length > 0 && !currentVal.endsWith(" ") ? " " : "") + finalInterim + " ";
        });
      }
      setInterimText("");
    } else {
      if (!recognitionRef.current) {
        toast.error("Dictée vocale non supportée par votre navigateur.");
        return;
      }
      setInterimText("");
      setMessage((prev) => (prev && !prev.endsWith(" ") ? prev + " " : prev));
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  }, [interimText]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setMessage(val.length === 1 ? capitalizeFirst(val) : val);
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
    if (container) container.scrollTo({ top: container.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  }, []);

  useEffect(() => {
    if (selectedConversation) setTimeout(() => scrollToBottom(false), 100);
  }, [selectedConversation, scrollToBottom]);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
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
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    }
  };

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
    toast.success(`Match retiré.`);
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

  const handleOpenCallModal = () => {
    if (mockMessages.length < 5) {
      toast("🔒 Appels débloqués après quelques messages.", { position: "bottom-left", duration: 4000 });
    } else setCallModalOpen(true);
  };

  const selectedChat = conversations.find((c) => c.id === selectedConversation);
  const matchProfileData = profileToView ? { ...profileToView } : null;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="animate-pulse text-muted-foreground text-xl">Chargement...</div>
      </div>
    );

  const safeMessage = message || "";
  const displayValue = isListening || interimText ? safeMessage + interimText : safeMessage;

  return (
    <Layout>
      <div className="h-[calc(100vh-64px)] bg-secondary overflow-hidden flex flex-col">
        <div className="max-w-6xl mx-auto w-full px-4 py-6 flex-1 overflow-hidden md:px-0">
          <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-amber-50/50 overflow-hidden flex h-full">
            {/* ===== PRIVATE LOUNGE SIDEBAR ===== */}
            <div
              className={`w-full md:w-96 shrink-0 border-r border-amber-100/40 flex flex-col bg-white ${selectedConversation ? "hidden md:flex" : "flex"}`}
            >
              <div className="p-6 border-b border-amber-100/40">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading font-bold text-[#1B2333] text-3xl">Mes conversations</h2>
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
                    className={`w-full px-6 py-5 flex items-center gap-4 transition-all text-left border-b border-amber-50/60 ${selectedConversation === conv.id ? "bg-amber-50/30 border-l-2 border-l-[hsl(var(--gold))]" : "hover:bg-amber-50/20"}`}
                  >
                    <div className="relative shrink-0 cursor-pointer group" onClick={(e) => handleAvatarClick(conv, e)}>
                      <img
                        src={conv.avatar}
                        alt={conv.name}
                        className="w-20 h-20 rounded-full object-cover ring-2 ring-amber-100/40 group-hover:ring-[hsl(var(--gold))]/50 transition-all"
                      />
                      {conv.online && (
                        <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full ring-2 ring-white bg-green-500" />
                      )}
                      {conv.unread > 0 && (
                        <div className="absolute -top-1 -right-1 w-7 h-7 bg-[#1B2333] text-white text-base rounded-full flex items-center justify-center font-semibold">
                          {conv.unread}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-heading font-semibold text-[#1B2333] text-3xl truncate">
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
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl hover:bg-amber-50/60 transition-colors text-2xl"
                >
                  <ShieldCheck className="h-5 w-5 text-[hsl(var(--gold))]" />
                  <span className="font-medium text-xl text-[#1a2232]">9 conseils de sécurité</span>
                </button>
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="w-full flex items-center justify-center gap-2 py-2 rounded-xl cursor-help opacity-80 hover:opacity-100 transition-opacity">
                        <Lock className="h-4 w-4 text-[hsl(var(--gold))]" />
                        <span className="font-medium text-[#1B2333] text-xl">Cercle privé</span>
                        <Info className="h-4 w-4 text-muted-foreground/50" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="max-w-[320px] bg-[#1B2333] text-white border border-[hsl(var(--gold))]/30 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] rounded-2xl p-6 z-50"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Lock className="h-5 w-5 text-[hsl(var(--gold-light))]" />
                        <p className="font-heading font-semibold text-[hsl(var(--gold-light))] text-3xl">
                          Votre Cercle Privé
                        </p>
                      </div>
                      <p className="text-white/90 text-xl leading-relaxed mb-3">
                        Espace exclusif et confidentiel où vos échanges sont protégés.
                      </p>
                      <p className="leading-relaxed italic text-xl text-primary-foreground">
                        La confidentialité est absolue.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* ===== CHAT AREA / WELCOME DASHBOARD ===== */}
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
                          className="w-20 h-20 rounded-full object-cover ring-2 ring-amber-100/40 group-hover:ring-[hsl(var(--gold))]/50 transition-all"
                        />
                        {conversations.find((c) => c.id === selectedConversation)?.online && (
                          <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full ring-2 ring-white bg-green-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 pr-4">
                        <h3 className="font-heading font-bold text-[#1B2333] leading-tight text-2xl lg:text-3xl truncate">
                          {selectedChat.name}
                        </h3>
                        <p className="font-medium text-base lg:text-lg mt-0.5 text-green-700">En ligne</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 overflow-x-auto no-scrollbar">
                        <button
                          onClick={() => setChatFontSizeIndex((i) => Math.max(0, i - 1))}
                          className="h-10 px-3.5 rounded-lg border border-amber-100 bg-white hover:bg-amber-50 transition-colors shrink-0"
                        >
                          <span className="text-base font-bold text-[#1B2333]">A−</span>
                        </button>
                        <button
                          onClick={() => setChatFontSizeIndex((i) => Math.min(FONT_SIZES.length - 1, i + 1))}
                          className="h-10 px-3.5 rounded-lg border border-amber-100 bg-white hover:bg-amber-50 transition-colors shrink-0"
                        >
                          <span className="text-base font-bold text-[#1B2333]">A+</span>
                        </button>
                        <div className="w-px h-6 bg-amber-100/60 mx-1 shrink-0" />
                        <button
                          className="h-10 px-4 rounded-lg border border-amber-100 bg-white hover:bg-amber-50 flex items-center gap-2 transition-colors shrink-0"
                          onClick={handleOpenCallModal}
                        >
                          {mockMessages.length < 5 ? (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Phone className="h-4 w-4 text-[#1B2333]" />
                          )}
                          <span className="text-xl font-medium text-[#1B2333] hidden xl:inline">Appeler</span>
                        </button>
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
                  <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 flex flex-col">
                    {mockMessages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                        {msg.sender === "them" && (
                          <img
                            src={selectedChat.avatar}
                            alt=""
                            className="w-14 h-14 lg:w-16 lg:h-16 rounded-full object-cover mr-4 mt-auto shrink-0 cursor-pointer"
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
                          <div className={`flex items-center gap-2 mt-2 ${msg.sender === "me" ? "justify-end" : ""}`}>
                            <p
                              className={`text-base ${msg.sender === "me" ? "text-white/50" : "text-muted-foreground"}`}
                            >
                              {msg.sender === "me" ? (msg.read ? `Lu à ${msg.time}` : `Remis à ${msg.time}`) : msg.time}
                            </p>
                            {msg.sender === "them" && (
                              <button
                                onClick={() => speakMessage(msg.id, msg.text)}
                                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-amber-50 transition-colors"
                              >
                                <Volume2
                                  className={`h-5 w-5 ${speakingMsgId === msg.id ? "text-[hsl(var(--gold))]" : "text-muted-foreground"}`}
                                />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
                /* NOUVEAU DASHBOARD DE BIENVENUE ELITE */
                <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-12 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[hsl(var(--gold))]/5 rounded-full blur-3xl -mr-32 -mt-32" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#1B2333]/5 rounded-full blur-3xl -ml-32 -mb-32" />

                  <div className="relative z-10 max-w-2xl w-full flex flex-col items-center">
                    <div className="w-24 h-24 rounded-2xl bg-white shadow-[0_20px_50px_rgba(197,160,89,0.15)] flex items-center justify-center mb-8 border border-amber-100/50">
                      <Sparkles className="h-10 w-10 text-[hsl(var(--gold))]" />
                    </div>

                    <h2 className="font-heading text-[#1B2333] font-bold text-4xl mb-4">
                      Bienvenue dans votre Salon Privé
                    </h2>
                    <p className="text-slate-500 text-2xl mb-12 leading-relaxed">
                      Sélectionnez l'une de vos conversations à gauche pour reprendre vos échanges en toute
                      confidentialité.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left">
                      <div className="bg-white p-6 rounded-[20px] border border-amber-100/40 shadow-sm flex flex-col gap-4">
                        <div className="flex items-center gap-3 text-[hsl(var(--gold-dark))]">
                          <TrendingUp className="h-6 w-6" />
                          <span className="font-bold uppercase tracking-wider text-2xl">Activité du Cercle</span>
                        </div>
                        <p className="text-[#1B2333] text-xl font-medium leading-snug">
                          Aujourd'hui,{" "}
                          <span className="text-[hsl(var(--gold-dark))] font-bold text-2xl">
                            14 nouveaux membres certifiés
                          </span>{" "}
                          ont rejoint votre bassin de rencontre
                          <span className="text-[hsl(var(--gold-dark))] font-bold text-2xl">
                            {" "}
                            ({userProfile?.city_name || userProfile?.region_name || "votre région"}).
                          </span>
                        </p>
                      </div>

                      <div className="bg-[#1B2333] p-6 rounded-[20px] shadow-sm flex flex-col gap-4 text-white">
                        <div className="flex items-center gap-3 text-[hsl(var(--gold-light))]">
                          <ShieldCheck className="h-6 w-6" />
                          <span className="font-bold uppercase tracking-wider text-2xl">Votre Protection</span>
                        </div>
                        <p className="text-white/90 text-xl font-medium leading-snug">
                          Chaque échange est protégé par notre technologie de cryptage. Votre tranquillité est notre
                          priorité.
                        </p>
                      </div>
                    </div>

                    <div className="mt-12 flex items-center gap-4 animate-bounce">
                      <ArrowLeft className="h-6 w-6 text-[hsl(var(--gold))]" />
                      <span className="uppercase tracking-widest font-medium bg-[#e2a336] text-slate-50 text-2xl px-4 py-2 rounded-lg">
                        Choisissez un profil pour commencer
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* COMPOSER MODAL */}
      <Dialog
        open={composerOpen}
        onOpenChange={(v) => {
          setComposerOpen(v);
          if (!v && listeningRef.current) toggleListening();
        }}
      >
        <DialogContent className="max-w-3xl w-[calc(100%-2rem)] p-0 gap-0 bg-white border-0 rounded-[28px] shadow-[0_30px_80px_-20px_rgba(27,35,51,0.35)] overflow-hidden">
          <div className="relative bg-gradient-to-br from-[#1B2333] via-[#1B2333] to-[#2a3348] px-8 py-6 flex items-center gap-5">
            {selectedChat && (
              <div className="relative shrink-0">
                <img
                  src={selectedChat.avatar}
                  alt={selectedChat.name}
                  className="w-20 h-20 lg:w-24 lg:h-24 rounded-full object-cover ring-4 ring-[hsl(var(--gold))]/40 shadow-lg"
                />
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

          <div className="px-6 lg:px-8 pt-7 pb-3">
            {/* Bannière d'écoute repensée pour UX Senior (Fade in, icônes sonores) */}
            {isListening && (
              <div className="flex items-center gap-4 bg-[hsl(var(--gold))]/10 border border-[hsl(var(--gold))]/30 text-[hsl(var(--gold-dark))] px-5 py-3 rounded-2xl mb-4 animate-in fade-in duration-500">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-4 bg-[hsl(var(--gold))] rounded-full animate-[pulse_1s_ease-in-out_infinite]" />
                  <span className="w-1.5 h-6 bg-[hsl(var(--gold))] rounded-full animate-[pulse_1.2s_ease-in-out_infinite_100ms]" />
                  <span className="w-1.5 h-3 bg-[hsl(var(--gold))] rounded-full animate-[pulse_0.8s_ease-in-out_infinite_200ms]" />
                </div>
                <span className="font-semibold text-xl tracking-wide">Parlez librement, nous vous écoutons...</span>
              </div>
            )}

            <div className="relative">
              <Textarea
                autoFocus
                ref={textareaRef}
                placeholder={`Bonjour ${selectedChat?.name ?? ""}, …`}
                value={displayValue}
                onChange={handleTextareaChange}
                className={`w-full min-h-[240px] resize-none bg-[hsl(var(--cream))]/60 border-2 rounded-2xl font-medium px-6 py-5 leading-relaxed transition-all duration-300 ${isListening ? "border-[hsl(var(--gold))] bg-[hsl(var(--gold))]/5 shadow-[inset_0_0_10px_rgba(var(--gold),0.05)]" : "border-amber-100/80 focus:border-[hsl(var(--gold))]"}`}
                style={{ fontSize: `${Math.max(chatFontSize, 20)}px` }}
              />
            </div>

            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl mt-4">
              <Lightbulb className="h-5 w-5 text-[hsl(var(--gold))] shrink-0" />
              <p className="text-slate-600 leading-snug text-xl">
                💡 Astuce dictée : dites <span className="font-semibold text-[#1B2333]">« virgule »</span>,{" "}
                <span className="font-semibold text-[#1B2333]">« point »</span>,{" "}
                <span className="font-semibold text-[#1B2333]">« point d'interrogation »</span>,{" "}
                <span className="font-semibold text-[#1B2333]">« point d'exclamation »</span> ou{" "}
                <span className="font-semibold text-[#1B2333]">« à la ligne »</span>.
              </p>
            </div>
          </div>

          <div className="px-6 lg:px-8 pb-7 pt-4 bg-gradient-to-b from-transparent to-[hsl(var(--cream))]/40">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Effet "Glow" luxueux et respirant sur le bouton actif */}
              <button
                onClick={toggleListening}
                className={`min-h-[60px] flex-1 flex items-center justify-center gap-3 rounded-2xl text-xl xl:text-xl font-semibold transition-all duration-700 ease-out ${
                  isListening
                    ? "text-white shadow-[0_0_20px_rgba(197,160,89,0.4)] border border-[hsl(var(--gold))]/50 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] bg-[#da9e3e]"
                    : "bg-white border-2 border-[#1B2333]/15 text-[#1B2333] hover:border-[hsl(var(--gold))]"
                }`}
              >
                {isListening ? (
                  <MicOff className="h-6 w-6 text-[hsl(var(--gold))]" />
                ) : (
                  <Mic className="h-6 w-6 text-[hsl(var(--gold))]" />
                )}
                {isListening ? "Arrêter la dictée" : "Dicter"}
              </button>
              <Button
                onClick={() => setComposerOpen(false)}
                variant="outline"
                className="min-h-[60px] rounded-2xl text-xl xl:text-xl px-6 border-[#1B2333]/15"
              >
                Fermer
              </Button>
              <Button
                onClick={handleSend}
                disabled={isSent || (!message.trim() && !isListening)}
                className="min-h-[60px] sm:min-w-[180px] rounded-2xl text-xl xl:text-xl font-semibold gap-2 bg-[#1B2333] text-white hover:bg-[#1B2333]/90"
              >
                {isSent ? "Envoyé" : "Envoyer"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODALS */}
      <Dialog open={callModalOpen} onOpenChange={setCallModalOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-[24px] border-0 shadow-2xl bg-white">
          <div className="bg-[#1B2333] px-8 py-6 flex items-center justify-center">
            <h2 className="font-heading text-2xl font-semibold text-white">Appeler {selectedChat?.name}</h2>
          </div>
          <div className="px-8 py-8 space-y-4">
            <p className="text-muted-foreground text-xl text-center mb-6">Choisissez le type d'appel.</p>
            <button
              onClick={() => setCallModalOpen(false)}
              className="w-full flex items-center justify-start gap-4 p-5 rounded-2xl border-2 hover:border-[hsl(var(--gold))]/40 bg-white transition-all"
            >
              <Phone className="h-6 w-6" />
              <div>
                <p className="font-semibold text-xl">Appel vocal</p>
              </div>
            </button>
            <button
              onClick={() => setCallModalOpen(false)}
              className="w-full flex items-center justify-start gap-4 p-5 rounded-2xl border-2 hover:border-[hsl(var(--gold))]/40 bg-white transition-all"
            >
              <Video className="h-6 w-6" />
              <div>
                <p className="font-semibold text-xl">Appel vidéo</p>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <MatchProfileModal
        match={matchProfileData}
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        hideActions
        onReport={() => {
          setProfileModalOpen(false);
          handleReport(matchProfileData!.name);
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
      <BenevolenceModal open={benevolenceModalOpen} onOpenChange={setBenevolenceModalOpen} />
    </Layout>
  );
}
