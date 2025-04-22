const formatPrice = (price: number) => {
  return price.toLocaleString("en-US", { minimumFractionDigits: 2 });
};

export default formatPrice;
