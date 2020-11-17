import React, { useContext, useRef, useState } from "react";
import PropTypes from "prop-types";
import queryString from "query-string";
import FirebaseContext from "../../firebase/context";
import { showAlertInput, showToast } from "../../alerts";
import { formatNumber } from "../../helpers/pipes";

const Card = ({ product }) => {
  // Hooks
  const ref = useRef(product.exists);
  const { firebase } = useContext(FirebaseContext);
  const [imgLoad, setImgLoad] = useState(false);

  const handleCheckboxChange = async () => {
    const {
      current: { checked },
    } = ref;
    try {
      await firebase.db.doc(`products/${product.id}`).update({
        exists: checked,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await firebase.db.doc(`products/${product.id}`).delete();
      const {
        query: { products },
      } = queryString.parseUrl(
        product.image.replace("?", "&").replace("%", "=").replace("/o/", "/o?")
      );
      await firebase.storage
        .ref("products")
        .child(`${products.slice(2)}`)
        .delete();
      showToast("success", "Eliminado");
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdatePrice = async () => {
    try {
      const { value } = await showAlertInput(
        "Editar precio",
        "Ingrese el nuevo precio del platillo"
      );
      if (value) {
        const [price] = value;
        price !== "" &&
          (await firebase.db.doc(`products/${product.id}`).update({
            price: +price,
          }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOnLoad = () => setImgLoad(true);

  return (
    <>
      <div className="card animate__animated animate__fadeIn">
        {!imgLoad && (
          <img
            src={`${process.env.PUBLIC_URL}/assets/loading.gif`}
            className="card-img-top animate__animated animate__fadeIn"
            alt="cargando..."
          />
        )}
        <img
          src={product.image}
          className={`card-img-top animate__animated animate__fadeIn ${
            !imgLoad && "d-none"
          }`}
          alt="cargando..."
          onLoad={handleOnLoad}
        />

        <div className="card-body">
          <h5 className="card-title">
            {product.name.toUpperCase()} -
            <span className="ml-2 badge badge-warning text-white text-uppercase">
              {product.category}
            </span>
          </h5>
          <p className="card-text">{product.description}</p>
          <div className="custom-control custom-checkbox">
            <input
              type="checkbox"
              className="custom-control-input"
              id={product.id}
              checked={product.exists}
              ref={ref}
              onChange={handleCheckboxChange}
            />
            <label
              className="custom-control-label"
              htmlFor={product.id}
              style={{ cursor: "pointer" }}
            >
              {product.exists ? "Disponible" : "No Disponible"}
            </label>
          </div>
          <blockquote className="blockquote text-right">
            <footer className="blockquote-footer">
              <small className="text-muted h6">
                Precio:{" "}
                <cite title="Source Title">{formatNumber(product.price)}</cite>
              </small>
              <i
                className="ml-2 fas fa-edit"
                style={{ cursor: "pointer" }}
                title="Cambiar precio"
                onClick={handleUpdatePrice}
              ></i>
              <i
                className="ml-2 text-danger far fa-trash-alt"
                style={{ cursor: "pointer" }}
                title="Eliminar platillo"
                onClick={handleDeleteProduct}
              ></i>
            </footer>
          </blockquote>
        </div>
      </div>
    </>
  );
};

Card.propTypes = {
  product: PropTypes.object.isRequired,
};

export default Card;
