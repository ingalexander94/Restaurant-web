import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import Countdown from "react-countdown";
import { formatNumber } from "../../helpers/pipes";
import { showQuestion, showToast } from "../../alerts";
import FirebaseContext from "../../firebase/context";

const CardOrder = ({ order: request }) => {
  const { firebase } = useContext(FirebaseContext);
  const [timer, setTimer] = useState(1);
  const [updateTimer, setupdateTimer] = useState(false);

  const startTimer = async () => {
    try {
      await firebase.db.doc(`orders/${request.id}`).update({
        create: Date.now(),
        timer,
      });
      setupdateTimer(false);
    } catch (error) {
      console.log(error);
    }
  };

  const showCounter = ({ hours, minutes, seconds }) => {
    return (
      <h4
        className={`text-${
          minutes <= 5 ? "danger" : "white"
        } c-pointer no-seleccionable`}
        title="Doble click para actualizar"
        onDoubleClick={() => setupdateTimer(true)}
      >
        {`${hours}:${minutes}:${seconds}`} <i className="far fa-clock"></i>
      </h4>
    );
  };

  const finishOrder = async () => {
    const { isConfirmed } = await showQuestion(
      "¿ El pedido esta listo para entregar ?",
      "Se informará al cliente que pase por el pedido",
      "warning",
      "Informar al cliente"
    );
    if (isConfirmed) {
      try {
        await firebase.db.doc(`orders/${request.id}`).update({
          complete: true,
        });
        showToast(
          "success",
          "Cliente avisado, en un momento pasará por el pedido"
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <div className="card animate__animated animate__fadeIn text-dark">
        <div className="card-body">
          <h5 className="card-title text-center">{request.nameClient}</h5>
        </div>
        <ul className="list-group list-group-flush text-center">
          {request.order.map((product) => (
            <li
              key={product.id}
              className="list-group-item m-0 p-0"
              title={`Cada uno vale ${formatNumber(product.price)}`}
            >
              <span className="text-uppercase">
                ({product.quantity}) {product.name}
              </span>
              {product.notes !== "" && (
                <div className="alert alert-warning m-0 p-0" role="alert">
                  <strong>{product.notes}</strong>
                </div>
              )}
            </li>
          ))}
        </ul>

        {(request.timer === 0 || updateTimer) && (
          <div className="input-group mt-2 pl-4 pr-4 mx-auto" title="Minutos">
            <p>
              Ingrese los minutos totales que debe esperar el cliente para
              recibir su pedido.
            </p>
            <input
              type="number"
              className="form-control text-center"
              placeholder="Tiempo de entrega"
              name="timer"
              value={timer}
              onChange={(e) => setTimer(parseInt(e.target.value))}
            />
            <div className="input-group-append">
              <button
                className="btn btn-warning text-white"
                onClick={startTimer}
              >
                <i className="fas fa-sync"></i>
              </button>
            </div>
          </div>
        )}

        <div className="card-body text-center">
          <strong>Total: {formatNumber(request.total)}</strong>
        </div>
        {request.timer > 0 && (
          <div className="card-footer text-center bg-app">
            <Countdown
              date={request.create + request.timer * 60000}
              renderer={showCounter}
            />
            <button className="btn btn-block btn-light" onClick={finishOrder}>
              Marcar como terminado<i className="fas fa-bullhorn ml-2"></i>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

CardOrder.propTypes = {
  order: PropTypes.object.isRequired,
};

export default CardOrder;
