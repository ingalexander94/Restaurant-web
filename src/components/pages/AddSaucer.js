import React, { useContext, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import FileUploader from "react-firebase-file-uploader";
import FirebaseContext from "../../firebase/context";
import { showToast } from "../../alerts";

export const AddSaucer = () => {
  // Hooks
  const { firebase } = useContext(FirebaseContext);
  const history = useHistory();

  const [progress, setProgress] = useState(1);
  const [upload, setUpload] = useState(false);
  const [urlImage, setUrlImage] = useState("");
  const [loading, setLoading] = useState(false);

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
        .max(100, "Debe tener máximo 100 caracteres")
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
        history.push("/cocinero/menu");
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

  const handleProgress = (progress) => {
    setProgress(progress);
  };

  return (
    <>
      <h1 className="text-center">Crear Platillo</h1>
      <hr className="bg-white" />
      <div className="col-lg-6 col-md-8 mx-auto">
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">
              <strong>Nombre</strong>
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Nombre"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              autoComplete="off"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-danger">
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
              className="form-control"
              id="price"
              placeholder="$100"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              autoComplete="off"
            />
            {formik.touched.price && formik.errors.price && (
              <p className="text-danger">
                <strong>{formik.errors.price}</strong>
              </p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="category">
              <strong>Categoría</strong>
            </label>
            <select
              className="custom-select mr-sm-2"
              id="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Seleccione...</option>
              <option value="comida">Comida</option>
              <option value="desayuno">Desayuno</option>
              <option value="cena">Cena</option>
              <option value="bebida">Bebida</option>
              <option value="postre">Postre</option>
              <option value="ensalada">Ensalada</option>
            </select>
            {formik.touched.category && formik.errors.category && (
              <p className="text-danger">
                <strong>{formik.errors.category}</strong>
              </p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="image">
              <strong>Imagen</strong>
            </label>

            <FileUploader
              accept="image/*"
              className="form-control-file"
              name="image"
              id="image"
              randomizeFilename
              storageRef={firebase.storage.ref("products")}
              onUploadStart={handleUploadStart}
              onUploadError={handleUploadError}
              onUploadSuccess={handleUploadSuccess}
              onProgress={handleProgress}
            />
          </div>

          {upload && (
            <div className="progress">
              <div
                className="progress-bar progress-bar-striped"
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
              className="form-control"
              id="description"
              rows="2"
              style={{ resize: "none" }}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              autoComplete="off"
            ></textarea>
            {formik.touched.description && formik.errors.description && (
              <p className="text-danger">
                <strong>{formik.errors.description}</strong>
              </p>
            )}
          </div>
          <button
            className="btn btn-info btn-block"
            type="submit"
            disabled={loading || !formik.isValid}
          >
            Crear platillo
            {loading && <i className="ml-2 fas fa-spinner fa-pulse"></i>}
          </button>
        </form>
      </div>
    </>
  );
};
