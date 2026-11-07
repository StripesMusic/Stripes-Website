import data from "../../content/store.json";

// Draft: products for the hidden store page (pages/Store.tsx). checkout is the product's link at
// the checkout provider (Lemon Squeezy, Gumroad or a Stripe payment link); empty means not on sale yet.
export type Product = { title: string; type: string; price: string; image: string; details: string; includes: string[]; checkout: string };
export const products = data.items as Product[];
