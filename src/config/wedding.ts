/**
 * Single source of truth for every wedding detail shown on the site.
 *
 * Wedding of Murali N. & Varshitha D. S. — 16–19 November 2026, Mulbagal.
 * Couple portraits and gallery photos are not set yet: add real photographs under
 * public/images and reference them here (sections fall back gracefully until then).
 *
 * Dates/times are written as local wall-clock time ("YYYY-MM-DDTHH:mm") in
 * `timeZone`; the site converts them correctly for every guest.
 */

export type Person = {
  /** Short display name used in the hero, intro and closing */
  name: string;
  /** Full name as written on the printed invitation */
  invitationName?: string;
  qualification?: string;
  /** Family home, shown in the couple section */
  address?: string;
  /** Short line under the name, e.g. "Daughter of ..." — optional */
  parents?: string;
  intro?: string;
  /** Path under /public, e.g. "/images/couple/bride.jpg" */
  photo?: string;
};

export type Ceremony = {
  id: string;
  name: string;
  /** Optional regional/Sanskrit name shown as a small label */
  subtitle?: string;
  start: string;
  end?: string;
  /** id of an entry in `venues` */
  venueId: string;
  description?: string;
  dressCode?: string;
  /** Illustration motif used when no photo/generated image exists */
  motif: "haldi" | "mehendi" | "sangeet" | "vivah" | "reception";
  photo?: string;
};

export type Venue = {
  id: string;
  name: string;
  address: string;
  /** Exact Google Maps link supplied by the family — used for "Get Directions" */
  mapUrl: string;
  photo?: string;
};

export type GalleryImage = { src?: string; alt: string; shape?: "tall" | "wide" | "square" };

export type WeddingConfig = {
  isSample: boolean;
  invocation: string;
  timeZone: string;
  bride: Person;
  groom: Person;
  /** Heading and line shown in the couple section */
  coupleHeading: string;
  coupleIntro?: string;
  /** Full invitation message (currently used for the link-preview description) */
  invitation?: string;
  weddingStart: string;
  ceremonies: Ceremony[];
  venues: Venue[];
  /** The ceremony (by id) whose venue the venue section shows */
  venueCeremonyId: string;
  gallery: GalleryImage[];
  rsvp: {
    enabled: boolean;
    /** The ceremony (by id) guests are replying for */
    ceremonyId: string;
    collectGuestCount: boolean;
    maxGuests: number;
    deadline?: string;
  };
  closing: {
    message: string;
    families?: string;
    blessing?: string;
    contacts: { label: string; phone: string }[];
  };
  music: { src: string; title: string; credit: string };
  site: { url: string };
};

export const wedding: WeddingConfig = {
  isSample: false,

  invocation: "Om Shri Ganeshaya Namah",
  timeZone: "Asia/Kolkata",

  groom: {
    name: "Murali N.",
    invitationName: "Ch. Ry Murali. N",
    qualification: "B.E., M.S.",
    parents: "Son of Smt. Manjula. K & Sri. Narayanaswamy. M",
    address: "Channapura, Angondahalli Panchayathi, Mulbagal Taluk, Kolar District.",
    photo: "/images/couple/groom.webp",
  },

  bride: {
    name: "Varshitha D. S.",
    invitationName: "Ch. Sou. Varshitha. D. S",
    qualification: "B.Sc.",
    parents: "Daughter of Smt. Bharathi. S & Sri. Santhosh. M",
    address: "Doddamadenahalli, Balla Panchayathi, Mulbagal Taluk, Kolar District.",
    photo: "/images/couple/bride.webp",
  },

  coupleHeading: "Meet the Couple",
  coupleIntro: "Two families, one beautiful beginning.",

  invitation:
    "With the blessings of our elders, we cordially invite you and your family to join us in celebrating the wedding of Murali and Varshitha. Your gracious presence and blessings will make our special occasion even more memorable.",

  /** The Muhurtham (IST); drives the countdown and the hero date. */
  weddingStart: "2026-11-19T04:30",

  ceremonies: [
    {
      id: "haldi",
      name: "Haldi",
      start: "2026-11-16T14:00",
      venueId: "home",
      description: "Let's begin the celebrations with colours, laughter, and blessings. Join us for a joyful Haldi celebration.",
      motif: "haldi",
    },
    {
      id: "mehendi",
      name: "Mehendi",
      start: "2026-11-17T14:00",
      venueId: "home",
      description: "An afternoon filled with beautiful traditions, intricate mehendi, and happy moments. We can't wait to celebrate with you.",
      motif: "mehendi",
    },
    {
      id: "reception",
      name: "Reception",
      start: "2026-11-18T18:30",
      venueId: "hall",
      description: "Join us for an evening of celebration, joy, and togetherness as we begin this beautiful new chapter.",
      motif: "reception",
    },
    {
      id: "muhurtham",
      name: "Muhurtham",
      subtitle: "The wedding ceremony",
      start: "2026-11-19T04:30",
      end: "2026-11-19T05:30",
      venueId: "hall",
      description: "With the blessings of our families and elders, join us for the auspicious wedding ceremony of Murali and Varshitha.",
      motif: "vivah",
    },
  ],

  venues: [
    {
      id: "home",
      name: "Murali Home",
      address: "Doddamadenahalli, Karnataka 563131.",
      mapUrl: "https://maps.app.goo.gl/394Awx3uaKu5ZQuV7?g_st=ic",
    },
    {
      id: "hall",
      name: "Sri Phoolchand Jain Convention Hall",
      address: "Near Sonnavadi Road, NH 75 Bridge, M.N. Road, Mulbagal Bypass, Mulbagal - 563131, Kolar District.",
      mapUrl: "https://maps.app.goo.gl/CYFUihGDYqt4CLbq5",
    },
  ],

  venueCeremonyId: "muhurtham",

  /** Add the couple's own photographs here (e.g. { src: "/images/gallery/01.webp", alt: "…", shape: "tall" }). Empty hides the section. */
  gallery: [],

  rsvp: {
    enabled: true,
    ceremonyId: "reception",
    collectGuestCount: true,
    maxGuests: 5,
  },

  closing: {
    message: "Two hearts. One beautiful journey.\nWe look forward to celebrating this special beginning with you.",
    contacts: [],
  },

  music: {
    /** Path under /public to a licensed track, e.g. "/audio/shehnai.mp3". Empty hides the control. */
    src: "/audio/wedding-instrumental.mp3",
    title: "Wedding instrumental",
    /** Shown in the footer when set — CC BY tracks must credit the artist and licence */
    credit: "",
  },

  site: {
    /** Public URL once deployed — used for share links and social previews */
    url: "",
  },
};
