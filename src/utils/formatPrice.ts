export const formatPrice = (price: number) =>
  "$" + price.toLocaleString("en-US", { minimumFractionDigits: 2 });

export const formatPriceInCents = (price: number) => {
  return formatPrice(price / 100);
};
