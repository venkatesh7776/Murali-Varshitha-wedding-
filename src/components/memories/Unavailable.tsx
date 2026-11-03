/** Shown when the gallery backend is not configured or can't be reached. Never pretends to be empty. */
export function Unavailable({ reason }: { reason: "not_configured" | "error" }) {
  return (
    <div role="status" className="mx-auto max-w-md rounded-sm border border-gold/35 bg-ivory/70 px-6 py-14 text-center">
      <p className="font-display text-2xl text-maroon">Our memories will be back shortly</p>
      <p className="mt-3 text-ink-muted">
        {reason === "not_configured"
          ? "The photo gallery isn't connected yet."
          : "We couldn't load the photos just now. Please refresh in a moment."}
      </p>
    </div>
  );
}
