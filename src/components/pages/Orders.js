import React, { useCallback, useContext, useEffect, useState } from "react";
import FirebaseContext from "../../firebase/context";
import CardOrder from "../ui/CardOrder";

export const Orders = () => {
  const { firebase } = useContext(FirebaseContext);
  const [orders, setOrders] = useState([]);
  const [boxToggle, setBoxToggle] = useState(false);

  const loadConfig = useCallback(async () => {
    const res = await firebase.db.collection("config").get();
    const config = res.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    setBoxToggle(config[0].isOpen);
  }, [firebase.db]);

  useEffect(() => {
    async function subscribe() {
      await loadConfig();
    }
    subscribe();
  }, [loadConfig]);

  useEffect(() => {
    let unsubscribe = () => {};
    const loadOrders = () => {
      unsubscribe = firebase.db
        .collection("orders")
        .where("complete", "==", false)
        .onSnapshot(handleOnSnapshot);
    };
    loadOrders();
    return () => {
      unsubscribe();
    };
  }, [firebase.db]);

  function handleOnSnapshot(snapshot) {
    const res = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    setOrders(res);
  }

  const handleBoxToggle = async ({ target: { checked } }) => {
    setBoxToggle(checked);
    try {
      await firebase.db.doc(`config/gUe4MldTYLwA3QwrDKcT`).update({
        isOpen: checked,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="custom-control custom-switch text-center">
        <input
          type="checkbox"
          className="custom-control-input"
          id="customSwitch1"
          checked={boxToggle}
          onChange={handleBoxToggle}
        />
        <label
          className="custom-control-label c-pointer"
          htmlFor="customSwitch1"
        >
          {boxToggle ? (
            <strong title="Los clientes pueden realizar pedidos.">
              Food esta abierto a los clientes.
            </strong>
          ) : (
            <strong title="Los clientes no pueden realizar pedidos.">
              Food esta cerrado a los clientes.
            </strong>
          )}
        </label>
      </div>
      <br />
      {orders.length > 0 ? (
        <div className="card-columns">
          {orders.map((order) => (
            <CardOrder key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <p>No se han recibido pedidos hasta el momento.</p>
      )}
    </>
  );
};
