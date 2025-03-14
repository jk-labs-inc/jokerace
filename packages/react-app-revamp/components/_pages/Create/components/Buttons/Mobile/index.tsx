import React from "react";
import ReactDOM from "react-dom";

type MobileBottomButtonProps = React.PropsWithChildren<{}>;

const MobileBottomButton: React.FC<MobileBottomButtonProps> = ({ children }) => {
  return ReactDOM.createPortal(
    <div className="h-12 fixed bottom-12 left-0 right-0 z-50 bg-true-black">{children}</div>,
    document.body,
  );
};

export default MobileBottomButton;
