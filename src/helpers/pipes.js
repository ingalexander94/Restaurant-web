const formatNumber = (number = 0) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
  }).format(number);

export { formatNumber };
