import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useHistory } from "react-router-dom";
import FirebaseContext from "../../firebase/context";
import { showToast } from "../../alerts";
import "../../styles/auth.css";

export const AddChef = () => {
  // Hooks
  const [loading, setLoading] = useState(false);
  const [typeInput, setTypeInput] = useState("password");
  const { firebase } = useContext(FirebaseContext);
  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Debe tener al menos 3 caracteres")
        .required("El campo nombre es obligatorio"),
      email: Yup.string()
        .email("El correo no es válido")
        .required("El campo correo es obligatorio"),
      password: Yup.string()
        .min(6, "Debe tener al menos 6 caracteres")
        .required("El campo contraseña es obligatorio"),
      role: Yup.string().required("El campo rol es obligatorio"),
    }),
    onSubmit: async ({ name, email, password, role }) => {
      try {
        setLoading(true);
        const chef = await firebase.auth.createUserWithEmailAndPassword(
          email,
          password
        );
        await chef.user.updateProfile({
          displayName: name,
        });

        await firebase.db.doc(`users/${chef.user.uid}`).set({
          name,
          email,
          role,
        });

        setLoading(false);
        showToast("success", "Cocinero creado");
        history.push("/usuario/cocinero/ordenes");
      } catch (error) {
        setLoading(false);
        showToast("error", error.message);
      }
    },
  });

  return (
    <>
      <div className="panel panel-default text-center animate__animated animate__fadeIn">
        <div className="panel-heading">
          <div className="row title-auth">
            <h1 className="panel-title">
              <strong>Fo</strong>
              <strong className="text-secondary-custom">od</strong>
            </h1>
            <img
              src={`${process.env.PUBLIC_URL}/assets/chef.svg`}
              width="50"
              height="50"
              className="ml-2"
              alt="Cargando..."
            />
          </div>
        </div>
        <br />
        <div className="panel-body mt-2">
          <form onSubmit={formik.handleSubmit}>
            <div>
              <div className="input-group bg-input radius-input-left radius-input-right">
                <div className="input-group-prepend">
                  <span
                    className="input-group-text bg-input radius-input-left"
                    id="basic-addon1"
                  >
                    <i className="far fa-user"></i>
                  </span>
                </div>
                <input
                  className="form-control bg-input radius-input-right"
                  placeholder="Nombre"
                  name="name"
                  type="text"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="off"
                />
              </div>
              {formik.touched.name && formik.errors.name && (
                <p className="text-error text-left">
                  <strong>{formik.errors.name}</strong>
                </p>
              )}
            </div>
            <div>
              <div className="input-group mt-4 bg-input radius-input-left radius-input-right">
                <div className="input-group-prepend">
                  <span
                    className="input-group-text bg-input radius-input-left"
                    id="basic-addon1"
                  >
                    <i className="far fa-envelope"></i>
                  </span>
                </div>
                <input
                  className="form-control bg-input radius-input-right"
                  placeholder="Correo"
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="off"
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="text-error text-left">
                  <strong>{formik.errors.email}</strong>
                </p>
              )}
            </div>
            <div>
              <div className="input-group mt-4 bg-input radius-input-left radius-input-right">
                <div className="input-group-prepend">
                  <span
                    className="input-group-text bg-input radius-input-left"
                    id="basic-addon1"
                  >
                    <i className="fas fa-key"></i>
                  </span>
                </div>
                <input
                  className="form-control bg-input radius-none"
                  placeholder="Contraseña"
                  name="password"
                  type={typeInput}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="off"
                />
                <div className="input-group-append">
                  <span className="input-group-text bg-input radius-input-right">
                    {typeInput === "password" ? (
                      <i
                        onClick={() => setTypeInput("text")}
                        className="c-pointer far fa-eye"
                      ></i>
                    ) : (
                      <i
                        onClick={() => setTypeInput("password")}
                        className="c-pointer fas fa-eye-slash"
                      ></i>
                    )}
                  </span>
                </div>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-error text-left">
                  <strong>{formik.errors.password}</strong>
                </p>
              )}
            </div>
            <div>
              <div className="input-group mt-4 bg-input radius-input-left radius-input-right">
                <div className="input-group-prepend">
                  <span
                    className="input-group-text bg-input radius-input-left"
                    id="basic-addon1"
                  >
                    <i className="fas fa-user-tag"></i>
                  </span>
                </div>
                <select
                  className="custom-select bg-input radius-none"
                  id="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Seleccione...</option>
                  <option value="cocinero">Cocinero</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>
              {formik.touched.role && formik.errors.role && (
                <p className="text-error text-left">
                  <strong>{formik.errors.role}</strong>
                </p>
              )}
            </div>
            <button
              className="btn btn-warning rounded-0 btn-block mt-4 mb-4"
              type="submit"
              disabled={loading || !formik.isValid}
            >
              Crear cuenta
              {loading && <i className="ml-2 fas fa-spinner fa-pulse"></i>}
            </button>
          </form>
        </div>
        <Link to="/entrar" className="mt-4 text-uppercase text-gray">
          Ir a iniciar sesión
        </Link>
      </div>
    </>
  );
};
