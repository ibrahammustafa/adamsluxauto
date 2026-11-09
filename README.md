# Adams Lux Auto

Private luxury car rental site, served by GitHub Pages at https://adamsluxauto.com.

- `assets/js/config.js`: phone, email, deposit, delivery fee, mileage, discounts, backend keys
- `assets/js/data.js`: fleet (prices, specs, photos), add-ons, delivery spots, policies, FAQ
- `assets/js/agreement.js`: rental agreement and liability waiver text (bump `agreementVersion` in config when it changes)
- `assets/img/`: car photos (plates blurred)

Bookings, signed agreements and inquiries are saved to Supabase (project `adamsluxauto`).
License photos and insurance cards go to the private `guest-docs` storage bucket.
View them in the Supabase dashboard under Table Editor and Storage.
