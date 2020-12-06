import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../auth/authContext";
import FirebaseContext from "../../firebase/context";
import {
  calculateTotal,
  calculateSubtotal,
  countOrders,
  getCompleteOrders,
  calculateTotalToday,
  getFilterOrdersByDate,
  calculateBestSeller,
  getFilterOrdersByNameClient,
} from "../../helpers/array";
import { formatCurrentDate, formatNumber } from "../../helpers/pipes";
import TableItem from "../ui/TableItem";
import { useForm } from "../../hooks/useForm";
import { showAlertInput, showToast } from "../../alerts";

export const MySales = () => {
  const history = useHistory();
  const ChefAuth = useContext(AuthContext);
  const { firebase } = useContext(FirebaseContext);
  const [mySales, setMySales] = useState([]);
  const [statistics, setStatistics] = useState({ complete: 0, preparing: 0 });
  const [totalMonth, setTotalMonth] = useState(0);
  const [totalWeek, setTotalWeek] = useState(0);
  const [totalToday, setTotalToday] = useState(0);
  const [total, setTotal] = useState(0);
  const [bestSeller, setBestSeller] = useState({});
  const myAllSales = useRef([]);
  const [showRanking, setShowRanking] = useState({
    text: "Mostrar Ranking",
    hidden: true,
  });

  useEffect(() => {
    if (ChefAuth.role !== "administrador") {
      history.push("/usuario/cocinero/ordenes");
    }
  }, [ChefAuth.role, history]);

  const loadSales = useCallback(async () => {
    const res = await firebase.db.collection("orders").get();
    const sales = res.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    setBestSeller(calculateBestSeller(sales));
    const completeOrders = getCompleteOrders(sales);
    myAllSales.current = completeOrders;
    setMySales(completeOrders);
    setStatistics(countOrders(sales));
    setTotalMonth(calculateSubtotal(completeOrders, "month"));
    setTotalWeek(calculateSubtotal(completeOrders, "week"));
    setTotalToday(calculateTotalToday(completeOrders));
    setTotal(calculateTotal(sales));
  }, [firebase.db]);

  useEffect(() => {
    async function subscribe() {
      await loadSales();
    }
    subscribe();
  }, [loadSales]);

  useEffect(() => {
    setBestSeller(calculateBestSeller(mySales));
  }, [mySales]);

  const [values, handleInputChange] = useForm({
    since: formatCurrentDate(),
    until: formatCurrentDate(),
  });

  const { since, until } = values;

  const filterOrders = () =>
    setMySales(getFilterOrdersByDate(myAllSales.current, since, until));

  const toggleRanking = () => {
    if (showRanking.hidden) {
      setShowRanking({
        text: "Ocultar Ranking",
        hidden: false,
      });
    } else {
      setShowRanking({
        text: "Mostrar Ranking",
        hidden: true,
      });
    }
  };

  const filterByNameClient = async () => {
    try {
      const { value } = await showAlertInput(
        "Filtrar ventas",
        "Ingrese el nombre del cliente",
        "text"
      );
      if (value) {
        const [nameClient] = value;
        const data = getFilterOrdersByNameClient(nameClient, mySales);
        data.length > 0
          ? setMySales(data)
          : showToast("warning", `No se registran compras de ${nameClient}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-8">
          <div className="row">
            <div className="col-6">
              <h5 className="text-gray text-left">Mis ventas</h5>
            </div>
            <div className="col-6">
              <h5 title="Total de ventas" className="text-right text-warning">
                {formatNumber(total)}
              </h5>
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-5 form-group text-center">
              <label htmlFor="since">
                <strong>Desde</strong>
              </label>
              <input
                type="date"
                name="since"
                value={since}
                max={until}
                onChange={handleInputChange}
                className="form-control bg-input"
                id="since"
              />
            </div>
            <div className="col-5 form-group text-center">
              <label htmlFor="until">
                <strong>Hasta</strong>
              </label>
              <input
                type="date"
                name="until"
                value={until}
                min={since}
                max={formatCurrentDate()}
                onChange={handleInputChange}
                className="form-control bg-input"
                id="until"
              />
            </div>
            <div className="col-2 text-center mt-4 p-0">
              <div className="dropdown dropleft">
                <button
                  title="Filtrar Ventas"
                  className="btn btn-light mt-2"
                  id="dropdownMenuLink"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="fas fa-ellipsis-v"></i>
                </button>
                <div
                  className="dropdown-menu text-center"
                  aria-labelledby="dropdownMenuLink"
                >
                  <div
                    onClick={filterOrders}
                    className="c-pointer dropdown-item"
                  >
                    Filtrar
                  </div>
                  <div
                    onClick={() => setMySales(myAllSales.current)}
                    className="c-pointer dropdown-item"
                  >
                    Borrar Filtro
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="alert alert-warning alert-dismissible fade show"
            role="alert"
          >
            Se realizarón <strong>{mySales.length}</strong> ventas en total
            obteniendo{" "}
            <strong>{formatNumber(calculateTotal(mySales))} COP</strong> de
            ganancias. El producto más vendido es{" "}
            <strong>{bestSeller.bestSeller?.toUpperCase()}</strong> con{" "}
            {bestSeller.quantity} platillos vendidos.{" "}
            <span onClick={toggleRanking} className="alert-link c-pointer">
              {showRanking.text}
            </span>
            {!showRanking.hidden && (
              <pre> {JSON.stringify(bestSeller.sumary, null, 2)}</pre>
            )}
            <button
              type="button"
              className="close"
              data-dismiss="alert"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          {showRanking.hidden && (
            <div
              className="table-responsive"
              style={{ height: 330, overflowY: "scroll" }}
            >
              <table className="table table-hover text-center bg-white">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th
                      className="c-pointer"
                      title="Buscar cliente"
                      scope="col"
                      onClick={filterByNameClient}
                    >
                      Cliente <i className="fas fa-search-dollar fa-sm"></i>
                    </th>
                    <th title="Platillos comprados" scope="col">
                      Productos
                    </th>
                    <th title="Fecha de la compra" scope="col">
                      Fecha
                    </th>
                    <th title="Minutos de preparación" scope="col">
                      <i className="fas fa-hourglass-end"></i>
                    </th>
                    <th title="Total pagado" scope="col">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mySales.length > 0 ? (
                    mySales.map((sale, i) => (
                      <TableItem key={sale.id} sale={sale} index={i} />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">No se reportan ventas</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="col-lg-4">
          <h5 className="text-gray text-center">Estadisticas</h5>
          <div className="card mb-3 w-50 mx-auto mt-4">
            <div className="row no-gutters text-center">
              <div className="col-6 border-right p-2">
                <div className="card-body p-0 m-0">
                  <i className="fas fa-check fa-3x text-success"></i>
                  <p>
                    <strong>{statistics.complete}</strong>
                    <br />
                    <small style={{ fontSize: 12 }}>Entregadas</small>
                  </p>
                </div>
              </div>
              <div className="col-6 p-2">
                <div className="card-body p-0 m-0">
                  <i className="far fa-clock fa-3x text-warning"></i>
                  <p>
                    <strong>{statistics.preparing}</strong>
                    <br />
                    <small style={{ fontSize: 12 }}>Preparando</small>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <h5 className="text-gray text-center">Ganancias</h5>
          <div className="card mb-3 mt-4 border border-warning">
            <div className="row no-gutters">
              <div className="col-4 text-center p-0 m-0">
                <i className="far fa-calendar-alt fa-3x mt-2 text-warning"></i>
              </div>
              <div className="col-8 p-0 m-0">
                <div className="card-body p-0">
                  <p className="muted">
                    Un mes atrás:
                    <br />{" "}
                    <span className="h4">{formatNumber(totalMonth)} COP</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card mb-3 mt-4 border border-warning">
            <div className="row no-gutters">
              <div className="col-4 text-center p-0 m-0">
                <i className="fas fa-calendar-week fa-3x mt-2 text-warning"></i>
              </div>
              <div className="col-8 p-0 m-0">
                <div className="card-body p-0">
                  <p className="muted">
                    Una semana atrás:
                    <br />{" "}
                    <span className="h4">{formatNumber(totalWeek)} COP</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card mb-3 bg-warning text-white mt-4">
            <div className="row no-gutters">
              <div className="col-4 text-center p-0 m-0">
                <i className="fas fa-calendar-day fa-3x mt-2"></i>
              </div>
              <div className="col-8 p-0 m-0">
                <div className="card-body p-0">
                  <p className="muted">
                    Hoy:
                    <br />{" "}
                    <span className="h4">{formatNumber(totalToday)} COP</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
