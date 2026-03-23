import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Search, ArrowLeft, Paperclip, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Conversation {
  id: string;
  name: string;
  role: "club" | "coach" | "player";
  avatar: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  online?: boolean;
  messages: ChatMessage[];
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffMonths < 1) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffYears < 1) return `${diffMonths}mo ago`;
  return `${diffYears}y ago`;
}

interface ChatMessage {
  id: string;
  fromMe: boolean;
  text: string;
  time: string;
}

const mockConversations: Conversation[] = [
{
  id: "1", name: "THW Kiel", role: "club", avatar: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100&h=100&fit=crop",
  lastMessage: "We have reviewed your game footage and would like to discuss a potential opportunity with our team.",
  timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), unread: 2, online: true,
  messages: [
  { id: "m1", fromMe: false, text: "Hi! We've been following your recent performances and are very impressed.", time: "Yesterday, 3:15 PM" },
  { id: "m2", fromMe: true, text: "Thank you! I appreciate your interest. I'd love to learn more about the opportunity.", time: "Yesterday, 4:02 PM" },
  { id: "m3", fromMe: false, text: "We have reviewed your game footage and would like to discuss a potential opportunity with our team.", time: "2h ago" },
  { id: "m4", fromMe: false, text: "Would you be available for a video call this week to discuss details?", time: "2h ago" }]

},
{
  id: "2", name: "Thomas Weber", role: "coach", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  lastMessage: "I'm organizing an elite training camp next month in Berlin. Would you be interested?",
  timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), unread: 1,
  messages: [
  { id: "m1", fromMe: false, text: "Hello! I'm Coach Thomas Weber, specializing in defensive systems.", time: "Yesterday, 10:00 AM" },
  { id: "m2", fromMe: true, text: "Hi Coach Weber! Great to connect with you.", time: "Yesterday, 11:30 AM" },
  { id: "m3", fromMe: false, text: "I'm organizing an elite training camp next month in Berlin. Would you be interested?", time: "5h ago" }]

},
{
  id: "3", name: "Lucas Martínez", role: "player", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  lastMessage: "Thank you for the invitation. I would be happy to attend the trial.",
  timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), unread: 0,
  messages: [
  { id: "m1", fromMe: true, text: "Hi Lucas, we'd like to invite you to our upcoming trial camp.", time: "2d ago" },
  { id: "m2", fromMe: false, text: "Thank you for the invitation. I would be happy to attend the trial.", time: "1d ago" }]

},
{
  id: "4", name: "Aalborg Håndbold", role: "club", avatar: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=100&h=100&fit=crop",
  lastMessage: "We are looking for a goalkeeper for the upcoming season. Your profile matches our needs.",
  timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), unread: 0, online: true,
  messages: [
  { id: "m1", fromMe: false, text: "We are looking for a goalkeeper for the upcoming season. Your profile matches our needs.", time: "2d ago" }]

},
{
  id: "5", name: "Marie Lefèvre", role: "coach", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  lastMessage: "I saw your profile and think you'd be a great fit for our goalkeeping program.",
  timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), unread: 0,
  messages: [
  { id: "m1", fromMe: false, text: "I saw your profile and think you'd be a great fit for our goalkeeping program.", time: "3d ago" },
  { id: "m2", fromMe: true, text: "Thanks Marie! Tell me more about the program.", time: "3d ago" },
  { id: "m3", fromMe: false, text: "It's a 6-week intensive program focused on reaction time and positioning. We start in April.", time: "3d ago" }]

},
{
  id: "6", name: "FC Barcelona Handbol", role: "club", avatar: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=100&h=100&fit=crop",
  lastMessage: "Congratulations on your recent match performance!",
  timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), unread: 0,
  messages: [
  { id: "m1", fromMe: false, text: "Congratulations on your recent match performance!", time: "1 month ago" },
  { id: "m2", fromMe: true, text: "Thank you! It means a lot coming from Barcelona.", time: "1 month ago" }]

}];


const roleColors: Record<string, string> = {
  club: "bg-primary/10 text-primary border-primary/20",
  coach: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  player: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
};

function MessagesContent() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "club" | "coach" | "player">("all");
  const navigate = useNavigate();
  const { toast } = useToast();

  const selected = conversations.find((c) => c.id === selectedId);
  const filtered = conversations.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || c.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleViewProfile = (convo: Conversation) => {
    if (convo.role === "player") {
      navigate(`/dashboard/player/${convo.id}`);
    } else {
      toast({
        title: `${convo.role.charAt(0).toUpperCase() + convo.role.slice(1)} Profile`,
        description: `${convo.name}'s profile page coming soon.`
      });
    }
  };

  const handleSend = () => {
    if (!newMessage.trim() || !selectedId) return;
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      fromMe: true,
      text: newMessage.trim(),
      time: "Just now"
    };
    setConversations((prev) =>
    prev.map((c) =>
    c.id === selectedId ?
    { ...c, messages: [...c.messages, msg], lastMessage: msg.text, timestamp: new Date() } :
    c
    )
    );
    setNewMessage("");
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex rounded-xl border border-border bg-card overflow-hidden">
      {/* Inbox List */}
      <div className={cn(
        "w-full md:w-[340px] lg:w-[380px] border-r border-border flex flex-col shrink-0",
        selectedId ? "hidden md:flex" : "flex"
      )}>
        {/* Search Header */}
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-9 h-9 text-sm bg-secondary/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} />

          </div>
          <div className="flex gap-1 mt-3">
            {(["all", "club", "coach", "player"] as const).map((role) =>
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                roleFilter === role ?
                "bg-primary text-primary-foreground" :
                "bg-secondary text-muted-foreground hover:text-foreground"
              )}>

                {role === "all" ? "All" : role.charAt(0).toUpperCase() + role.slice(1) + "s"}
              </button>
            )}
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="divide-y divide-border">
            {filtered.map((convo) =>
            <button
              key={convo.id}
              onClick={() => setSelectedId(convo.id)}
              className={cn(
                "w-full text-left p-4 hover:bg-secondary/40 transition-colors flex gap-3",
                selectedId === convo.id && "bg-secondary/60"
              )}>

                <div className="relative shrink-0">
                  <Avatar className="h-[4.5rem] w-[4.5rem] border border-border">
                    <AvatarImage src={convo.avatar} className="object-cover" />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                      {convo.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {convo.online &&
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-card" />
                }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <div className="flex items-center gap-1.5">
                      {convo.unread > 0 && <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />}
                      <span className={cn("truncate text-foreground text-base", convo.unread > 0 ? "font-bold" : "font-semibold")}>{convo.name}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground shrink-0">{formatTimestamp(convo.timestamp)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", roleColors[convo.role])}>
                      {convo.role.charAt(0).toUpperCase() + convo.role.slice(1)}
                    </Badge>
                  </div>
                  <p className={cn("truncate text-sm", convo.unread > 0 ? "text-foreground font-semibold" : "text-muted-foreground")}>{convo.lastMessage}</p>
                </div>
                {convo.unread > 0 &&
              <span className="w-5 h-5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center shrink-0 mt-1">
                    {convo.unread}
                  </span>
              }
              </button>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat View */}
      <div className={cn(
        "flex-1 flex flex-col",
        !selectedId ? "hidden md:flex" : "flex"
      )}>
        {selected ?
        <>
            {/* Chat Header */}
            <div className="h-16 flex items-center gap-3 px-4 border-b border-border shrink-0">
              <Button
              variant="ghost"
              size="icon"
              className="md:hidden shrink-0"
              onClick={() => setSelectedId(null)}>

                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="relative">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage src={selected.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                    {selected.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {selected.online &&
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-card" />
              }
              </div>
              <div
              className="flex-1 min-w-0 cursor-pointer group"
              onClick={() => handleViewProfile(selected)}>

                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{selected.name}</h3>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-muted-foreground">
                  {selected.online ? "Online" : `Last seen ${formatTimestamp(selected.timestamp)}`}
                </p>
              </div>
              <Badge variant="outline" className={cn("text-[11px]", roleColors[selected.role])}>
                {selected.role.charAt(0).toUpperCase() + selected.role.slice(1)}
              </Badge>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 max-w-2xl mx-auto">
                {selected.messages.map((msg) =>
              <div key={msg.id} className={cn("flex", msg.fromMe ? "justify-end" : "justify-start")}>
                    <div className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2.5",
                  msg.fromMe ?
                  "bg-primary text-primary-foreground rounded-br-md" :
                  "bg-secondary text-foreground rounded-bl-md"
                )}>
                      <p className="leading-relaxed text-base">{msg.text}</p>
                      <p className={cn(
                    "text-[10px] mt-1",
                    msg.fromMe ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
              )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border shrink-0">
              <form
              onSubmit={(e) => {e.preventDefault();handleSend();}}
              className="flex items-center gap-2 max-w-2xl mx-auto">

                <Button type="button" variant="ghost" size="icon" className="shrink-0 text-muted-foreground">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Input
                placeholder="Type a message..."
                className="flex-1 h-10 text-sm bg-secondary/50"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)} />

                <Button type="submit" size="icon" className="shrink-0" disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </> :

        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
              <Send className="h-7 w-7" />
            </div>
            <p className="font-medium text-base">Select a conversation</p>
            <p className="text-base">Choose from your existing conversations to start chatting</p>
          </div>
        }
      </div>
    </div>);

}

export default function Messages() {
  return (
    <DashboardLayout>
      <MessagesContent />
    </DashboardLayout>);

}