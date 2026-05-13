import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
  message: string | null;
}

/**
 * Scoped error boundary for the Admin Portal.
 * Prevents any admin-side crash from propagating to the public site.
 */
export class AdminErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message ?? "Erreur inconnue" };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("[admin_portal] ErrorBoundary captured:", error, info);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, message: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        className="min-h-screen grid place-items-center px-6"
        style={{ background: "#070B14", color: "#E5E7EB" }}
      >
        <div
          className="max-w-md w-full rounded-xl border p-8 text-center"
          style={{ background: "#0F1828", borderColor: "#1F2A44" }}
        >
          <div
            className="mx-auto h-14 w-14 rounded-full grid place-items-center mb-5"
            style={{ background: "rgba(201,169,97,0.10)", color: "#C9A961" }}
          >
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-semibold mb-2" style={{ color: "#F8FAFC" }}>
            Système temporairement indisponible
          </h1>
          <p className="text-base opacity-70 leading-relaxed mb-6">
            Une erreur est survenue lors du chargement de cette section. Nos équipes
            techniques en ont été informées. Veuillez réessayer dans quelques instants.
          </p>
          {this.state.message && (
            <p
              className="text-base font-mono px-3 py-2 rounded-md mb-6 opacity-60 break-words"
              style={{ background: "#070B14", border: "1px solid #1F2A44" }}
            >
              {this.state.message}
            </p>
          )}
          <button
            onClick={this.handleRetry}
            className="inline-flex items-center gap-2 h-12 px-6 rounded-md font-semibold text-base transition-opacity hover:opacity-90"
            style={{ background: "#C9A961", color: "#0E1626" }}
          >
            <RotateCcw className="h-4 w-4" />
            Réessayer
          </button>
        </div>
      </div>
    );
  }
}
