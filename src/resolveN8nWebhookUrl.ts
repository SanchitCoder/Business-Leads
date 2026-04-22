let cached: Promise<string | undefined> | null = null;

/**
 * Runtime URL from `public/n8n-webhook-config.json` (works on static deploys),
 * falling back to `VITE_N8N_WEBHOOK_URL` from `.env` at build time.
 */
export function resolveN8nWebhookUrl(): Promise<string | undefined> {
  if (!cached) {
    cached = (async () => {
      try {
        const res = await fetch("/n8n-webhook-config.json", { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as { webhookUrl?: string };
          const fromFile = data.webhookUrl?.trim();
          if (fromFile) return fromFile;
        }
      } catch {
        /* use env */
      }
      return import.meta.env.VITE_N8N_WEBHOOK_URL?.trim() || undefined;
    })();
  }
  return cached;
}
