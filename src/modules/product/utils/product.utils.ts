interface Product {
  price: number;
  discount: number; // Скидка в процентах (например, 20 для 20%)
  [key: string]: any; // Другие возможные поля
}

const countProductDiscount = (products: Product[]): Product[] => {
  return products.map((product) => {
    const priceAfterDiscount =
      product.price - (product.price * product.discount) / 100;
    return { ...product, priceAfterDiscount };
  });
};
