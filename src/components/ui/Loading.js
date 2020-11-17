import React from "react";

export const Loading = () => {
  return (
    <>
      <img
        src={`${process.env.PUBLIC_URL}/assets/load.gif`}
        className="animate__animated animate__fadeIn img-fluid mx-auto d-block my-auto"
        alt="cargando..."
      />
    </>
  );
};
