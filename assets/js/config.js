/* Adams Lux Auto — business settings.
   Edit these values to change contact info, fees and backend keys site-wide. */
window.ALA_CONFIG = {
  business: "Adams Lux Auto",
  email: "adam@adamsluxauto.com",
  phone: "",       // leave empty to hide call/text buttons
  phoneDisplay: "",
  serviceArea: "San Francisco Bay Area",
  hours: "Handoffs 7am–10pm daily. After-hours by arrangement.",
  instagram: "",        // e.g. "https://instagram.com/adamsluxauto"
  logoSrc: "assets/img/logo.png",

  deposit: 500,
  deliveryFee: 120,     // flat, any listed or custom Bay Area address; covers drop-off and return pickup
  includedMilesPerDay: 200,
  overageRate: 0.75,    // $ per mile over the allowance
  discounts: [ { minDays: 7, pct: 12 } ], // multi-day discounts, largest first
  // Promo codes: % off the daily-rate subtotal. Does not stack with the multi-day discount (the bigger one applies).
  promos: [
    { code: "BLACKFRIDAY20", pct: 20, label: "Black Friday", ends: "2026-12-19T08:00:00Z" }, // ends Dec 18, 11:59 PM PT
    { code: "CYBERMONDAY20", pct: 20, label: "Cyber Monday", ends: "2026-12-01T08:00:00Z" }, // ends Mon Nov 30, 11:59 PM PT
  ],

  // Supabase (private storage for license photos, signed agreements and booking requests).
  // The publishable/anon key is safe to ship in the browser; row-level security only allows inserts.
  supabaseUrl: "https://thhwnmlieshsxkjhyuxb.supabase.co",
  supabaseKey: "sb_publishable_HCj9_NUuWIomidqfH14ZEA_2fL1idH1",
  docsBucket: "guest-docs",
  agreementVersion: "ALA-RA-2026.11.2"
};
