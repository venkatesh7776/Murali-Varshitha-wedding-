export type RsvpPayload = {
  id: string;
  name: string;
  attending: "yes" | "no";
  guests: number;
  message: string;
};

export type RsvpErrors = Partial<Record<"name" | "attending" | "guests" | "message", string>>;

export const LIMITS = { name: 80, message: 500 };

/** Shared by the form and the API route so both enforce identical rules. */
export function validateRsvp(
  input: Partial<Record<keyof RsvpPayload, unknown>>,
  opts: { collectGuestCount: boolean; maxGuests: number },
): { ok: true; data: RsvpPayload } | { ok: false; errors: RsvpErrors } {
  const errors: RsvpErrors = {};
  const name = typeof input.name === "string" ? input.name.trim().replace(/\s+/g, " ") : "";
  const attending = input.attending;
  const message = typeof input.message === "string" ? input.message.trim() : "";
  const guests = Number(input.guests ?? 1);

  if (name.length < 2) errors.name = "Please enter your name.";
  else if (name.length > LIMITS.name) errors.name = `Please keep your name under ${LIMITS.name} characters.`;

  if (attending !== "yes" && attending !== "no") errors.attending = "Please let us know if you will be attending.";

  if (attending === "yes" && opts.collectGuestCount) {
    if (!Number.isInteger(guests) || guests < 1 || guests > opts.maxGuests)
      errors.guests = `Please choose between 1 and ${opts.maxGuests} guests.`;
  }

  if (message.length > LIMITS.message) errors.message = `Please keep your wishes under ${LIMITS.message} characters.`;

  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    data: {
      id: typeof input.id === "string" ? input.id.slice(0, 64) : "",
      name,
      attending: attending as "yes" | "no",
      guests: attending === "yes" ? (opts.collectGuestCount ? guests : 1) : 0,
      message,
    },
  };
}
