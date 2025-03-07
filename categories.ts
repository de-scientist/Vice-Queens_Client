export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: "404a77d9-cf98-40c7-bd28-15db835cef12",
    name: "Paper Products",
    icon: "FaToiletPaper",
    description: "Products like tissues, serviettes, and kitchen towels.",
  },
  {
    id: "33668296-66b9-4067-a4d3-c518bb6dcb7a",
    name: "Hygiene and Personal Care",
    icon: "FaShower",
    description:
      "Personal hygiene items such as diapers, sanitary towels, and soaps.",
  },
  {
    id: "644df393-3d8a-4214-8dc9-4bf22251667a",
    name: "Household and Cleaning",
    icon: "FaBroom",
    description: "Cleaning agents, fresheners, and household disinfectants.",
  },
  {
    id: "8b772321-8d7e-4834-b2ef-10092383e634",
    name: "Skincare and Haircare",
    icon: "FaPumpSoap",
    description:
      "Skin and hair care products like lotions, shampoos, and conditioners.",
  },
  {
    id: "36584657-ab20-4845-b7ea-39a2c121c285",
    name: "Stationery and Packaging",
    icon: "FaStickyNote",
    description: "Items such as ex-books, stickers, and various bags.",
  },
  {
    id: "ddc5a623-967b-45b3-a532-f68961ec62fa",
    name: "Building and Construction",
    icon: "FaHardHat",
    description: "Roofing materials and construction nails.",
  },
  {
    id: "0d0af60b-64d7-44ef-8ecc-a3ad3ce413d7",
    name: "Automotive and Industrial",
    icon: "FaCar",
    description: "Automotive cleaning products and industrial supplies.",
  },
  {
    id: "6696d387-2fa4-4e3c-b20b-cb74059ea358",
    name: "Branding and Marketing",
    icon: "FaBullhorn",
    description:
      "Marketing materials like flyers, banners, and business cards.",
  },
  {
    id: "2115f6dd-fdc2-4c95-9563-d6a2a74ad5ad",
    name: "Technology and Business Solutions",
    icon: "FaLaptopCode",
    description:
      "Tech services including website creation and mobile applications.",
  },
];

// const category_mapping = {
//   "Paper Products": [
//       "Tissues", "Serviettes", "Towels", "Wet Wipes", "Cling Film", "Paper Foil"
//   ],
//   "Hygiene and Personal Care": [
//       "Diapers", "Sanitary", "Pads", "Wipes", "Condom", "Soap", "Sanitizer", "Disinfectant"
//   ],
//   "Household and Cleaning": [
//       "Cleaners", "Freshener", "Bleaching", "Insecticide", "Fabric Softener"
//   ],
//   "Skincare and Haircare": [
//       "Lotion", "Sunscreen", "Oil", "Shampoo", "Conditioner", "Anti-Dandruff", "Gel", "Soap"
//   ],
//   "Stationery and Packaging": [
//       "Ex-Books", "Stickers", "Envelops", "Bags", "Gunias"
//   ],
//   "Building and Construction": [
//       "Mabati", "Nail"
//   ],
//   "Automotive and Industrial": [
//       "Car", "Paints", "Glue", "Filler", "Buffer", "Vinyl", "Deluxe", "Silicon", "Gloss"
//   ],
//   "Branding and Marketing": [
//       "Flyers", "Banners", "Business Cards", "Lightbox"
//   ],
//   "Technology and Business Solutions": [
//       "Website", "Mobile Application", "Plan", "System", "Installation"
//   ],
// }
