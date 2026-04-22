import { useState, useRef } from "react";
import {
  Briefcase,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  MapPin,
  Tag,
  RotateCcw,
} from "lucide-react";
import { resolveN8nWebhookUrl } from "./resolveN8nWebhookUrl";

export default function App() {
  const [genre, setGenre] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const genreRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setGenre("");
    setLocation("");
    setError("");
    setSuccess(false);
    genreRef.current?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const g = genre.trim();
    const loc = location.trim();
    if (!g) {
      setError("Lead genre is required");
      genreRef.current?.focus();
      return;
    }
    if (!loc) {
      setError("Location is required");
      return;
    }

    setError("");
    setSuccess(false);
    setLoading(true);

    const webhookUrl = (await resolveN8nWebhookUrl())?.trim();
    if (!webhookUrl) {
      setError(
        "Webhook URL is not configured yet. Add your n8n URL to public/n8n-webhook-config.json, or set VITE_N8N_WEBHOOK_URL before building."
      );
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ genre: g, location: loc }),
      });

      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        setError(
          detail.trim() || `Request failed (${res.status}). Check your n8n workflow.`
        );
        return;
      }

      setSuccess(true);
    } catch {
      setError("Could not reach the server. Check your connection and webhook URL.");
    } finally {
      setLoading(false);
    }
  };

  const clearErrorOnChange = () => {
    if (error) setError("");
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-10 overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950" />
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/30 via-transparent to-transparent" />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-20 w-[28rem] h-[28rem] bg-indigo-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 -left-32 w-[26rem] h-[26rem] bg-emerald-500/15 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/3 w-[30rem] h-[30rem] bg-violet-500/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative w-full max-w-lg animate-card-enter">
        <div className="bg-slate-900/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/40 border border-white/10 p-8 sm:p-10">
          {success ? (
            <div className="flex flex-col items-center text-center py-4 sm:py-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-900/50 mb-6 ring-4 ring-emerald-500/20">
                <CheckCircle className="w-10 h-10 text-white" strokeWidth={1.75} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Data stored successfully
              </h2>
              <p className="text-slate-400 text-sm mt-3 max-w-sm leading-relaxed">
                Your business lead genre and location were sent to the workflow and
                saved. You can submit another entry whenever you need to.
              </p>
              <button
                type="button"
                onClick={resetForm}
                className="mt-8 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 shadow-lg shadow-indigo-950/50 transition-all duration-200 active:scale-[0.98]"
              >
                <RotateCcw className="w-4 h-4" />
                Submit another lead
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-900/40 mb-5 ring-1 ring-white/10">
                  <Briefcase className="w-8 h-8 text-white" strokeWidth={1.75} />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-center">
                  Enter your business lead genre &amp; location
                </h1>
                <p className="text-slate-400 text-sm mt-2 text-center max-w-md leading-relaxed">
                  Tell us what kind of leads you want and where they should be focused.
                  We will forward this to your automation pipeline.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="space-y-1.5">
                  <label
                    htmlFor="lead-genre"
                    className="flex items-center gap-2 text-sm font-semibold text-slate-200"
                  >
                    <Tag className="w-4 h-4 text-indigo-400" aria-hidden />
                    Lead genre
                  </label>
                  <input
                    ref={genreRef}
                    id="lead-genre"
                    type="text"
                    value={genre}
                    onChange={(e) => {
                      setGenre(e.target.value);
                      clearErrorOnChange();
                    }}
                    placeholder="e.g. SaaS founders, local retail, B2B manufacturing"
                    disabled={loading}
                    autoComplete="off"
                    className={`
                      w-full px-4 py-3.5 rounded-xl border text-slate-100 text-sm
                      placeholder:text-slate-500 bg-slate-800/80
                      transition-all duration-200 outline-none
                      focus:ring-2 focus:ring-offset-0 focus:ring-offset-transparent
                      disabled:opacity-60 disabled:cursor-not-allowed
                      ${
                        error
                          ? "border-red-400/50 focus:border-red-400 focus:ring-red-500/30"
                          : "border-slate-600/80 focus:border-indigo-400 focus:ring-indigo-500/25 hover:border-slate-500"
                      }
                    `}
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="lead-location"
                    className="flex items-center gap-2 text-sm font-semibold text-slate-200"
                  >
                    <MapPin className="w-4 h-4 text-emerald-400" aria-hidden />
                    Location
                  </label>
                  <input
                    id="lead-location"
                    type="text"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      clearErrorOnChange();
                    }}
                    placeholder="e.g. Mumbai, UK–EU, North America remote"
                    disabled={loading}
                    autoComplete="off"
                    className={`
                      w-full px-4 py-3.5 rounded-xl border text-slate-100 text-sm
                      placeholder:text-slate-500 bg-slate-800/80
                      transition-all duration-200 outline-none
                      focus:ring-2 focus:ring-offset-0 focus:ring-offset-transparent
                      disabled:opacity-60 disabled:cursor-not-allowed
                      ${
                        error
                          ? "border-red-400/50 focus:border-red-400 focus:ring-red-500/30"
                          : "border-slate-600/80 focus:border-emerald-400 focus:ring-emerald-500/25 hover:border-slate-500"
                      }
                    `}
                  />
                </div>

                <div
                  className={`flex items-start gap-2 transition-all duration-300 overflow-hidden ${
                    error ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-xs font-medium text-red-300 text-left leading-snug">
                    {error}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`
                    w-full py-3.5 px-6 rounded-xl font-semibold text-sm
                    flex items-center justify-center gap-2
                    transition-all duration-200
                    active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70
                    ${
                      loading
                        ? "bg-indigo-500/80 text-white"
                        : "bg-gradient-to-r from-indigo-500 to-emerald-500 text-white shadow-lg shadow-indigo-950/40 hover:shadow-indigo-900/50 hover:from-indigo-400 hover:to-emerald-400"
                    }
                  `}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending to workflow…</span>
                    </>
                  ) : (
                    <>
                      <span>Store lead preferences</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs text-slate-500 mt-5">
          Submitted securely over HTTPS to your configured n8n webhook
        </p>
      </div>
    </div>
  );
}
