import React, { useContext, useEffect, useRef, useState } from "react";
import FirebaseContext from "../../firebase/context";
import { showProducts } from "../../helpers/array";
import Card from "../ui/Card";

export const Menu = () => {
  // Hooks
  const { firebase } = useContext(FirebaseContext);
  const ref = useRef([]);
  const [products, setProducts] = useState([]);
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
    ref.current = res;
    setProducts(res);
  }

  const handleFilterChange = ({ target }) => {
    setFilter(target.value);
    if (filter.length > 1) {
      const data = showProducts(ref.current, filter);
      setProducts(data);
    } else {
      setProducts(ref.current);
    }
  };

  const filterByCategory = (categoria = "todos") => {
    if (categoria !== "todos") {
      const data = showProducts(ref.current, categoria);
      setProducts(data);
    } else {
      setProducts(ref.current);
    }
  };

  return (
    <>
      <div className="row mt-4">
        <div className="col-lg-6">
          <div className="dropdown">
            <button
              className="btn btn-warning dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Categorías
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <div
                className="dropdown-item c-pointer"
                onClick={() => filterByCategory("Almuerzos")}
              >
                Almuerzos
              </div>
              <div
                className="dropdown-item c-pointer"
                onClick={() => filterByCategory("Bebidas")}
              >
                Bebidas
              </div>
              <div
                className="dropdown-item c-pointer"
                onClick={() => filterByCategory("Cena")}
              >
                Cena
              </div>
              <div
                className="dropdown-item c-pointer"
                onClick={() => filterByCategory("Cervezas")}
              >
                Cervezas
              </div>
              <div
                className="dropdown-item c-pointer"
                onClick={() => filterByCategory("Comida")}
              >
                Comida rápida
              </div>
              <div
                className="dropdown-item c-pointer"
                onClick={() => filterByCategory("Cócteles")}
              >
                Cócteles
              </div>
              <div
                className="dropdown-item c-pointer"
                onClick={() => filterByCategory("Desayuno")}
              >
                Desayuno
              </div>
              <div
                className="dropdown-item c-pointer"
                onClick={() => filterByCategory("todos")}
              >
                Todos
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="input-group bg-input radius-input-left radius-input-right ">
            <div className="input-group-prepend">
              <span
                className="input-group-text bg-input radius-input-left"
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
              className="form-control bg-input radius-none"
              placeholder="Buscar"
              aria-label="filtro"
              aria-describedby="basic-addon1"
              autoComplete="off"
            />
            <div
              className="input-group-append"
              onClick={() => {
                setFilter("");
                setProducts(ref.current);
              }}
              style={{ cursor: "pointer" }}
            >
              <span className="input-group-text bg-input radius-input-right">
                <i className="fas fa-times"></i>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card-columns text-dark mt-4">
        {products.length === 0 ? (
          <p>No se encontro ningún platillo.</p>
        ) : (
          products.map((product) => <Card key={product.id} product={product} />)
        )}
      </div>
    </>
  );
};
