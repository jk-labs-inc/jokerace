import { useMediaQuery } from "react-responsive";
import LandingHeaderDesktop from "./components/Desktop";
import LandingHeaderMobile from "./components/Mobile";

const LandingHeader = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  if (isMobile) {
    return <LandingHeaderMobile />;
  }

  return <LandingHeaderDesktop />;
};

export default LandingHeader;
