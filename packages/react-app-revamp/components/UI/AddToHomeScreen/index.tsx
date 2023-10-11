import { Dialog } from "@headlessui/react";
import { hidePopupForever, shouldShowPopup } from "@helpers/pwa";
import { useEffect, useState } from "react";
import AddToHomeScreenNotSupportedBrowser from "./components/NotSupportedBrowser";
import AddToHomeScreenSupportedBrowser from "./components/SupportedBrowser";
import { browserName } from "react-device-detect";

const AddToHomeScreenPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const isSupportedBrowser = browserName === "Chrome" || browserName === "Safari" || browserName === "Edge";

  useEffect(() => {
    const checkConditions = () => {
      const shouldShow = shouldShowPopup();
      setShowPopup(shouldShow);
    };
    checkConditions();
  }, []);

  const handleClose = () => {
    hidePopupForever();
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <Dialog open={showPopup} onClose={() => null} className="relative z-50">
      <div
        className="fixed inset-0 pointer-events-none bg-true-black bg-opacity-80 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center 2xs:p-4">
        <div className="flex min-h-full w-full items-center justify-center">
          <Dialog.Panel
            className="text-sm mx-auto w-[340px] overflow-y-auto rounded-[10px]  shadow-dialog
             px-4 pt-4 pb-6 bg-true-black 2xs:rounded-lg"
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
