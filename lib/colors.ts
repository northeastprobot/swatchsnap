export type ColorCategory =
  | "Whites & Off-Whites"
  | "Grays"
  | "Blues"
  | "Greens"
  | "Reds & Oranges"
  | "Yellows & Neutrals"
  | "Browns & Taupes";

export interface BenjaminMooreColor {
  name: string;
  number: string;
  hex: string;
  category: ColorCategory;
}

export const bmColors: BenjaminMooreColor[] = [
  // ── Whites & Off-Whites ──────────────────────────────────────────
  { name: "Chantilly Lace",    number: "OC-65",    hex: "#F5F4EF", category: "Whites & Off-Whites" },
  { name: "White Dove",        number: "OC-17",    hex: "#F3F1E9", category: "Whites & Off-Whites" },
  { name: "Simply White",      number: "OC-17",    hex: "#F7F5ED", category: "Whites & Off-Whites" },
  { name: "Classic White",     number: "OC-12",    hex: "#F2EFE4", category: "Whites & Off-Whites" },
  { name: "Linen White",       number: "912",      hex: "#F4EFE1", category: "Whites & Off-Whites" },
  { name: "White Heron",       number: "OC-57",    hex: "#F0EDE3", category: "Whites & Off-Whites" },
  { name: "Decorator's White", number: "OC-149",   hex: "#F4F2EC", category: "Whites & Off-Whites" },
  { name: "Atrium White",      number: "OC-145",   hex: "#F1ECE1", category: "Whites & Off-Whites" },
  { name: "Super White",       number: "PM-1",     hex: "#F4F4F4", category: "Whites & Off-Whites" },
  { name: "Ivory White",       number: "925",      hex: "#F0EAD6", category: "Whites & Off-Whites" },
  { name: "Navajo White",      number: "958",      hex: "#F1E4C4", category: "Whites & Off-Whites" },
  { name: "Creamy White",      number: "OC-7",     hex: "#F0EBD8", category: "Whites & Off-Whites" },

  // ── Grays ────────────────────────────────────────────────────────
  { name: "Revere Pewter",     number: "HC-172",   hex: "#C2B9A7", category: "Grays" },
  { name: "Pale Oak",          number: "OC-20",    hex: "#DDD5C4", category: "Grays" },
  { name: "Edgecomb Gray",     number: "HC-173",   hex: "#CBB99B", category: "Grays" },
  { name: "Gray Owl",          number: "OC-52",    hex: "#CFD0CA", category: "Grays" },
  { name: "Stonington Gray",   number: "HC-170",   hex: "#C0C0BA", category: "Grays" },
  { name: "Coventry Gray",     number: "HC-169",   hex: "#9A9FA0", category: "Grays" },
  { name: "Kendall Charcoal",  number: "HC-166",   hex: "#737469", category: "Grays" },
  { name: "Wrought Iron",      number: "2124-10",  hex: "#474B4E", category: "Grays" },
  { name: "Sea Salt",          number: "OC-19",    hex: "#D6D2C4", category: "Grays" },
  { name: "Silver Mink",       number: "2111-40",  hex: "#B0A99E", category: "Grays" },
  { name: "Nimbus",            number: "2131-50",  hex: "#BCBDB5", category: "Grays" },
  { name: "Fossil",            number: "2108-40",  hex: "#9A9489", category: "Grays" },
  { name: "Seal Gray",         number: "2119-55",  hex: "#767973", category: "Grays" },

  // ── Blues ────────────────────────────────────────────────────────
  { name: "Hale Navy",         number: "HC-154",   hex: "#364958", category: "Blues" },
  { name: "Van Deusen Blue",   number: "HC-156",   hex: "#4A6274", category: "Blues" },
  { name: "Newburyport Blue",  number: "HC-155",   hex: "#3B5A74", category: "Blues" },
  { name: "Nantucket Gray",    number: "HC-111",   hex: "#8A9FAA", category: "Blues" },
  { name: "Old Navy",          number: "2063-10",  hex: "#213A53", category: "Blues" },
  { name: "Patriot Blue",      number: "2064-20",  hex: "#2E4A6B", category: "Blues" },
  { name: "Slate Blue",        number: "2062-40",  hex: "#5C7E9C", category: "Blues" },
  { name: "Buxton Blue",       number: "HC-149",   hex: "#547A8C", category: "Blues" },
  { name: "Iceberg",           number: "2057-60",  hex: "#A2BDD0", category: "Blues" },
  { name: "Harbor Gray",       number: "2136-50",  hex: "#9AABB7", category: "Blues" },
  { name: "Breath of Fresh Air", number: "806",    hex: "#C8DBE5", category: "Blues" },
  { name: "Beach Glass",       number: "1564",     hex: "#9BC8CC", category: "Blues" },

  // ── Greens ───────────────────────────────────────────────────────
  { name: "Sage",              number: "OC-50",    hex: "#AABA9E", category: "Greens" },
  { name: "Tarrytown Green",   number: "HC-134",   hex: "#5E7148", category: "Greens" },
  { name: "Tate Olive",        number: "HC-179",   hex: "#878556", category: "Greens" },
  { name: "Guilford Green",    number: "HC-116",   hex: "#778C6D", category: "Greens" },
  { name: "Millbrook",         number: "HC-133",   hex: "#6E7A52", category: "Greens" },
  { name: "October Mist",      number: "1495",     hex: "#B4C2AD", category: "Greens" },
  { name: "Huntington Green",  number: "HC-131",   hex: "#57674C", category: "Greens" },
  { name: "Forest Green",      number: "2047-10",  hex: "#3B5244", category: "Greens" },
  { name: "Jade Garden",       number: "2047-30",  hex: "#567761", category: "Greens" },
  { name: "Nile Green",        number: "2035-40",  hex: "#7F9E82", category: "Greens" },
  { name: "Fernwood",          number: "2144-40",  hex: "#9BA882", category: "Greens" },
  { name: "Georgian Green",    number: "HC-115",   hex: "#89A285", category: "Greens" },

  // ── Reds & Oranges ───────────────────────────────────────────────
  { name: "Red Parrot",        number: "2088-10",  hex: "#8B1A1A", category: "Reds & Oranges" },
  { name: "Dinner Party",      number: "2088-20",  hex: "#A02020", category: "Reds & Oranges" },
  { name: "Heritage Red",      number: "PM-18",    hex: "#943030", category: "Reds & Oranges" },
  { name: "Tomato Red",        number: "2086-20",  hex: "#C03428", category: "Reds & Oranges" },
  { name: "Brick Red",         number: "2089-30",  hex: "#A84038", category: "Reds & Oranges" },
  { name: "Cedar",             number: "2171-30",  hex: "#B05A38", category: "Reds & Oranges" },
  { name: "Terra Cotta",       number: "1202",     hex: "#C26A44", category: "Reds & Oranges" },
  { name: "Jack O Lantern",    number: "2156-20",  hex: "#E06A1A", category: "Reds & Oranges" },
  { name: "Coral",             number: "2170-40",  hex: "#E8836A", category: "Reds & Oranges" },
  { name: "Burgundy",          number: "2083-20",  hex: "#7A2040", category: "Reds & Oranges" },

  // ── Yellows & Neutrals ───────────────────────────────────────────
  { name: "Mustard Seed",      number: "2154-30",  hex: "#B89040", category: "Yellows & Neutrals" },
  { name: "Hawthorne Yellow",  number: "HC-4",     hex: "#D4AC4C", category: "Yellows & Neutrals" },
  { name: "Lemon Sorbet",      number: "2019-50",  hex: "#EDD06C", category: "Yellows & Neutrals" },
  { name: "Golden Straw",      number: "2152-50",  hex: "#D4B068", category: "Yellows & Neutrals" },
  { name: "Harvest Moon",      number: "163",      hex: "#C49A28", category: "Yellows & Neutrals" },
  { name: "Buttered Corn",     number: "2154-40",  hex: "#D4B858", category: "Yellows & Neutrals" },
  { name: "Gold Finch",        number: "297",      hex: "#DDB840", category: "Yellows & Neutrals" },
  { name: "Pineapple",         number: "165",      hex: "#C89230", category: "Yellows & Neutrals" },
  { name: "Pale Straw",        number: "2153-60",  hex: "#E2CEAC", category: "Yellows & Neutrals" },

  // ── Browns & Taupes ──────────────────────────────────────────────
  { name: "Chocolate Sundae",  number: "2107-20",  hex: "#5A3A28", category: "Browns & Taupes" },
  { name: "Barley",            number: "OC-90",    hex: "#C8B08C", category: "Browns & Taupes" },
  { name: "Grayish Beige",     number: "OC-38",    hex: "#C4B8A8", category: "Browns & Taupes" },
  { name: "Hampshire Taupe",   number: "HC-85",    hex: "#A89880", category: "Browns & Taupes" },
  { name: "Carrington Beige",  number: "HC-91",    hex: "#B8A484", category: "Browns & Taupes" },
  { name: "Dark Walnut",       number: "2100-20",  hex: "#6A4A30", category: "Browns & Taupes" },
  { name: "Rustic Taupe",      number: "HC-78",    hex: "#9E8870", category: "Browns & Taupes" },
  { name: "Desert Tan",        number: "2153-40",  hex: "#C8A870", category: "Browns & Taupes" },
  { name: "Caramelized",       number: "2160-20",  hex: "#A06030", category: "Browns & Taupes" },
  { name: "Sandy Brown",       number: "2162-40",  hex: "#C8A870", category: "Browns & Taupes" },
  { name: "Potting Soil",      number: "2107-30",  hex: "#7A5238", category: "Browns & Taupes" },
  { name: "Milk Chocolate",    number: "2100-30",  hex: "#8A5C3E", category: "Browns & Taupes" },
];

export const colorCategories: ColorCategory[] = [
  "Whites & Off-Whites",
  "Grays",
  "Blues",
  "Greens",
  "Reds & Oranges",
  "Yellows & Neutrals",
  "Browns & Taupes",
];

export function getColorsByCategory(category: ColorCategory): BenjaminMooreColor[] {
  return bmColors.filter((c) => c.category === category);
}

export function getColorByHex(hex: string): BenjaminMooreColor | undefined {
  return bmColors.find((c) => c.hex.toLowerCase() === hex.toLowerCase());
}

export function getColorByNumber(number: string): BenjaminMooreColor | undefined {
  return bmColors.find((c) => c.number === number);
}
