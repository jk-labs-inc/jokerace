import LandingPageTicker from "@components/_pages/Landing/components/Ticker";
import CustomLink from "@components/UI/Link";
import LandingHeaderMobileFooter from "./components/Footer";
import LandingHeaderMobileExplainer from "./components/Explainer";

const LandingHeaderMobile = () => {
  return (
    <>
      <div className="mt-3">
        <div className="flex flex-col gap-6">
          <CustomLink href="/">
            <div className="flex flex-col gap-1 pl-4">
              <h1 className="font-sabo-filled text-neutral-11 normal-case text-[45px] relative">
                <span className="joke-3d" data-text="J">
                  J
                </span>
                <span className="text-[35px] joke-3d">oke</span>
                <span className="joke-3d">R</span>
                <span className="text-[35px] joke-3d">ace</span>
              </h1>
              <p className="text-neutral-11 text-[16px] font-sabo-filled">vote. rally. earn.</p>
            </div>
          </CustomLink>
          <div className="flex flex-col gap-8">
            <LandingPageTicker />
            <LandingHeaderMobileExplainer />
          </div>
        </div>

        <LandingHeaderMobileFooter />
      </div>
    </>
  );
};

export default LandingHeaderMobile;
