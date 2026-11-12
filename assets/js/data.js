/* Adams Lux Auto — fleet, add-ons, delivery spots and policies. */
(function () {
  const img = (f, pos) => ({ src: "assets/img/" + f + ".webp", pos: pos || "50% 50%" });

  window.ALA_FLEET = [
    {
      id: "glb35", year: 2025, make: "Mercedes-AMG", model: "GLB 35 4MATIC", short: "GLB 35",
      tag: "AMG SUV", price: 220, drive: "AWD", type: "SUV", fuel: "gas", minAge: 21,
      tagline: "AMG power in a roomy SUV. Light-up AMG sills and Affalterbach puddle lamps.",
      specs: [["Engine", "2.0L turbo I4"], ["Drive", "AWD (4MATIC)"], ["Gearbox", "8-speed auto"], ["Body", "Compact SUV"]],
      highlights: ["AMG Performance wheel with drive-mode dials", "Illuminated AMG door sills and projector lamps", "Space for luggage and the crew"],
      hero: img("glb-26", "45% 62%"),
      gallery: [img("glb-26", "45% 62%"), img("glb-37", "60% 62%"), img("glb-31", "45% 40%"), img("glb-27", "50% 55%"), img("glb-38", "50% 50%"), img("glb-36", "50% 50%"), img("glb-23", "50% 50%"), img("glb-24", "50% 50%"), img("glb-28", "50% 50%"), img("glb-20", "50% 50%"), img("fob-41", "50% 50%")]
    },
    {
      id: "c43", year: 2026, make: "Mercedes-AMG", model: "C 43 AMG 4MATIC", short: "C43",
      tag: "Newest in the fleet", price: 400, drive: "AWD", type: "Sedan", fuel: "gas", minAge: 25,
      tagline: "F1-derived electric turbo, 4MATIC grip and a cabin that glows.",
      specs: [["Engine", "2.0L turbo I4, electric turbocharger"], ["Drive", "AWD (4MATIC)"], ["Gearbox", "9-speed MCT"], ["Seats", "5"]],
      highlights: ["Electric exhaust-gas turbo for instant response", "64-color ambient lighting", "AMG sport seats with red belts"],
      hero: img("c43-9", "40% 60%"),
      gallery: [img("c43-9", "40% 60%"), img("c43-12", "50% 50%"), img("c43-7", "50% 50%"), img("c43-10", "50% 50%"), img("c43-11", "50% 50%")]
    },
    {
      id: "polestar2", year: 2024, make: "Polestar", model: "2 Performance", short: "Polestar 2",
      tag: "Electric · Performance pack", price: 250, drive: "AWD", type: "Sedan", fuel: "ev", minAge: 21,
      tagline: "Dual-motor EV with Swedish gold brakes and Google built in.",
      specs: [["Power", "Dual-motor electric"], ["Drive", "AWD"], ["Package", "Performance"], ["Seats", "5"]],
      highlights: ["Gold Brembo calipers and Performance tuning", "Google Maps and Assistant built in", "Silent, instant AWD acceleration"],
      hero: img("ps-18", "50% 70%"),
      gallery: [img("ps-18", "50% 70%"), img("ps-19", "45% 55%"), img("ps-17", "40% 62%"), img("ps-15", "50% 55%"), img("ps-13", "50% 50%"), img("ps-14", "50% 50%")]
    },
    {
      id: "eqb300", year: 2024, make: "Mercedes-Benz", model: "EQB 300 4MATIC", short: "EQB 300",
      tag: "Electric SUV", price: 220, drive: "AWD", type: "SUV", fuel: "ev", minAge: 21,
      tagline: "All-electric Mercedes SUV with the full-width light bar and AMG Line styling.",
      specs: [["Power", "Dual-motor electric"], ["Drive", "AWD (4MATIC)"], ["Body", "Compact SUV"], ["Charging", "DC fast charge"]],
      highlights: ["Full-width front and rear light bars", "Quiet, smooth EV cruising", "Ambient lighting and AMG Line interior"],
      hero: img("eqb-22", "50% 65%"),
      gallery: [img("eqb-22", "50% 65%"), img("eqb-3", "50% 50%"), img("eqb-5", "50% 50%"), img("eqb-33", "50% 50%"), img("eqb-6", "50% 60%"), img("eqb-2", "50% 50%"), img("eqb-32", "50% 50%"), img("eqb-42", "50% 50%")]
    },
    {
      id: "e55", year: 2005, make: "Mercedes-Benz", model: "E55 AMG", short: "E55",
      tag: "Built & tuned", price: 500, drive: "RWD", type: "Sedan", fuel: "gas", minAge: 25,
      tagline: "Supercharged V8 legend. Built motor, full bolt-ons, proper tune.",
      specs: [["Engine", "5.4L supercharged V8"], ["Drive", "Rear-wheel"], ["Gearbox", "5-speed auto"], ["Seats", "5"]],
      mods: ["Built motor", "Full bolt-ons", "Custom tune", "Long-tube headers", "X-pipe", "C63 mufflers"],
      highlights: ["The sound alone sells it: X-pipe and C63 mufflers", "Driver-focused AMG interior", "Collector-grade W211 kept clean"],
      hero: img("e55-39", "50% 62%"),
      gallery: [img("e55-39", "50% 62%"), img("e55-25", "40% 60%"), img("e55-1", "50% 55%"), img("e55-21", "60% 55%"), img("e55-29", "50% 50%"), img("e55-35", "50% 45%"), img("duo-30", "50% 58%")]
    },
    {
      id: "330e", year: 2022, make: "BMW", model: "330e xDrive", short: "330e",
      tag: "Plug-in hybrid", price: 175, drive: "AWD", type: "Sedan", fuel: "phev", minAge: 21,
      tagline: "Sport sedan with electric-only commuting and xDrive all-wheel drive.",
      specs: [["Powertrain", "2.0L turbo + electric motor"], ["Drive", "AWD (xDrive)"], ["Gearbox", "8-speed auto"], ["Seats", "5"]],
      highlights: ["Electric mode for quiet city driving", "XtraBoost overboost on demand", "Best value in the fleet"],
      hero: img("bmw-1", "45% 60%"),
      gallery: [img("bmw-1", "45% 60%"), img("bmw-2", "50% 55%"), img("bmw-3", "50% 45%"), img("bmw-4", "50% 50%"), img("bmw-5", "50% 50%"), img("bmw-6", "50% 50%")]
    }
  ];

  // perDay: charged per rental day. flat: once per trip. byFuel: price depends on the car's fuel type.
  window.ALA_ADDONS = [
    { id: "refuel", name: "Prepaid refuel / recharge", desc: "Return at any fuel or charge level. We top it off.", type: "flat",
      byFuel: { gas: 85, ev: 45, phev: 60 }, carPrice: { e55: 110 } },
    { id: "tolls", name: "Prepaid tolls", desc: "Unlimited Bay Area bridge and express-lane tolls. No FasTrak invoices after your trip.", type: "perDay", price: 12 },
    { id: "unlimited", name: "Unlimited miles", desc: "Drop the daily mileage cap. Great for road trips.", type: "perDay", price: 60, exclude: ["e55"] },
    { id: "miles100", name: "+100 mile pack", desc: "Extra miles at a lower rate than overage.", type: "flat", price: 50 },
    { id: "driver", name: "Additional driver", desc: "Add a second verified driver to the agreement.", type: "perDay", price: 15 },
    { id: "clean", name: "Prepaid cleaning", desc: "Skip the wash. Return it beach-sandy and we'll handle it (smoking still prohibited).", type: "flat", price: 50 },
    { id: "flex", name: "Flex handoff window", desc: "Pick up 2 hours early or return 2 hours late at no penalty.", type: "flat", price: 45 },
    { id: "childseat", name: "Child seat", desc: "Forward-facing or booster, installed before handoff.", type: "perDay", price: 15 },
    { id: "shoot", name: "Photo & video shoot", desc: "Permission to use the car in content shoots and social posts. Parked and road shots only.", type: "flat", price: 75 }
  ];

  window.ALA_SPOTS = [
    { id: "sfo", name: "SFO", area: "San Francisco International Airport", group: "Airports" },
    { id: "sjc", name: "SJC", area: "San José Mineta International Airport", group: "Airports" },
    { id: "oak", name: "OAK", area: "Oakland International Airport", group: "Airports" },
    { id: "pa-caltrain", name: "Palo Alto Caltrain", area: "University Ave station", group: "Transit" },
    { id: "mv-caltrain", name: "Mountain View Caltrain", area: "Castro St station", group: "Transit" },
    { id: "diridon", name: "San José Diridon", area: "Caltrain · ACE · Amtrak", group: "Transit" },
    { id: "jls", name: "Jack London Square", area: "Oakland waterfront", group: "City" },
    { id: "union-sq", name: "Union Square", area: "Downtown San Francisco", group: "City" },
    { id: "chase", name: "Chase Center", area: "Mission Bay, San Francisco", group: "City" },
    { id: "santana", name: "Santana Row", area: "San José", group: "City" },
    { id: "stanford", name: "Stanford Shopping Center", area: "Palo Alto", group: "City" },
    { id: "emeryville", name: "Emeryville", area: "Bay Street", group: "City" },
    { id: "levis", name: "Levi's Stadium", area: "Santa Clara", group: "Events" },
    { id: "los-gatos", name: "Downtown Los Gatos", area: "N. Santa Cruz Ave", group: "Getaways" },
    { id: "boardwalk", name: "Santa Cruz Boardwalk", area: "Beach Street", group: "Getaways" }
  ];

  window.ALA_POLICIES = [
    { h: "Who can book", items: [
      "Drivers 21+ with a valid license held at least 2 years. The C43 and E55 require 25+.",
      "Photos of your license (front and back) and proof of full-coverage auto insurance that extends to rental or borrowed vehicles.",
      "Every driver signs the rental agreement before the keys are handed over." ] },
    { h: "Deposit & payment", items: [
      "A $1,000 refundable security deposit is held for every trip.",
      "It's released within 3 business days after the post-trip inspection, minus any tolls, fuel, mileage overage, tickets or damage.",
      "We confirm availability first, then send a secure payment link. Nothing is charged when you submit a request." ] },
    { h: "Mileage, fuel & tolls", items: [
      "200 miles per day included. Extra miles are $0.75 each, or add a mile pack or unlimited miles.",
      "Return with the same fuel or charge level, or add prepaid refuel / recharge.",
      "Bridge and express-lane tolls are billed after the trip at cost plus a $5 processing fee, unless you add prepaid tolls." ] },
    { h: "Care of the car", items: [
      "No smoking or vaping ($250 cleaning fee). No pets without approval.",
      "No racing, track days, drifting, off-roading, towing, rideshare or delivery work.",
      "Parking tickets, camera tickets and impound fees during your trip are your responsibility plus a $25 admin fee." ] },
    { h: "Changes & cancellations", items: [
      "Free cancellation up to 72 hours before pickup.",
      "Within 72 hours, the first day is non-refundable.",
      "Late returns are billed at $50 per hour after a 30-minute grace period, up to one full day's rate." ] },
    { h: "Handoff", items: [
      "Host pickup in the South Bay is free. Delivery is a flat $120 to any spot below or any Bay Area address, and covers return pickup.",
      "We walk the car with you and take timestamped photos at pickup and return. You're welcome to take your own.",
      "Cars may have GPS / telematics for theft recovery and mileage. See the rental agreement." ] }
  ];

  // Mirrors the host toolkit's Pre/Post-Trip Vehicle Inspection sheet.
  window.ALA_INSPECT = {
    photos: [
      ["front", "Front"], ["rear", "Rear"], ["driver", "Driver side"], ["passenger", "Passenger side"],
      ["interior", "Interior & seats"], ["dash", "Dashboard: odometer, fuel/charge, no warning lights"]
    ],
    checklist: [
      ["exterior", "Exterior photos taken: front, rear, both sides"],
      ["tires", "Wheels and tires: no flats, curb rash noted"],
      ["glass", "Windshield and windows: chips or cracks noted"],
      ["lights", "Lights and signals working"],
      ["interior", "Interior clean, no odors, no smoke"],
      ["seats", "Seats and floor mats: stains or tears noted"],
      ["trunk", "Trunk / cargo area empty and clean"],
      ["keys", "Key and charging cable present"],
      ["warnings", "No dashboard warning lights on"],
      ["toll", "Toll tag present and mounted"]
    ],
    returnOnly: [
      ["fuelback", "Fuel / charge returned at the starting level (or refuel prepaid)"],
      ["items", "Personal items removed from the car"]
    ],
    marks: { S: "Scratch", D: "Dent", C: "Chip / crack", X: "Other" }
  };

  window.ALA_PRECAUTIONS = [
    { h: "Before pickup", items: [
      "Bring the physical license you uploaded. The name must match your booking.",
      "Have your insurance card on your phone. We check it at handoff.",
      "Arrive on time. Handoffs more than 30 minutes late may be rescheduled." ] },
    { h: "At check-in", items: [
      "We walk the car together and you complete the online check-in: six photos, odometer, fuel or charge level, and any existing marks on the damage map.",
      "Anything not recorded at check-in is treated as new at return, so take your time.",
      "Point out any warning light or issue before you drive off." ] },
    { h: "During your trip", items: [
      "Only drivers on the agreement may drive. No racing, track, off-road, rideshare or delivery work.",
      "No smoking, vaping or pets. Keep food and drinks covered.",
      "Lock the car and never leave the key inside. Park in lit, legal spots.",
      "Accident, damage, theft or a warning light: stop safely, take photos, and contact us right away using the number given at handoff." ] },
    { h: "At return", items: [
      "Return at the same fuel or charge level unless you prepaid.",
      "Remove personal items and trash. Sand, pet hair or smoke means a cleaning fee.",
      "Complete the return check-in with the same six photos and the final odometer. Your deposit is released after the review, within 3 business days." ] }
  ];

  window.ALA_FAQ = [
    ["Is my insurance enough?", "Most full-coverage personal policies extend to cars you rent or borrow, but check with your insurer. Upload your insurance card when you book and we'll confirm before your trip."],
    ["Do you take Turo or rental-company insurance?", "Bookings here are private rentals and aren't covered by Turo or rental-counter protection plans. Your own policy is primary."],
    ["Can I take the car out of state?", "Trips within California are fine. Ask us before booking any trip out of state."],
    ["How do EV charging and the Polestar / EQB work?", "Both arrive charged and come with a charging cable. Public DC fast chargers work with both. Return at the same level or add prepaid recharge."],
    ["How fast will you reply?", "Usually within a couple of hours during the day. For same-day requests, say so in your message."],
    ["Can I see the car before I book?", "Yes. Send an inquiry and we'll set up a quick look or a video walkaround."]
  ];
})();
