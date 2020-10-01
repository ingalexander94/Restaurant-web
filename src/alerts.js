import Swal from "sweetalert2";

const showToast = (icon, title, timer = 2000) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  Toast.fire({
    icon,
    title,
  });
};

const showQuestion = (title, text, icon, confirmButtonText) => {
  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton: false,
    confirmButtonColor: "#3085d6",
    confirmButtonText,
  });
};

export { showToast, showQuestion };
