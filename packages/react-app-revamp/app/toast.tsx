import { Slide, ToastContainer } from "react-toastify";

const ToastProvider = () => {
  return (
    <ToastContainer
      position="bottom-center"
      autoClose={4000}
      hideProgressBar
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      transition={Slide}
    />
  );
};

export default ToastProvider;
