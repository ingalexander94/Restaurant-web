import React, { useContext, useEffect, useState } from "react";
import FirebaseContext from "../../firebase/context";
import { showProducts } from "../../helpers/array";
import Card from "../ui/Card";

export const Menu = () => {
  // Hooks
  const { firebase } = useContext(FirebaseContext);
  const [products, setProducts] = useState([]);
  const [productsFilter, setProductsFilter] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    let unsubscribe = () => {};
    const loadProducts = () => {
      unsubscribe = firebase.db
        .collection("products")
        .onSnapshot(handleOnSnapshot);
    };
    loadProducts();
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
    setProducts(res);
  }

  const handleFilterChange = ({ target }) => {
    setFilter(target.value);
    const data = showProducts(products, filter);
    setProductsFilter(data);
  };

  return (
    <>
      <h1 className="text-center">Menú</h1>
      <hr className="bg-white" />
      <div className="input-group mb-3 w-50 mx-auto">
        <div className="input-group-prepend">
          <span
            className="input-group-text bg-dark text-white"
            id="basic-addon1"
          >
            <i className="fas fa-search"></i>
          </span>
        </div>
        <input
          type="text"
          name="filter"
          value={filter}
          onChange={handleFilterChange}
          className="form-control bg-dark text-white"
          placeholder="Buscar"
          aria-label="filtro"
          aria-describedby="basic-addon1"
          autoComplete="off"
        />
        <div
          className="input-group-append"
          onClick={() => setFilter("")}
          style={{ cursor: "pointer" }}
        >
          <span className="input-group-text">
            <i className="fas fa-times"></i>
          </span>
        </div>
      </div>
      <div className="card-columns text-dark mt-4">
        {filter !== "" &&
          productsFilter.length > 0 &&
          productsFilter.map((product) => (
            <Card key={product.id} product={product} />
          ))}

        {filter === "" &&
          products.map((product) => (
            <Card key={product.id} product={product} />
          ))}
      </div>
    </>
  );
};
