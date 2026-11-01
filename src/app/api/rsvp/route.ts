import { wedding } from "@/config/wedding";
import { validateRsvp } from "@/lib/rsvp";
import { rsvpCeremony } from "@/lib/wedding-data";

/**
 * Persists an RSVP by forwarding it to RSVP_WEBHOOK_URL (see README → "RSVP storage").
 * Without that variable the route reports 503 so the form never shows a false success.
 */
export async function POST(request: Request) {
  if (!wedding.rsvp.enabled) return Response.json({ error: "closed" }, { status: 403 });

  const webhook = process.env.RSVP_WEBHOOK_URL;
  if (!webhook) return Response.json({ error: "not_configured" }, { status: 503 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: real guests never see or fill this field.
  if (typeof body.website === "string" && body.website) return Response.json({ ok: true });

  const result = validateRsvp(body, wedding.rsvp);
  if (!result.ok) return Response.json({ error: "invalid", errors: result.errors }, { status: 422 });

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.RSVP_WEBHOOK_SECRET && { authorization: `Bearer ${process.env.RSVP_WEBHOOK_SECRET}` }),
      },
      body: JSON.stringify({ ...result.data, event: rsvpCeremony?.name ?? "", secret: process.env.RSVP_WEBHOOK_SECRET, submittedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(10_000),
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`webhook responded ${res.status}`);
    // Apps Script and similar hooks reply 200 even on failure; trust an explicit error body.
    const reply = await res.json().catch(() => null);
    if (reply && typeof reply === "object" && "error" in reply) throw new Error(`webhook error: ${JSON.stringify(reply)}`);
  } catch (err) {
    console.error("RSVP storage failed:", err);
    return Response.json({ error: "storage_failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
