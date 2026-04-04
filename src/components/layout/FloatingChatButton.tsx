import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      <div
        className={cn(
          "absolute bottom-16 right-0 w-80 md:w-96 bg-background rounded-2xl shadow-elegant border border-border overflow-hidden transition-all duration-300 origin-bottom-right",
          isOpen ?
          "opacity-100 scale-100 translate-y-0" :
          "opacity-0 scale-95 translate-y-4 pointer-events-none"
        )}>
        
        {/* Header */}
        <div className="bg-primary p-4 text-primary-foreground">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-semibold text-2xl">Votre Conciergerie Kalimera</h3>
              <p className="opacity-80 text-lg">Nous répondons en quelques minutes</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors">
              
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="h-64 p-4 bg-secondary/30 overflow-y-auto">
          <div className="bg-background rounded-xl p-3 shadow-soft max-w-[80%]">
            <p className="text-foreground text-lg">
              Bonjour ! 👋 Comment pouvons-nous vous aider aujourd'hui ?
            </p>
            <span className="text-base text-muted-foreground mt-1 block">
              Équipe Toi & Moi
            </span>
          </div>
        </div>

        {/* Input */}
        <div className="p-4 bg-background border-t border-border">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (message.trim()) {
                // Handle message send
                setMessage("");
              }
            }}
            className="flex gap-2">
            
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Écrivez votre message..."
              className="flex-1" />
            
            <Button type="submit" size="icon" className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-elegant flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg",
          isOpen && "rotate-0"
        )}>
        
        {isOpen ?
        <X className="h-6 w-6" /> :

        <MessageCircle className="h-6 w-6" />
        }
      </button>

      {/* Pulse indicator when closed */}
      {!isOpen &&
      <span className="absolute top-0 right-0 w-3 h-3 bg-accent rounded-full animate-pulse" />
      }
    </div>);

}