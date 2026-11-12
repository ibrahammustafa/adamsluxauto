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

  deposit: 1000,
  deliveryFee: 120,     // flat, any listed or custom Bay Area address; covers drop-off and return pickup
  includedMilesPerDay: 200,
  overageRate: 0.75,    // $ per mile over the allowance
  discounts: [ { minDays: 7, pct: 12 }, { minDays: 3, pct: 5 } ], // multi-day discounts, largest first

  // Supabase (private storage for license photos, signed agreements and booking requests).
  // The publishable/anon key is safe to ship in the browser; row-level security only allows inserts.
  supabaseUrl: "https://thhwnmlieshsxkjhyuxb.supabase.co",
  supabaseKey: "sb_publishable_HCj9_NUuWIomidqfH14ZEA_2fL1idH1",
  docsBucket: "guest-docs",
  agreementVersion: "ALA-RA-2026.11"
};
