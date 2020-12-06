import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { showAlertInput, showToast } from "../../alerts";
import FirebaseContext from "../../firebase/context";
import { showProducts } from "../../helpers/array";
import { toCapitalize } from "../../helpers/pipes";
import Card from "../ui/Card";

export const Menu = () => {
  // Hooks
  const { firebase } = useContext(FirebaseContext);
  const ref = useRef([]);
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("");
  const [categories, setCategories] = useState([]);

  const loadCategories = useCallback(async () => {
    const res = await firebase.db.collection("categories").get();
    const categories = res.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    setCategories(categories);
  }, [firebase.db]);

  useEffect(() => {
    async function subscribe() {
      await loadCategories();
    }
    subscribe();
  }, [loadCategories]);

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

  const handleCreateCategory = async () => {
    try {
      const { value } = await showAlertInput(
        "Nueva categoría",
        "Ingrese el nombre de la categoría",
        "text"
      );
      if (value) {
        const [newCategory] = value;
        const save = await firebase.db
          .collection("categories")
          .add({ name: newCategory.toLowerCase() });
        setCategories([
          { id: save.id, name: newCategory.toLowerCase() },
          ...categories,
        ]);
        showToast("success", `Se creo la categoría ${newCategory}`);
      }
    } catch (error) {
      console.error(error);
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
                className="dropdown-item c-pointer active"
                onClick={handleCreateCategory}
              >
                <span className="text-white">
                  Crear nueva <i className="fas fa-tag ml-2"></i>
                </span>
              </div>
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="dropdown-item c-pointer"
                  onClick={() => filterByCategory(`${category.name}`)}
                >
                  {toCapitalize(category.name)}
                </div>
              ))}
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
