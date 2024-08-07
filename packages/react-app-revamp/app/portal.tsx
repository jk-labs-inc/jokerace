"use client";
import { Portal as HeadlessUiPortal } from "@headlessui/react";
import { Slide, ToastContainer } from "react-toastify";

const Portal = () => {
  return (
    <HeadlessUiPortal>
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
        bodyClassName={() => "text-[16px] flex items-center"}
        transition={Slide}
      />
    </HeadlessUiPortal>
  );
};

export default Portal;
