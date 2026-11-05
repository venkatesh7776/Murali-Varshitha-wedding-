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
  /** e.g. { relation: "Son of", names: ["Smt. …", "Sri. …"] } — names are shown in bold */
  parents?: { relation: string; names: string[] };
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
  /** Set false to hide the secondary (EST) time for this event */
  showSecondaryTime?: boolean;
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

export type Credit = {
  role: string;
  name: string;
  /** Smaller line under the name, e.g. "by Santhosh Vemula" */
  byline?: string;
  description?: string;
  link?: { label: string; url: string };
  icon: "camera" | "lotus";
  /** Black-on-transparent logo under /public, shown in the medallion instead of the icon */
  logo?: { src: string; alt: string; width: number; height: number };
  /** Placeholder until the real details arrive — shown softly as "coming soon" */
  placeholder?: boolean;
};

export type GalleryImage = { src?: string; alt: string; shape?: "tall" | "wide" | "square" };

export type WeddingConfig = {
  isSample: boolean;
  invocation: string;
  timeZone: string;
  /** Second time zone shown beside every event time, for guests abroad (e.g. "America/New_York") */
  secondaryTimeZone?: string;
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
  /** The ceremony (by id) the countdown counts down to */
  countdownCeremonyId: string;
  gallery: GalleryImage[];
  credits: { heading: string; intro?: string; items: Credit[] };
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
  /** US Eastern (EST in November) */
  secondaryTimeZone: "America/New_York",

  groom: {
    name: "Murali N.",
    invitationName: "Ch. Ry Murali. N",
    qualification: "B.E., M.S.",
    parents: { relation: "Son of", names: ["Smt. Manjula K.", "Sri Narayanaswamy M."] },
    address: "Channapura, Mulbagal Taluk, Kolar District, Karnataka",
    photo: "/images/couple/groom-portrait.webp",
  },

  bride: {
    name: "Varshitha D. S.",
    invitationName: "Ch. Sou. Varshitha. D. S",
    qualification: "B.Sc.",
    parents: { relation: "Daughter of", names: ["Smt. Bharathi S.", "Sri Santhosh M."] },
    address: "Doddamadenahalli, Mulbagal Taluk, Kolar District, Karnataka",
    photo: "/images/couple/bride-portrait.webp",
  },

  coupleHeading: "Meet the Couple",
  coupleIntro: "Two souls, one beautiful journey, forever intertwined.",

  invitation:
    "With the blessings of our elders, we cordially invite you and your family to join us in celebrating the wedding of Murali and Varshitha. Your gracious presence and blessings will make our special occasion even more memorable.",

  /** The Reception (IST) — the main event; drives the hero and closing date. */
  weddingStart: "2026-11-18T18:30",

  /** Display order on the page — the Reception is the main event. */
  ceremonies: [
    {
      id: "reception",
      name: "Reception",
      start: "2026-11-18T18:30",
      venueId: "hall",
      description:
        "An evening of elegance, a celebration of love, and memories to cherish forever. We warmly invite you and your family to grace our wedding reception with your presence and blessings.",
      motif: "reception",
    },
    {
      id: "muhurtham",
      name: "Muhurtham",
      subtitle: "The wedding ceremony",
      start: "2026-11-19T04:30",
      end: "2026-11-19T05:30",
      venueId: "hall",
      description:
        "Two hearts united in love, two souls blessed for a lifetime. With the blessings of our elders and the grace of the Almighty, we warmly invite you and your family to witness the sacred union of Murali and Varshitha.",
      motif: "vivah",
    },
    {
      id: "haldi",
      name: "Haldi",
      start: "2026-11-16T14:00",
      venueId: "home",
      showSecondaryTime: false,
      description: "Let's begin the celebrations with colours, laughter, and blessings. Join us for a joyful Haldi celebration.",
      motif: "haldi",
    },
    {
      id: "mehendi",
      name: "Mehendi",
      start: "2026-11-17T11:00",
      venueId: "home",
      showSecondaryTime: false,
      description: "An afternoon filled with beautiful traditions, intricate mehendi, and happy moments. We can't wait to celebrate with you.",
      motif: "mehendi",
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
      /** Illustrative artwork of a reception hall (not a photograph of the venue) */
      photo: "/images/generated/venue-reception.webp",
    },
  ],

  venueCeremonyId: "reception",
  countdownCeremonyId: "reception",

  /** Add photos as { src: "/images/gallery/01.webp", alt: "…", shape: "tall" | "wide" | "square" }. Empty hides the section. */
  gallery: [],

  credits: {
    heading: "Our Photographer",
    intro: "Capturing every smile, ritual and moment of our celebration.",
    items: [
      {
        role: "Photography",
        name: "Unscripted Stories",
        byline: "by Santhosh Vemula",
        logo: { src: "/images/credits/unscripted-stories.png", alt: "Unscripted Stories by Santosh Vemula logo", width: 491, height: 136 },
        link: { label: "@unscriptedstoriesbysv", url: "https://www.instagram.com/unscriptedstoriesbysv" },
        icon: "camera",
      },
    ],
  },

  rsvp: {
    enabled: true,
    ceremonyId: "reception",
    collectGuestCount: true,
    maxGuests: 5,
  },

  closing: {
    message:
      "Two hearts, one beautiful journey, a lifetime of togetherness.\nYour presence and blessings will make our celebration truly unforgettable.",
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
