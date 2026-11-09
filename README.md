# Adams Lux Auto

Private luxury car rental site, served by GitHub Pages at https://adamsluxauto.com.

- `assets/js/config.js`: phone, email, deposit, delivery fee, mileage, discounts, backend keys
- `assets/js/data.js`: fleet (prices, specs, photos), add-ons, delivery spots, policies, FAQ
- `assets/js/agreement.js`: rental agreement and liability waiver text (bump `agreementVersion` in config when it changes)
- `assets/img/`: car photos (plates blurred)

Bookings, signed agreements and inquiries are saved to Supabase (project `adamsluxauto`).
License photos and insurance cards go to the private `guest-docs` storage bucket.
View them in the Supabase dashboard under Table Editor and Storage.

## Alerts and payments (Supabase Edge Functions)

- `notify`: a database trigger calls it on every new booking, signed agreement, check-in and inquiry, and it emails the owner through Resend.
  Needs the secret `RESEND_API_KEY`. Optional `ALERT_TO` (default adamsluxauto@gmail.com) and `ALERT_FROM`.
- `approve`: the "Approve & create payment links" button in a booking email opens `/#approve-<id>-<sig>`, which calls this function.
  It creates a Stripe Checkout link for the trip total and a manual-capture link for the deposit hold.
  Needs the secret `STRIPE_SECRET_KEY` (a restricted key with Checkout Sessions write access is enough).
