import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
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

const formatSpeech = (text: string) => {
  if (!text) return "";
  return text
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
    .replace(/\s+([,;:?.!])/g, "$1")
    .replace(/([?.!])\s*([a-zà-ÿ])/gi, (match, p1, p2) => `${p1} ${p2.toUpperCase()}`);
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
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const chatFontSize = FONT_SIZES[chatFontSizeIndex];

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/connexion");
        return;
      }
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

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

  const handleSelectConversation = (convId: number) => {
    setSelectedConversation(convId);
    const conv = conversations.find((c) => c.id === convId);
    if (conv?.isNew && !dismissedNewConv.has(convId)) setShowNewConvPopup(true);
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
      toast("🔒 Pour votre sécurité, les appels se débloquent automatiquement après quelques messages échangés.");
    } else {
      setCallModalOpen(true);
    }
  };

  const handleReport = (name: string) => {
    setReportTarget(name);
    setReportModalOpen(true);
  };

  const handleUnmatch = (name: string) => {
    setConversations((prev) => prev.filter((c) => c.name !== name));
    setSelectedConversation(null);
    toast.success(`${name} a été retiré(e) de vos matchs.`);
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
      utterance.onend = () => setSpeakingMsgId(null);
      setSpeakingMsgId(msgId);
      window.speechSynthesis.speak(utterance);
    },
    [speakingMsgId],
  );

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) toast.info("Dictée vocale activée...");
  };

  const handleSend = () => {
    if (!message.trim()) return;
    const { isSafe } = checkMessage(message);
    if (!isSafe) {
      setBenevolenceModalOpen(true);
      return;
    }
    setMessage("");
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setComposerOpen(false);
    }, 1500);
  };

  const selectedChat = conversations.find((c) => c.id === selectedConversation);

  if (loading) return null;

  return (
    <Layout>
      <div className="h-[calc(100vh-64px)] bg-secondary overflow-hidden flex flex-col">
        <div className="max-w-6xl mx-auto w-full px-4 md:px-8 py-6 flex-1 overflow-hidden">
          <div className="bg-white rounded-[24px] shadow-sm border border-amber-50/50 overflow-hidden flex h-full">
            {/* SIDEBAR : Liste des conversations */}
            <div
              className={`w-full md:w-96 shrink-0 border-r border-amber-100/40 flex flex-col bg-white ${selectedConversation ? "hidden md:flex" : "flex"}`}
            >
              <div className="p-6 border-b border-amber-100/40">
                <h2 className="font-heading text-2xl font-bold text-[#1B2333] mb-4">Mes conversations</h2>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Rechercher..." className="pl-11 h-11 bg-secondary border-none rounded-xl" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`w-full px-6 py-5 flex items-center gap-5 transition-all text-left border-b border-amber-50/60 ${selectedConversation === conv.id ? "bg-amber-50/30 border-l-4 border-l-[hsl(var(--gold))]" : "hover:bg-amber-50/20"}`}
                  >
                    {/* AVATAR SIDEBAR : AGRANDI (80px) */}
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
                        <div className="absolute -top-1 -right-1 w-7 h-7 bg-[#1B2333] text-white text-lg rounded-full flex items-center justify-center font-bold">
                          {conv.unread}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-heading font-semibold text-[#1B2333] text-2xl truncate">
                          {conv.name}, {conv.age}
                        </h4>
                        <span className="text-muted-foreground text-lg ml-2">{conv.time}</span>
                      </div>
                      <p className="text-muted-foreground truncate text-xl">{conv.lastMessage}</p>
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
                  <span className="font-medium text-muted-foreground text-xl">Conseils de sécurité</span>
                </button>
              </div>
            </div>

            {/* CHAT AREA */}
            <div
              className={`flex-1 flex flex-col bg-[hsl(var(--cream))]/20 min-w-0 ${selectedConversation ? "flex" : "hidden md:flex"}`}
            >
              {selectedChat ? (
                <>
                  {/* HEADER DU CHAT : AVATAR AGRANDI (80px) */}
                  <div className="px-6 py-4 lg:px-8 lg:py-5 border-b border-amber-100/40 bg-white">
                    <div className="flex items-center gap-5">
                      <button
                        onClick={() => setSelectedConversation(null)}
                        className="md:hidden p-2 hover:bg-amber-50 rounded-xl shrink-0"
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
                          className="w-16 h-16 lg:w-20 lg:h-20 rounded-full object-cover ring-2 ring-amber-100/40 group-hover:ring-[hsl(var(--gold))]/50 transition-all"
                        />
                        {selectedChat.online && (
                          <div className="absolute bottom-0 right-0 w-4 h-4 lg:w-5 lg:h-5 rounded-full ring-2 ring-white bg-green-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 pr-4">
                        <h3 className="font-heading font-bold text-[#1B2333] text-2xl lg:text-3xl truncate">
                          {selectedChat.name}, {selectedChat.age}
                        </h3>
                        <p className="font-medium text-green-700 text-lg">En ligne</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setChatFontSizeIndex((i) => Math.max(0, i - 1))}
                          className="h-10 px-3 rounded-lg border border-amber-100 bg-white font-bold text-[#1B2333]"
                        >
                          A−
                        </button>
                        <button
                          onClick={() => setChatFontSizeIndex((i) => Math.min(FONT_SIZES.length - 1, i + 1))}
                          className="h-10 px-3 rounded-lg border border-amber-100 bg-white font-bold text-[#1B2333]"
                        >
                          A+
                        </button>
                        <button
                          onClick={handleOpenCallModal}
                          className="h-10 px-4 rounded-lg border border-amber-100 bg-white flex items-center gap-2 hover:bg-amber-50 transition-colors"
                        >
                          <Phone className="h-4 w-4 text-[#1B2333]" />
                          <span className="text-xl font-medium text-[#1B2333] hidden xl:inline">Appeler</span>
                        </button>
                        <Button
                          variant="ghost"
                          onClick={() => handleViewProfile(selectedChat)}
                          className="text-[#1B2333] text-xl font-medium hidden lg:flex gap-2"
                        >
                          <Eye className="h-4 w-4" /> Voir profil
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* ZONE DES MESSAGES */}
                  <div
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 flex flex-col scrollbar-hide"
                  >
                    {mockMessages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                        {msg.sender === "them" && (
                          /* AVATAR MESSAGE : AGRANDI (64px) */
                          <img
                            src={selectedChat.avatar}
                            alt=""
                            className="w-14 h-14 lg:w-16 lg:h-16 rounded-full object-cover mr-4 mt-auto shrink-0 cursor-pointer hover:ring-2 hover:ring-[hsl(var(--gold))]/40 transition-all"
                            onClick={(e) => handleAvatarClick(selectedChat, e)}
                          />
                        )}
                        <div
                          className={`max-w-[85%] lg:max-w-[75%] rounded-2xl px-5 py-4 shadow-sm ${msg.sender === "me" ? "bg-[#1B2333] text-white rounded-br-md" : "bg-white rounded-bl-md border border-amber-100/40"}`}
                        >
                          <p className="leading-relaxed" style={{ fontSize: `${chatFontSize}px` }}>
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
                                className="p-2 hover:bg-amber-50 rounded-full transition-colors"
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

                  {/* BARRE DE RÉDACTION */}
                  <div className="p-4 lg:p-6 border-t border-amber-100/40 bg-white">
                    <button
                      onClick={() => setComposerOpen(true)}
                      className="w-full min-h-[64px] flex items-center justify-between gap-4 px-6 py-4 rounded-2xl bg-[hsl(var(--cream))] border-2 border-amber-100/70 hover:border-[hsl(var(--gold))] transition-all shadow-sm"
                    >
                      <span className="text-xl text-muted-foreground truncate">
                        {message || "Écrivez votre message..."}
                      </span>
                      <span className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B2333] text-white text-lg font-bold">
                        <Send className="h-5 w-5" /> Rédiger
                      </span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-6">
                  <div className="w-24 h-24 rounded-full bg-amber-50/60 flex items-center justify-center">
                    <Send className="h-12 w-12 text-[hsl(var(--gold))]/40" />
                  </div>
                  <p className="font-heading text-[#1B2333] font-bold text-3xl">Reprenez le fil de vos échanges</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL RÉDACTION */}
      <Dialog open={composerOpen} onOpenChange={setComposerOpen}>
        <DialogContent className="max-w-3xl w-[calc(100%-2rem)] p-0 bg-white rounded-[28px] overflow-hidden border-0 shadow-2xl">
          <div className="bg-[#1B2333] px-8 py-6 flex items-center gap-5">
            {selectedChat && (
              <img
                src={selectedChat.avatar}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-[hsl(var(--gold))]/30"
              />
            )}
            <div>
              <p className="text-[hsl(var(--gold-light))] text-sm uppercase tracking-widest font-bold mb-1">
                Nouveau message
              </p>
              <h2 className="font-heading font-semibold text-white text-3xl">Écrire à {selectedChat?.name}</h2>
            </div>
          </div>
          <div className="p-8">
            <Textarea
              autoFocus
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Votre message..."
              className="min-h-[200px] text-2xl border-2 border-amber-100 rounded-2xl focus:border-[hsl(var(--gold))] focus:ring-0 bg-slate-50/50"
            />
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={toggleListening}
                className={`flex-1 h-14 rounded-xl font-bold text-xl flex items-center justify-center gap-3 border-2 transition-all ${isListening ? "bg-red-500 text-white border-red-500 animate-pulse" : "bg-white text-[#1B2333] border-slate-200 hover:border-[hsl(var(--gold))]"}`}
              >
                {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6 text-[hsl(var(--gold))]" />}
                {isListening ? "Arrêter la dictée" : "Dicter à voix haute"}
              </button>
              <Button
                onClick={handleSend}
                disabled={!message.trim()}
                className="flex-1 h-14 bg-[#1B2333] text-white text-xl font-bold rounded-xl shadow-lg"
              >
                Envoyer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Autres Modales */}
      <MatchProfileModal
        match={selectedChat}
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        hideActions
        onReport={() => {
          setProfileModalOpen(false);
          handleReport(selectedChat!.name);
        }}
      />
      <ReportModal
        open={reportModalOpen}
        onOpenChange={setReportModalOpen}
        name={reportTarget}
        onUnmatchInstead={() => handleUnmatch(reportTarget)}
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
