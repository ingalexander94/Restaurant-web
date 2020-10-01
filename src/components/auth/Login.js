import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import FirebaseContext from "../../firebase/context";
import { showToast } from "../../alerts";

export const Login = () => {
  // Hooks
  const [loading, setLoading] = useState(false);
  const { firebase } = useContext(FirebaseContext);
  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      email: "alexanderpenaloza3@gmail.com",
      password: "Alexander1994",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("El correo no es válido")
        .required("El campo correo es obligatorio"),
      password: Yup.string()
        .min(6, "Debe tener al menos 6 caracteres")
        .required("El campo clave es obligatorio"),
    }),
    onSubmit: (user) => {
      setLoading(true);
      firebase.auth
        .signInWithEmailAndPassword(user.email, user.password)
        .then(() => {
          setLoading(false);
          showToast("success", "Bienvenido");
          history.push("/cocinero/ordenes");
        })
        .catch((error) => {
          setLoading(false);
          showToast("error", error.message);
        });
    },
  });

  return (
    <>
      <div className="panel panel-default text-center">
        <div className="panel-heading">
          <h3 className="panel-title">Iniciar Sesión</h3>
          <hr className="bg-white" />
        </div>
        <div className="panel-body mt-2">
          <form onSubmit={formik.handleSubmit}>
            <div className="form-group">
              <input
                className="form-control"
                placeholder="Correo"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                autoComplete="off"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-danger text-left">
                  <strong>{formik.errors.email}</strong>
                </p>
              )}
            </div>
            <div className="form-group">
              <input
                className="form-control"
                placeholder="Clave"
                name="password"
                type="password"
                autoComplete="off"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-danger text-left">
                  <strong>{formik.errors.password}</strong>
                </p>
              )}
            </div>
            <button
              className="btn btn-lg btn-info btn-block"
              type="submit"
              disabled={loading || !formik.isValid}
            >
              Entrar
              {loading && <i className="ml-2 fas fa-spinner fa-pulse"></i>}
            </button>
          </form>
          <p className="mt-4">Ó Iniciar con redes sociales</p>
          <button
            className="btn btn-lg btn-primary btn-block mt-4"
            type="button"
          >
            Iniciar sesión con Google<i className="fab fa-google ml-2"></i>
          </button>
        </div>
      </div>
    </>
  );
};
