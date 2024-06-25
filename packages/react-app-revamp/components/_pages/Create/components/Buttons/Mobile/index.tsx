import React from "react";
import ReactDOM from "react-dom";

type MobileBottomButtonProps = React.PropsWithChildren<{}>;

const MobileBottomButton: React.FC<MobileBottomButtonProps> = ({ children }) => {
  return ReactDOM.createPortal(
    <div className="fixed bottom-14 left-0 right-0 z-50 bg-true-black">{children}</div>,
    document.body,
  );
};

export default MobileBottomButton;
