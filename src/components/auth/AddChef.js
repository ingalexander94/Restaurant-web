import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import FirebaseContext from "../../firebase/context";
import { showToast } from "../../alerts";

export const AddChef = () => {
  // Hooks
  const [loading, setLoading] = useState(false);
  const { firebase } = useContext(FirebaseContext);
  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
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
        .required("El campo clave es obligatorio"),
    }),
    onSubmit: async ({ name, email, password }) => {
      try {
        setLoading(true);
        const chef = await firebase.auth.createUserWithEmailAndPassword(
          email,
          password
        );
        await chef.user.updateProfile({
          displayName: name,
        });
        setLoading(false);
        showToast("success", "Cocinero creado");
        history.push("/cocinero/ordenes");
      } catch (error) {
        setLoading(false);
        showToast("error", error.message);
      }
    },
  });

  return (
    <>
      <div className="panel panel-default text-center">
        <div className="panel-heading">
          <h3 className="panel-title">Crear Cocinero</h3>
          <hr className="bg-white" />
        </div>
        <div className="panel-body mt-2">
          <form onSubmit={formik.handleSubmit}>
            <div className="form-group">
              <input
                className="form-control"
                placeholder="Nombre"
                name="name"
                type="text"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                autoComplete="off"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-danger text-left">
                  <strong>{formik.errors.name}</strong>
                </p>
              )}
            </div>
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
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                autoComplete="off"
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
              Crear cuenta
              {loading && <i className="ml-2 fas fa-spinner fa-pulse"></i>}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
