import React, { useCallback, useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import FileUploader from "react-firebase-file-uploader";
import AuthContext from "../auth/authContext";
import FirebaseContext from "../../firebase/context";
import { showToast } from "../../alerts";
import { toCapitalize } from "../../helpers/pipes";

export const AddSaucer = () => {
  // Hooks
  const history = useHistory();
  const ChefAuth = useContext(AuthContext);
  const { firebase } = useContext(FirebaseContext);

  const [progress, setProgress] = useState(1);
  const [upload, setUpload] = useState(false);
  const [urlImage, setUrlImage] = useState("");
  const [loading, setLoading] = useState(false);
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
    if (ChefAuth.role !== "administrador") {
      history.push("/usuario/cocinero/ordenes");
    }
  }, [ChefAuth.role, history]);

  // Validaciones del formulario
  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      category: "",
      image: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Debe tener al menos 3 caracteres")
        .required("El campo nombre es obligatorio")
        .lowercase(),
      price: Yup.number()
        .min(50, "El precio mínimo es de $50 COP")
        .required("El campo precio es obligatorio"),
      category: Yup.string().required("El campo categoría es obligatorio"),
      description: Yup.string()
        .min(10, "Debe tener al menos 10 caracteres")
        .max(200, "Debe tener máximo 200 caracteres")
        .required("El campo descripción es obligatorio"),
    }),
    onSubmit: async (saucer) => {
      try {
        if (urlImage === "") {
          showToast("warning", "Seleccione una imagen para el producto");
          return;
        }
        setLoading(true);
        saucer.name = saucer.name.toLowerCase();
        saucer.exists = true;
        saucer.image = urlImage;
        await firebase.db.collection("products").add(saucer);
        formik.handleReset();
        setLoading(false);
        showToast("success", "Se creo un nuevo producto");
        history.push("/usuario/cocinero/menu");
      } catch (error) {
        setLoading(false);
        showToast("error", "Ocurrio un error al crear el proyecto");
        console.error(error);
      }
    },
  });

  // Carga de imágenes
  const handleUploadStart = () => {
    setProgress(0);
    setUpload(true);
  };
  const handleUploadError = (error) => {
    setUpload(false);
    showToast("warning", "No se puede cargar la imagen, intente con otra");
    console.log(error);
  };
  const handleUploadSuccess = async (name) => {
    setProgress(100);
    const url = await firebase.storage
      .ref("products")
      .child(name)
      .getDownloadURL();
    setUrlImage(url);
    setUpload(false);
  };

  const handleProgress = (progress) => setProgress(progress);

  return (
    <>
      <div
        className="card mb-3 border-0"
        style={{ backgroundColor: "#FAFAFA" }}
      >
        <div className="row g-0">
          <div className="col-md-6">
            <img
              src={`${process.env.PUBLIC_URL}/assets/cook.jpg`}
              alt="Cargando..."
              className="img-fluid img-container animate__animated animate__fadeIn"
            />
          </div>
          <div className="col-md-6 p-4">
            <form onSubmit={formik.handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">
                  <strong>Nombre</strong>
                </label>
                <input
                  type="text"
                  className="form-control bg-input"
                  id="name"
                  placeholder="Nombre"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="off"
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-error">
                    <strong>{formik.errors.name}</strong>
                  </p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="price">
                  <strong>Precio</strong>
                </label>
                <input
                  type="number"
                  className="form-control bg-input"
                  id="price"
                  placeholder="$100"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="off"
                />
                {formik.touched.price && formik.errors.price && (
                  <p className="text-error">
                    <strong>{formik.errors.price}</strong>
                  </p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="category">
                  <strong>Categoría</strong>
                </label>
                <select
                  className="custom-select mr-sm-2 bg-input"
                  id="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Seleccione...</option>
                  {categories.map((category) => (
                    <option key={category.id} value={`${category.name}`}>
                      {toCapitalize(category.name)}
                    </option>
                  ))}
                </select>
                {formik.touched.category && formik.errors.category && (
                  <p className="text-error">
                    <strong>{formik.errors.category}</strong>
                  </p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="image">
                  <strong>Imagen</strong>
                </label>

                <div className="custom-file bg-input">
                  <FileUploader
                    accept="image/*"
                    className="custom-file-input bg-input"
                    id="customFileLang"
                    name="image"
                    randomizeFilename
                    storageRef={firebase.storage.ref("products")}
                    onUploadStart={handleUploadStart}
                    onUploadError={handleUploadError}
                    onUploadSuccess={handleUploadSuccess}
                    onProgress={handleProgress}
                  />
                  <label
                    className="custom-file-label bg-input"
                    htmlFor="customFileLang"
                  >
                    Seleccionar Archivo
                  </label>
                </div>
              </div>

              {upload && (
                <div className="progress">
                  <div
                    className="progress-bar progress-bar-striped bg-warning"
                    role="progressbar"
                    style={{ width: `${progress}%` }}
                    aria-valuenow={progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    {`${progress}%`}
                  </div>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="description">
                  <strong>Descripción</strong>
                </label>
                <textarea
                  className="form-control bg-input"
                  id="description"
                  rows="2"
                  style={{ resize: "none" }}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="off"
                ></textarea>
                {formik.touched.description && formik.errors.description && (
                  <p className="text-error">
                    <strong>{formik.errors.description}</strong>
                  </p>
                )}
              </div>
              <button
                className="btn btn-warning btn-block"
                type="submit"
                disabled={loading || !formik.isValid}
              >
                Crear platillo
                {loading && <i className="ml-2 fas fa-spinner fa-pulse"></i>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
