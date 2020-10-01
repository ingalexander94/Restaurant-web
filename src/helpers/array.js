const showProducts = (products = [], filter = "") => {
  if (filter === "") return products;
  const data = products.filter((product) => product.name.includes(filter));
  return data.length > 0 ? data : [];
};

export { showProducts };
