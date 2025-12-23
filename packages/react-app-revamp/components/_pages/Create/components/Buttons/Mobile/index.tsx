import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

type MobileBottomButtonProps = React.PropsWithChildren<{}>;

const MobileBottomButton: React.FC<MobileBottomButtonProps> = ({ children }) => {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const slot = document.getElementById("mobile-create-nav-slot");
    setPortalTarget(slot);
  }, []);

  if (!portalTarget) return null;

  return ReactDOM.createPortal(<>{children}</>, portalTarget);
};

export default MobileBottomButton;
