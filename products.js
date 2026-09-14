/* DailyPrep product catalog
   Each product has a "chips" array describing the colored-cube visual
   (a stand-in for a photo — reinforces the "precut" idea on every card). */

const PRODUCTS = [
  // ---------- Everyday Cuts ----------
  { id: "e1", cat: "everyday", name: "Peeled Garlic", weight: "100 g", price: 49,
    chips: ["#F4EDD8","#F4EDD8","#EDE2C4","#F4EDD8","#E7D9AF","#F4EDD8","#EDE2C4","#F4EDD8","#E7D9AF"] },
  { id: "e2", cat: "everyday", name: "Peeled Onions", weight: "250 g", price: 39,
    chips: ["#B98BB0","#EFE7EF","#C79BC0","#B98BB0","#EFE7EF","#C79BC0","#B98BB0","#EFE7EF","#C79BC0"] },
  { id: "e3", cat: "everyday", name: "Chopped Onions", weight: "250 g", price: 35,
    chips: ["#C79BC0","#B98BB0","#D9B7D2","#C79BC0","#B98BB0","#D9B7D2","#C79BC0","#B98BB0","#D9B7D2"] },
  { id: "e4", cat: "everyday", name: "Diced Tomatoes", weight: "250 g", price: 39,
    chips: ["#D6491F","#E2622F","#C93F17","#D6491F","#E2622F","#C93F17","#D6491F","#E2622F","#C93F17"] },
  { id: "e5", cat: "everyday", name: "Peeled &amp; Diced Potatoes", weight: "500 g", price: 45,
    chips: ["#EFE3C0","#F4EDD8","#E6D6A6","#EFE3C0","#F4EDD8","#E6D6A6","#EFE3C0","#F4EDD8","#E6D6A6"] },
  { id: "e6", cat: "everyday", name: "Chopped Coriander", weight: "50 g", price: 19,
    chips: ["#2F6B3E","#3E8A50","#28522F","#2F6B3E","#3E8A50","#28522F","#2F6B3E","#3E8A50","#28522F"] },
  { id: "e7", cat: "everyday", name: "Ginger-Garlic Ready Mix", weight: "200 g", price: 59,
    chips: ["#E8A33D","#F4EDD8","#D98F2A","#E8A33D","#F4EDD8","#D98F2A","#E8A33D","#F4EDD8","#D98F2A"] },

  // ---------- Cooking Packs ----------
  { id: "c1", cat: "cooking", name: "Aloo Gobi Kit", weight: "500 g", price: 89,
    chips: ["#EFE3C0","#F2F2E9","#EFE3C0","#E9E2C5","#F2F2E9","#EFE3C0","#E9E2C5","#F2F2E9","#EFE3C0"] },
  { id: "c2", cat: "cooking", name: "Bhindi Cut", weight: "250 g", price: 49,
    chips: ["#4E8A44","#5C9B4F","#3E7238","#4E8A44","#5C9B4F","#3E7238","#4E8A44","#5C9B4F","#3E7238"] },
  { id: "c3", cat: "cooking", name: "Palak Paneer Kit", weight: "400 g", price: 99,
    chips: ["#2F6B3E","#F7F3E8","#3E8A50","#2F6B3E","#F7F3E8","#3E8A50","#2F6B3E","#F7F3E8","#3E8A50"] },
  { id: "c4", cat: "cooking", name: "Mix Veg Kit", weight: "500 g", price: 79,
    chips: ["#D6491F","#E8A33D","#4E8A44","#2F6B3E","#D6491F","#E8A33D","#4E8A44","#2F6B3E","#E8A33D"] },
  { id: "c5", cat: "cooking", name: "Chinese Stir Fry Kit", weight: "400 g", price: 89,
    chips: ["#B98BB0","#4E8A44","#E8A33D","#D6491F","#B98BB0","#4E8A44","#E8A33D","#D6491F","#4E8A44"] },
  { id: "c6", cat: "cooking", name: "Sambhar Vegetables", weight: "500 g", price: 69,
    chips: ["#E8A33D","#4E8A44","#D6491F","#EFE3C0","#E8A33D","#4E8A44","#D6491F","#EFE3C0","#E8A33D"] },
  { id: "c7", cat: "cooking", name: "Punjabi Sabzi Mix", weight: "500 g", price: 79,
    chips: ["#4E8A44","#D6491F","#B98BB0","#E8A33D","#4E8A44","#D6491F","#B98BB0","#E8A33D","#4E8A44"] },

  // ---------- Premium Convenience ----------
  { id: "p1", cat: "premium", name: "Salad Kit", weight: "300 g", price: 69,
    chips: ["#4E8A44","#D6491F","#5C9B4F","#F2F2E9","#4E8A44","#D6491F","#5C9B4F","#F2F2E9","#4E8A44"] },
  { id: "p2", cat: "premium", name: "Soup Vegetables", weight: "400 g", price: 65,
    chips: ["#D6491F","#4E8A44","#E8A33D","#EFE3C0","#D6491F","#4E8A44","#E8A33D","#EFE3C0","#D6491F"] },
  { id: "p3", cat: "premium", name: "Stir-fry Kit", weight: "400 g", price: 85,
    chips: ["#E8A33D","#B98BB0","#4E8A44","#D6491F","#E8A33D","#B98BB0","#4E8A44","#D6491F","#E8A33D"] },
];

const CATEGORY_META = {
  everyday: { label: "Everyday Cuts", caption: "Same fresh vegetables. Less work." },
  cooking:  { label: "Cooking Packs", caption: "All set for your favourite dishes." },
  premium:  { label: "Premium Convenience", caption: "Healthier meals. Happier you." },
};
