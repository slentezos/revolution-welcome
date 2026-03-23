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
  Volume2,
  Check,
  Phone,
  Video } from
"lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import MatchProfileModal from "@/components/dashboard/MatchProfileModal";
import ReportModal from "@/components/messages/ReportModal";
import UnmatchModal from "@/components/messages/UnmatchModal";

import ChatTooltipOverlay from "@/components/messages/ChatTooltipOverlay";
import BenevolenceModal from "@/components/messages/BenevolenceModal";
import { checkMessage } from "@/utils/wordFilter";

const conseils = [
"Prenez le temps de bien lire le profil de votre correspondant(e).",
"Posez des questions ouvertes pour mieux connaître l'autre.",
"Restez authentique et sincère dans vos échanges.",
"Ne partagez pas d'informations personnelles trop rapidement.",
"Privilégiez les échanges sur notre plateforme au début.",
"Faites confiance à votre intuition si quelque chose vous semble suspect.",
"Proposez un premier rendez-vous dans un lieu public.",
"Prévenez un proche de votre rendez-vous.",
"Profitez de chaque échange, c'est le début d'une belle aventure !"];


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
  myTurn: true
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
  myTurn: false
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
  myTurn: true
}];


const mockMessages = [
{ id: 1, sender: "them", text: "Bonjour ! Comment allez-vous ?", time: "14:25", read: true },
{ id: 2, sender: "me", text: "Très bien merci ! Et vous ?", time: "14:27", read: true },
{
  id: 3,
  sender: "them",
  text: "Je vais bien aussi. J'ai vu votre profil et je trouve que nous avons beaucoup de points communs.",
  time: "14:28",
  read: true
},
{ id: 4, sender: "them", text: "Aimez-vous voyager ?", time: "14:30", read: false }];


const FONT_SIZES = [14, 16, 18, 20, 22];

export default function Messages() {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [showConseils, setShowConseils] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileToView, setProfileToView] = useState<(typeof initialConversations)[0] | null>(null);
  const [showNewConvPopup, setShowNewConvPopup] = useState(false);
  const [dismissedNewConv, setDismissedNewConv] = useState<Set<number>>(new Set());
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<string>("");
  const [unmatchModalOpen, setUnmatchModalOpen] = useState(false);
  const [unmatchTarget, setUnmatchTarget] = useState<string>("");
  const [benevolenceModalOpen, setBenevolenceModalOpen] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<number | null>(null);
  const [isSent, setIsSent] = useState(false);
  const [chatFontSizeIndex, setChatFontSizeIndex] = useState(2);
  const sendTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
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

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    }
  }, [message]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("La dictée vocale n'est pas supportée par votre navigateur.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const results = event.results;
      for (let i = event.resultIndex; i < results.length; i++) {
        if (results[i].isFinal) {
          const transcript = results[i][0].transcript;
          setMessage((prev) => prev + transcript);
        }
      }
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening]);

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
    [speakingMsgId]
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
        data: { session }
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/connexion");
        return;
      }
      const { data: profile } = await supabase.
      from("profiles").
      select("onboarding_step").
      eq("user_id", session.user.id).
      maybeSingle();
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
        return;
      }
      setMessage("");
      setIsSent(true);
      if (sendTimeoutRef.current) clearTimeout(sendTimeoutRef.current);
      sendTimeoutRef.current = setTimeout(() => setIsSent(false), 1500);
      setTimeout(() => scrollToBottom(), 150);
    }
  };

  useEffect(() => {
    return () => {
      if (sendTimeoutRef.current) clearTimeout(sendTimeoutRef.current);
    };
  }, []);

  const handleSelectConversation = (convId: number) => {
    setSelectedConversation(convId);
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
  const handleUnmatchClick = (name: string) => {
    setUnmatchTarget(name);
    setUnmatchModalOpen(true);
  };

  const handleAvatarClick = (conv: (typeof initialConversations)[0], e: React.MouseEvent) => {
    e.stopPropagation();
    setProfileToView(conv);
    setProfileModalOpen(true);
  };

  const handleViewProfile = (conv: (typeof initialConversations)[0]) => {
    setProfileToView(conv);
    setProfileModalOpen(true);
  };

  const selectedChat = conversations.find((c) => c.id === selectedConversation);

  const matchProfileData = profileToView ?
  {
    id: profileToView.id,
    name: profileToView.name,
    age: profileToView.age,
    location: profileToView.location,
    affinity: profileToView.affinity,
    avatar: profileToView.avatar,
    height: profileToView.height,
    origin: profileToView.origin
  } :
  null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="animate-pulse text-muted-foreground text-lg">Chargement...</div>
      </div>);

  }

  return (
    <Layout>
      <div className="h-[calc(100vh-64px)] bg-secondary overflow-hidden flex flex-col">
        {/* Note: 64px correspond à la hauteur de votre menu de navigation Kalimera */}
        <div className="max-w-6xl mx-auto w-full px-4 md:px-8 py-4 flex-1 overflow-hidden">
          {/* Conteneur Immersif qui prend toute la place restante sans déborder */}
          <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-amber-50/50 overflow-hidden flex h-full">
            {/* ===== PRIVATE LOUNGE SIDEBAR ===== */}
            <div
              className={`w-full md:w-96 border-r border-amber-100/40 flex flex-col bg-white ${selectedConversation ? "hidden md:flex" : "flex"}`}>
              
              <div className="p-5 border-b border-amber-100/40">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-heading text-2xl font-bold text-[#1B2333]">Mes conversations</h2>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50/50 border border-amber-100/40">
                    <Lock className="h-3 w-3 text-[hsl(var(--gold))]" />
                    <span className="font-medium text-[hsl(var(--gold))] text-lg">Cercle privé</span>
                  </div>
                </div>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    className="pl-11 h-11 bg-secondary border-amber-100/60 rounded-xl text-[15px]" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {conversations.map((conv) =>
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`w-full px-5 py-5 flex items-center gap-4 transition-all text-left border-b border-amber-50/60 ${
                  selectedConversation === conv.id ?
                  "bg-amber-50/30 border-l-2 border-l-[hsl(var(--gold))]" :
                  "hover:bg-amber-50/20"}`
                  }>
                  
                    <div className="relative shrink-0 cursor-pointer group" onClick={(e) => handleAvatarClick(conv, e)}>
                      <img
                      src={conv.avatar}
                      alt={conv.name}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-amber-100/40 group-hover:ring-[hsl(var(--gold))]/50 transition-all" />
                    
                      {conv.online &&
                    <div
                      className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full ring-2 ring-white"
                      style={{ backgroundColor: "hsl(142, 71%, 45%)" }} />

                    }
                      {conv.unread > 0 &&
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#1B2333] text-white text-xs rounded-full flex items-center justify-center font-semibold">
                          {conv.unread}
                        </div>
                    }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-heading font-semibold text-[#1B2333] text-2xl">
                          {conv.name}, {conv.age}
                        </h4>
                        <span className="text-muted-foreground font-medium text-lg">{conv.time}</span>
                      </div>
                      <p className="text-muted-foreground truncate text-xl">{conv.lastMessage}</p>
                      {conv.myTurn &&
                    <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full font-semibold bg-[hsl(var(--gold))]/10 text-[hsl(var(--gold))] text-xl">
                          À vous de répondre
                        </span>
                    }
                    </div>
                  </button>
                )}
              </div>
              {/* Safety link at bottom of sidebar */}
              <div className="p-4 border-t border-amber-100/40 bg-amber-50/20">
                <button
                  onClick={() => setShowConseils(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl hover:bg-amber-50/60 transition-colors">
                  <ShieldCheck className="h-4 w-4 text-[hsl(var(--gold))]" />
                  <span className="font-medium text-muted-foreground text-xl">9 conseils de sécurité</span>
                </button>
              </div>
            </div>

            {/* ===== CHAT AREA ===== */}
            <div
              className={`flex-1 flex flex-col bg-[hsl(var(--cream))]/20 ${selectedConversation ? "flex" : "hidden md:flex"}`}>
              
              {selectedChat ?
              <>
                  {/* PRESTIGE HEADER */}
                  <div className="px-5 py-3 border-b border-amber-100/40 bg-white">
                    <div className="flex items-center gap-4">
                      <button
                      onClick={() => setSelectedConversation(null)}
                      className="md:hidden p-2 hover:bg-amber-50 rounded-xl transition-colors">
                        <ArrowLeft className="h-5 w-5 text-[#1B2333]" />
                      </button>
                      <div
                      className="relative cursor-pointer group"
                      onClick={(e) => handleAvatarClick(selectedChat as (typeof initialConversations)[0], e)}>
                        <img
                        src={selectedChat.avatar}
                        alt={selectedChat.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-100/40 group-hover:ring-[hsl(var(--gold))]/50 transition-all" />
                        {conversations.find((c) => c.id === selectedConversation)?.online &&
                      <div
                        className="absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white"
                        style={{ backgroundColor: "hsl(142, 71%, 45%)" }} />
                      }
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-bold text-[#1B2333] leading-tight text-3xl">
                          {selectedChat.name}, {selectedChat.age}
                        </h3>
                        <p className="font-medium text-base" style={{ color: "hsl(142, 71%, 35%)" }}>
                          En ligne
                        </p>
                      </div>

                      {/* Action buttons with explicit labels */}
                      <div className="flex items-center gap-1.5">
                        <button
                        onClick={() => setChatFontSizeIndex((i) => Math.max(0, i - 1))}
                        className="h-9 px-3 rounded-lg border border-amber-100 bg-white hover:bg-amber-50 flex items-center justify-center transition-colors"
                        aria-label="Réduire la taille du texte">
                          <span className="text-xs font-bold text-[#1B2333]">A−</span>
                        </button>
                        <button
                        onClick={() => setChatFontSizeIndex((i) => Math.min(FONT_SIZES.length - 1, i + 1))}
                        className="h-9 px-3 rounded-lg border border-amber-100 bg-white hover:bg-amber-50 flex items-center justify-center transition-colors"
                        aria-label="Augmenter la taille du texte">
                          <span className="text-xs font-bold text-[#1B2333]">A+</span>
                        </button>

                        <div className="w-px h-6 bg-amber-100/60 mx-1" />

                        <button
                        className="h-9 px-3 rounded-lg border border-amber-100 bg-white hover:bg-amber-50 flex items-center gap-1.5 transition-colors"
                        aria-label="Appel audio"
                        onClick={() => toast.info("Les appels seront disponibles prochainement.")}>
                          <Phone className="h-3.5 w-3.5 text-[#1B2333]" />
                          <span className="text-xs font-medium text-[#1B2333] hidden xl:inline">Appeler</span>
                        </button>
                        <button
                        className="h-9 px-3 rounded-lg border border-amber-100 bg-white hover:bg-amber-50 flex items-center gap-1.5 transition-colors"
                        aria-label="Appel vidéo"
                        onClick={() => toast.info("Les appels vidéo seront disponibles prochainement.")}>
                          <Video className="h-3.5 w-3.5 text-[#1B2333]" />
                          <span className="text-xs font-medium text-[#1B2333] hidden xl:inline">Vidéo</span>
                        </button>

                        <div className="w-px h-6 bg-amber-100/60 mx-1" />

                        <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewProfile(selectedChat as (typeof initialConversations)[0])}
                        className="gap-1.5 text-[#1B2333] hover:bg-amber-50 rounded-lg h-9 text-xs font-medium">
                          <Eye className="h-3.5 w-3.5" />
                          Voir le profil
                        </Button>
                        <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReport(selectedChat.name)}
                        className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg h-9 text-xs font-medium">
                          <Flag className="h-3.5 w-3.5" />
                          Signaler
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* MESSAGES */}
                  <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-5 space-y-4 flex flex-col">
                    {selectedChat.isNew && !dismissedNewConv.has(selectedChat.id) ?
                  <div className="flex-1 flex flex-col items-center justify-center h-full gap-4 py-12">
                        <img
                      src={selectedChat.avatar}
                      alt={selectedChat.name}
                      className="w-24 h-24 rounded-full object-cover ring-4 ring-amber-100/40" />
                    
                        <p className="text-foreground text-lg font-medium text-center">
                          Démarrez la conversation avec{" "}
                          <span className="font-heading font-bold text-[#1B2333]">{selectedChat.name}</span>
                        </p>
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1B2333]/10 text-[#1B2333] font-semibold text-sm">
                          <Send className="h-4 w-4" />
                          Démarrer le chat
                        </span>
                      </div> :

                  <>
                        <div className="flex items-center gap-3 my-2">
                          <div className="flex-1 h-px bg-amber-100/50" />
                          <span className="text-muted-foreground font-medium px-3 py-1 rounded-full bg-white border border-amber-100/40 text-lg">
                            Aujourd'hui
                          </span>
                          <div className="flex-1 h-px bg-amber-100/50" />
                        </div>
                        {mockMessages.map((msg) =>
                    <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                            {msg.sender === "them" &&
                      <img
                        src={selectedChat.avatar}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover mr-3 mt-auto shrink-0 cursor-pointer hover:ring-2 hover:ring-[hsl(var(--gold))]/40 transition-all"
                        onClick={(e) => handleAvatarClick(selectedChat as (typeof initialConversations)[0], e)} />

                      }
                            <div
                        className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${msg.sender === "me" ? "bg-[#1B2333] text-white rounded-br-md" : "bg-white rounded-bl-md border border-amber-100/40"}`}>
                        
                              <p
                          className={`leading-relaxed ${msg.sender === "them" ? "text-foreground" : "text-white"}`}
                          style={{ fontSize: `${chatFontSize}px` }}>
                          
                                {msg.text}
                              </p>
                              <div
                          className={`flex items-center gap-2 mt-1.5 ${msg.sender === "me" ? "justify-end" : ""}`}>
                          
                                <p
                            className={`text-xs ${msg.sender === "me" ? "text-white/50" : "text-muted-foreground"}`}>
                            
                                  {msg.sender === "me" ?
                            msg.read ?
                            `Lu à ${msg.time}` :
                            `Remis à ${msg.time}` :
                            msg.time}
                                </p>
                                {msg.sender === "them" &&
                          <button
                            onClick={() => speakMessage(msg.id, msg.text)}
                            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full hover:bg-amber-50 transition-colors"
                            aria-label="Écouter le message">
                            
                                    <Volume2
                              className={`h-4 w-4 transition-colors ${speakingMsgId === msg.id ? "text-[hsl(var(--gold))]" : "text-muted-foreground"}`} />
                            
                                  </button>
                          }
                              </div>
                            </div>
                          </div>
                    )}
                      </>
                  }
                  </div>

                  {/* INPUT AREA */}
                  <div className="p-4 border-t border-amber-100/40 bg-white">
                    <div className="flex items-end gap-3">
                      <button
                      onClick={toggleListening}
                      className={`min-w-[48px] min-h-[48px] w-[120px] flex items-center justify-center gap-2 rounded-xl transition-all duration-300 text-sm font-semibold shrink-0 ${isListening ? "bg-[hsl(var(--gold))] text-white animate-pulse [animation-duration:3s] shadow-[0_0_16px_hsl(var(--gold)/0.4)]" : "bg-[#1B2333] text-white hover:bg-[#1B2333]/90"}`}
                      aria-label="Dictée vocale">
                      
                        <Mic className="h-5 w-5" />
                        Dicter
                      </button>
                      <div className="flex-1">
                        <Textarea
                        ref={textareaRef}
                        placeholder="Écrivez votre message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={() => {}}
                        rows={1}
                        className="w-full min-h-[48px] max-h-[200px] resize-none bg-[hsl(var(--cream))] border border-amber-100/60 rounded-xl text-base font-medium text-foreground placeholder:text-muted-foreground placeholder:text-sm focus:border-[hsl(var(--gold))] focus:ring-0 focus:ring-offset-0 overflow-hidden py-3"
                        style={{ height: "auto" }} />
                      
                      </div>
                      <Button
                      onClick={handleSend}
                      disabled={isSent}
                      className="min-h-[48px] w-[120px] rounded-xl text-sm font-semibold gap-2 shrink-0 bg-[#1B2333] hover:bg-[#1B2333]/90 transition-all duration-300">
                      
                        {isSent ? <Check className="h-5 w-5" /> : <Send className="h-5 w-5" />}
                        {isSent ? "Envoyé" : "Envoyer"}
                      </Button>
                    </div>
                    <div className="mt-2 min-h-[1.5rem]">
                      {isListening ?
                    <div className="flex items-center gap-3">
                          <p className="font-bold text-3xl text-[#e2a036]" style={{ color: "hsl(var(--gold))" }}>
                            Je vous écoute...
                          </p>
                          <div className="flex items-end gap-1 h-5">
                            <span
                          className="w-1 bg-[hsl(var(--gold))] rounded-full animate-bounce"
                          style={{ height: "60%", animationDelay: "0ms" }} />
                        
                            <span
                          className="w-1 bg-[hsl(var(--gold))] rounded-full animate-bounce"
                          style={{ height: "100%", animationDelay: "150ms" }} />
                        
                            <span
                          className="w-1 bg-[hsl(var(--gold))] rounded-full animate-bounce"
                          style={{ height: "40%", animationDelay: "300ms" }} />
                        
                          </div>
                        </div> :
                    message.length > 0 ?
                    <p className="italic text-right text-lg" style={{ color: "hsl(var(--gold))" }}>
                          ✍️ Votre brouillon est sauvegardé
                        </p> :
                    null}
                    </div>
                  </div>
                </> :

              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-4">
                  <div className="w-16 h-16 rounded-full bg-amber-50/60 flex items-center justify-center">
                    <Send className="h-7 w-7 text-[hsl(var(--gold))]/40" />
                  </div>
                  <p className="font-heading text-xl text-[#1B2333] font-semibold text-center">
                    Reprenez le fil de vos belles rencontres
                  </p>
                  <p className="text-muted-foreground text-xl">Cliquez sur un profil à gauche pour lui écrire.</p>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      {/* Conseils Modal */}
      {showConseils &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setShowConseils(false)} />
          <div className="relative bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[hsl(var(--gold))]/40 max-w-lg w-full p-0 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-[#1B2333] px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lightbulb className="h-6 w-6 text-[hsl(var(--gold-light))]" />
                <h2 className="font-heading text-xl font-semibold text-white">9 conseils pour un bon départ</h2>
              </div>
              <button
              onClick={() => setShowConseils(false)}
              className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
              
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
            <div className="px-6 py-5 max-h-[60vh] overflow-y-auto space-y-3">
              {conseils.map((conseil, index) =>
            <div
              key={index}
              className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50/80 border border-gray-100 text-left">
              
                  <span className="shrink-0 w-8 h-8 rounded-full bg-[#1B2333] text-white flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-foreground pt-1">{conseil}</p>
                </div>
            )}
            </div>
            <div className="px-6 py-4 border-t border-amber-100/40 bg-amber-50/20">
              <Button
              onClick={() => setShowConseils(false)}
              className="w-full h-12 rounded-xl bg-[#1B2333] hover:bg-[#1B2333]/90 text-white font-medium">
              
                J'ai compris, merci !
              </Button>
            </div>
          </div>
        </div>
      }

      <MatchProfileModal
        match={matchProfileData}
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        hideActions />
      
      <ReportModal
        open={reportModalOpen}
        onOpenChange={setReportModalOpen}
        name={reportTarget}
        onUnmatchInstead={() => handleUnmatch(reportTarget)} />
      
      <ChatTooltipOverlay
        contactName={selectedChat?.name || ""}
        show={showChatTooltip}
        onDismiss={handleDismissChatTooltip} />
      
      <UnmatchModal
        open={unmatchModalOpen}
        onOpenChange={setUnmatchModalOpen}
        name={unmatchTarget}
        onConfirmUnmatch={() => handleUnmatch(unmatchTarget)}
        onReportInstead={() => handleReport(unmatchTarget)} />
      

      <Dialog
        open={showNewConvPopup}
        onOpenChange={(open) => {
          if (!open) handleDismissNewConv();
        }}>
        
        <DialogContent className="max-w-md rounded-[24px] p-0 overflow-hidden">
          <div className="bg-[#1B2333] px-6 py-5 flex items-center gap-3">
            <Clock className="h-6 w-6 text-[hsl(var(--gold-light))]" />
            <h2 className="font-heading text-xl font-semibold text-white">Nouvelle conversation</h2>
          </div>
          <div className="px-6 py-6 space-y-4">
            <p className="text-foreground text-base leading-relaxed">
              Vous avez <span className="font-bold text-[#1B2333]">3 jours</span> pour répondre à ce premier message.
              Passé ce délai, la conversation sera automatiquement archivée.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Prenez le temps de découvrir le profil de votre correspondant(e) et n'hésitez pas à faire le premier pas !
            </p>
          </div>
          <div className="px-6 py-4 border-t border-amber-100/40 bg-amber-50/20">
            <Button
              onClick={handleDismissNewConv}
              className="w-full h-12 rounded-xl bg-[#1B2333] hover:bg-[#1B2333]/90 text-white font-medium">
              
              J'ai compris, merci !
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>);

}