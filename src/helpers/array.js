import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");

const isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);

const showProducts = (products = [], filter = "") =>
  products.filter(
    (product) =>
      product.name.includes(filter.toLowerCase()) ||
      product.category.includes(filter.toLowerCase())
  );

const countOrders = (orders = []) => {
  let complete = 0,
    preparing = 0;
  orders.forEach((order) => {
    order.complete ? complete++ : preparing++;
  });
  return {
    complete,
    preparing,
  };
};

const getCompleteOrders = (orders = []) =>
  orders.filter((order) => order.complete);

const getFilterOrdersByDate = (orders = [], since, until) =>
  orders.filter((order) => {
    const dateFormat = dayjs(order.create).format("YYYY-MM-DD");
    return dayjs(dateFormat).isBetween(since, until, null, "[]");
  });

const getFilterOrdersByNameClient = (nameClient = "", orders = []) =>
  orders.filter(
    (order) => order.nameClient.toLowerCase() === nameClient.toLowerCase()
  );

const calculateTotal = (orders = []) =>
  orders.reduce((acc, cur) => (cur.complete ? acc + cur.total : acc + 0), 0);

const calculateSubtotal = (orders = [], type = "month", date = Date.now()) => {
  const dateRef = dayjs(date).subtract(1, type).valueOf();
  let total = 0;
  orders.forEach((order) => {
    if (dayjs(order.create).isBetween(dateRef, date, null, "[]")) {
      total += order.total;
    }
  });
  return total;
};

const calculateTotalToday = (orders = []) => {
  let total = 0;
  orders.forEach((order) => {
    if (dayjs(order.create).isSame(Date.now(), "day")) {
      total += order.total;
    }
  });
  return total;
};

const calculateBestSeller = (sales = []) => {
  const joinSales = sales.reduce((acc, cur) => [...acc, cur.order], []);
  const flatten = joinSales.reduce((acc, cur) => acc.concat(cur), []);
  const aux = {};
  flatten.map((sale) => {
    if (aux.hasOwnProperty(sale.name)) {
      return (aux[sale.name] += sale.quantity);
    } else {
      return (aux[sale.name] = sale.quantity);
    }
  });
  const bestSeller = Object.keys(aux).sort((a, b) => aux[b] - aux[a])[0];
  return {
    sumary: aux,
    bestSeller: bestSeller,
    quantity: aux[bestSeller],
  };
};

export {
  showProducts,
  countOrders,
  calculateTotal,
  getCompleteOrders,
  calculateSubtotal,
  calculateTotalToday,
  getFilterOrdersByDate,
  getFilterOrdersByNameClient,
  calculateBestSeller,
};
