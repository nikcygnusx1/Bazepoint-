export interface EmailDraft {
  subject: string;
  body: string;
}

export interface Manufacturer {
  id: string;
  rank: string;          // "01", "02", "03"
  name: string;
  flag: string;          // emoji
  city: string;
  country: string;
  category: string;
  moq: string;           // "500 units"
  pricePerUnit: string;  // "$1.40–1.80"
  leadTime: string;      // "18–22 days"
  verified: boolean;
  verifiedLabel: string; // "Verified" | "Pending"
  emailDraft: EmailDraft;
}

export const MANUFACTURERS: Manufacturer[] = [
  {
    id: "alghazal",
    rank: "01",
    name: "AlGhazal Packaging LLC",
    flag: "🇦🇪",
    city: "Dubai",
    country: "UAE",
    category: "Cosmetics Packaging",
    moq: "500 units",
    pricePerUnit: "$1.40–1.80",
    leadTime: "18–22 days",
    verified: true,
    verifiedLabel: "Verified",
    emailDraft: {
      subject: "Skincare packaging inquiry — 500-unit pilot order",
      body: `Hi AlGhazal team,

I'm the founder of a skincare brand launching in the UAE and GCC region.
I'm looking for a cosmetics packaging supplier for a pilot run of 500 units — primarily glass dropper bottles and aluminium caps in the 30ml and 50ml range.

I've reviewed your profile on Bazepoint and your verified export record was reassuring. Could you confirm:

1. Availability for a 500-unit MOQ in Q3
2. Your price range per unit at that quantity
3. Lead time and whether you provide sample sets

Looking forward to discussing further.

[Founder Name]`
    }
  },
  {
    id: "ozpack",
    rank: "02",
    name: "OzPack Industries",
    flag: "🇦🇺",
    city: "Melbourne",
    country: "Australia",
    category: "Sustainable Packaging",
    moq: "300 units",
    pricePerUnit: "$1.90–2.40",
    leadTime: "22–28 days",
    verified: true,
    verifiedLabel: "Verified",
    emailDraft: {
      subject: "Sustainable cosmetics packaging — pilot inquiry",
      body: `Hi OzPack team,

I'm developing a clean beauty brand with a strong sustainability mandate.
I'm sourcing packaging for a 300-unit pilot order — specifically looking at your PCR (post-consumer recycled) PET bottle range and bamboo-capped options.

Your Bazepoint profile shows you've worked with indie brands at sub-1000 MOQ, which aligns well with our current stage.

Could you send a sample catalogue and your price sheet for 300–1,000 units? We'd also like to understand your lead times if we target a Q3 production run.

Looking forward to hearing from you.

[Founder Name]`
    }
  },
  {
    id: "merpack",
    rank: "03",
    name: "MerPack Anatolia",
    flag: "🇹🇷",
    city: "Istanbul",
    country: "Turkey",
    category: "Glass & Aluminium Packaging",
    moq: "1,000 units",
    pricePerUnit: "$0.90–1.20",
    leadTime: "14–18 days",
    verified: false,
    verifiedLabel: "Pending",
    emailDraft: {
      subject: "Glass packaging inquiry — 1,000-unit order",
      body: `Hi MerPack team,

I'm sourcing glass dropper bottles and aluminium caps for a cosmetics brand.
I saw your profile on Bazepoint and your pricing and lead times are competitive.

I'd like to understand your minimum order quantities, unit pricing at 1,000 and 2,000 units, and your standard quality inspection process.

Can you confirm whether you export to the UAE and GCC region, and whether you've worked with independent cosmetics brands before?

Looking forward to hearing from you.

[Founder Name]`
    }
  }
];

export const HERO_SCENARIO = {
  brief: "Skincare glass packaging · UAE · 500 MOQ · <$2/unit",
  briefTags: [
    { label: "Category", value: "Skincare Packaging" },
    { label: "Region", value: "UAE / GCC" },
    { label: "MOQ", value: "500 units" },
    { label: "Budget", value: "< $2 / unit" }
  ],
  manufacturers: MANUFACTURERS,
  autoSelectManufacturerId: "alghazal"
};
