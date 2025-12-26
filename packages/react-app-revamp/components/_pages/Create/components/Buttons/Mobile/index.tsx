import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

type MobileBottomButtonProps = React.PropsWithChildren<{}>;

const MobileBottomButton: React.FC<MobileBottomButtonProps> = ({ children }) => {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const slot = document.getElementById("mobile-create-nav-slot");
    if (slot) {
      setPortalTarget(slot);
      return;
    }

    const observer = new MutationObserver(() => {
      const slot = document.getElementById("mobile-create-nav-slot");
      if (slot) {
        setPortalTarget(slot);
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  if (!portalTarget) return null;

  return ReactDOM.createPortal(<>{children}</>, portalTarget);
};

export default MobileBottomButton;
