import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");

const formatNumber = (number = 0) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
  }).format(number);

const formatDate = (timeStamp) =>
  dayjs(timeStamp).format("dddd D MMM, YYYY h:mm A");

const formatCurrentDate = () => dayjs(Date.now()).format("YYYY-MM-DD");

const toCapitalize = (text) => `${text[0].toUpperCase()}${text.slice(1)}`;

export { formatNumber, formatDate, formatCurrentDate, toCapitalize };
