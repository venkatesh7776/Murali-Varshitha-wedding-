import { wedding } from "@/config/wedding";
import { formatDate, formatTime, zonedToDate, zoneLabel } from "./time";

const tz = wedding.timeZone;

/** Groom first, as on the printed invitation. */
export const coupleNames = `${wedding.groom.name} & ${wedding.bride.name}`;

export const weddingDate = wedding.weddingStart ? zonedToDate(wedding.weddingStart, tz) : undefined;

export const weddingDateLabel = weddingDate
  ? formatDate(weddingDate, tz, { weekday: "long" })
  : "Date to be announced";

const venueById = new Map(wedding.venues.map((v) => [v.id, v]));

/** Ceremonies with real instants, their venue and display strings, in chronological order. */
export const ceremonies = wedding.ceremonies
  .map((c) => {
    const start = zonedToDate(c.start, tz);
    const end = c.end ? zonedToDate(c.end, tz) : undefined;
    const venue = venueById.get(c.venueId);
    if (!venue) throw new Error(`Ceremony "${c.id}" references unknown venue "${c.venueId}"`);
    return {
      ...c,
      venue,
      startIso: start.toISOString(),
      // Calendars need an end; default to 3 hours when none is supplied.
      endIso: (end ?? new Date(start.getTime() + 3 * 3600_000)).toISOString(),
      dateLabel: formatDate(start, tz, { weekday: "long" }),
      timeLabel: `${formatTime(start, tz)}${end ? ` – ${formatTime(end, tz)}` : " onwards"} ${zoneLabel(start, tz)}`,
    };
  })
  .sort((a, b) => a.startIso.localeCompare(b.startIso));

export type CeremonyView = (typeof ceremonies)[number];

/** The ceremony featured in the venue section (the Muhurtham). */
export const venueCeremony = ceremonies.find((c) => c.id === wedding.venueCeremonyId);

/** The ceremony the RSVP form is for (the reception). */
export const rsvpCeremony = ceremonies.find((c) => c.id === wedding.rsvp.ceremonyId);

/**
 * The countdown switches to "Today is the day!" at the muhurtham and stays there until the
 * end of that day (IST) or the last ceremony, whichever is later; then it shows a thank-you.
 */
export const celebrationsEndIso = (() => {
  if (!weddingDate) return undefined;
  const endOfDay = zonedToDate(`${wedding.weddingStart.split("T")[0]}T23:59`, tz).toISOString();
  return [endOfDay, ...ceremonies.map((c) => c.endIso)].sort().at(-1);
})();
