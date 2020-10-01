import React, { useContext, useEffect, useState } from "react";
import FirebaseContext from "../../firebase/context";
import CardOrder from "../ui/CardOrder";

export const Orders = () => {
  const { firebase } = useContext(FirebaseContext);
  const [orders, setOrders] = useState([]);

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

  return (
    <>
      <h1 className="text-center">Ordenes</h1>
      <hr className="bg-white" />
      {orders.length > 0 ? (
        <div className="card-columns">
          {orders.map((order) => (
            <CardOrder key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <p>No ha recibido pedidos hasta el momento.</p>
      )}
    </>
  );
};
