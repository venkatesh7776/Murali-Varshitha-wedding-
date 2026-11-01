/** Offset (ms) of `timeZone` from UTC at the given instant. */
function zoneOffset(instant: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(instant);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return asUtc - instant.getTime();
}

/** Converts a wall-clock "YYYY-MM-DDTHH:mm" in `timeZone` to a real instant. */
export function zonedToDate(local: string, timeZone: string): Date {
  const [d, t = "00:00"] = local.split("T");
  const [y, mo, da] = d.split("-").map(Number);
  const [h, mi] = t.split(":").map(Number);
  const guess = Date.UTC(y, mo - 1, da, h, mi);
  // Two passes settle correctly across DST boundaries.
  let ts = guess - zoneOffset(new Date(guess), timeZone);
  ts = guess - zoneOffset(new Date(ts), timeZone);
  return new Date(ts);
}

export function formatDate(date: Date, timeZone: string, opts?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone,
    day: "numeric",
    month: "long",
    year: "numeric",
    ...opts,
  }).format(date);
}

export function formatTime(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-IN", { timeZone, hour: "numeric", minute: "2-digit", hour12: true })
    .format(date)
    .replace(/\s?([ap])\.?m\.?/i, (_, x: string) => ` ${x.toLowerCase()}m`);
}

/** Short zone label such as "IST" for display next to times. */
export function zoneLabel(date: Date, timeZone: string) {
  // en-IN names IST; en-US names US zones (EST/EDT) — use whichever gives a real abbreviation.
  for (const locale of ["en-IN", "en-US"]) {
    const name = new Intl.DateTimeFormat(locale, { timeZone, timeZoneName: "short" })
      .formatToParts(date)
      .find((p) => p.type === "timeZoneName")?.value;
    if (name && !name.startsWith("GMT")) return name;
  }
  return timeZone;
}
