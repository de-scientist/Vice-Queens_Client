export const queryKeys = {
  products: {
    all: ["products"],
    byCategory: (category: string) => ["products", "category", category],
    details: (id: string) => ["product", "details", id],
    delete: (id: string) => ["product", "delete", id],
  },
  cart: {
    all: ["cart"],
  },
  user: ["user"],
  categories: ["categories"],
};
