import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { isChrome, isIE, isSafari } from "react-device-detect";
import AddToHomeScreenNotSupportedBrowser from "./components/NotSupportedBrowser";
import AddToHomeScreenSupportedBrowser from "./components/SupportedBrowser";

const AddToHomeScreenPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const isSupportedBrowser = isSafari || isChrome || isIE;
  const isInPwaMode = window.matchMedia("(display-mode: standalone)").matches;

  useEffect(() => {
    const popupShown = sessionStorage.getItem("popupShown");
    if (!popupShown) {
      setShowPopup(true);
    }
  }, []);

  const handleClose = () => {
    setShowPopup(false);
    sessionStorage.setItem("popupShown", "true");
  };

  if (isInPwaMode) return null;

  return (
    <Dialog open={showPopup} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 pointer-events-none bg-neutral-8 bg-opacity-60" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center 2xs:p-4">
        <div className="flex min-h-full w-full items-center justify-center">
          <Dialog.Panel
            className={`text-sm mx-auto w-[350px] overflow-y-auto rounded-[10px] 
             px-4 pt-4 ${isSupportedBrowser ? "pb-0" : "pb-6"} bg-true-black`}
          >
            <div className="p-2 relative">
              <div className={`2xs:pt-3 pie-3`}>
                {isSupportedBrowser ? (
                  <AddToHomeScreenSupportedBrowser onClose={handleClose} />
                ) : (
                  <AddToHomeScreenNotSupportedBrowser onClose={handleClose} />
                )}
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default AddToHomeScreenPopup;
