import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Eye, X } from "lucide-react";

const sampleData = {
  recipientEmail: "user@example.com",
  recipientName: "Jean-Pierre",
  matchName: "Marie",
  matchAge: 67,
  matchLocation: "75014 - Paris",
  affinity: 85,
  matchAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
  matchId: 1,
};

export default function EmailPreview() {
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const generatePreview = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-match-email", {
        body: sampleData,
      });
      if (error) throw error;
      setHtml(data.html);
      setModalOpen(true);
    } catch (err) {
      console.error("Error generating email preview:", err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate on mount
  useEffect(() => {
    generatePreview();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-muted py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-heading text-3xl font-semibold text-foreground flex items-center gap-3">
                <Mail className="h-7 w-7 text-primary" />
                Aperçu Email Match
              </h1>
              <p className="text-muted-foreground mt-1">Template d'email envoyé lors d'un nouveau match</p>
            </div>
            <Button onClick={generatePreview} disabled={loading} size="lg">
              <Eye className="h-5 w-5 mr-2" />
              {loading ? "Génération..." : "Voir l'aperçu"}
            </Button>
          </div>

          {!modalOpen && !loading && (
            <div className="bg-background rounded-2xl shadow-card p-16 text-center border border-border/30">
              <Mail className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                Cliquez sur "Voir l'aperçu" pour afficher le template d'email
              </p>
            </div>
          )}

          {loading && (
            <div className="bg-background rounded-2xl shadow-card p-16 text-center border border-border/30">
              <div className="animate-pulse text-muted-foreground text-lg">Chargement...</div>
            </div>
          )}
        </div>
      </div>

      {/* Full-screen scrollable modal */}
      {modalOpen && html && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-foreground/60 backdrop-blur-sm overflow-y-auto py-8 px-4">
          <div className="relative w-full max-w-[680px] bg-background rounded-2xl shadow-2xl border border-border/30 my-auto">
            {/* Sticky close button */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-background/95 backdrop-blur-sm border-b border-border/20 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <span className="font-heading text-lg font-semibold text-foreground">Aperçu de l'email</span>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5 text-foreground" />
              </button>
            </div>

            {/* Email content rendered as HTML */}
            <div className="p-2">
              <div
                className="w-full"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
