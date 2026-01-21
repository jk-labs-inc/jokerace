import LandingPageTicker from "@components/_pages/Landing/components/Ticker";
import { ConnectButtonCustom } from "@components/Connect";
import CustomLink from "@components/UI/Link";
import { LINK_DOCS, LINK_LINKTREE } from "@config/links";
import { ROUTE_CREATE_CONTEST } from "@config/routes";

const LandingHeaderDesktop = () => {
  return (
    <>
      <LandingPageTicker />
      <header className="pl-16 3xl:pl-20 mt-6">
        <div className="grid grid-cols-[auto_1fr] items-center gap-x-6 max-w-(--landing-content-max-width)">
          <CustomLink href="/">
            <h1 className="font-sabo-filled text-neutral-11 normal-case text-[60px]">
              <span className="joke-3d" data-text="J">
                J
              </span>
              <span className="text-[45px] joke-3d">oke</span>
              <span className="joke-3d">R</span>
              <span className="text-[45px] joke-3d">ace</span>
            </h1>
          </CustomLink>

          <div className="flex items-center mt-4 ml-auto">
            <CustomLink
              prefetch={true}
              href={ROUTE_CREATE_CONTEST}
              className="bg-secondary-11 text-base text-true-black font-bold px-4 h-10 md:flex items-center justify-center rounded-2xl transition-all duration-200 ease-out hover:brightness-110 hover:shadow-[0_0_12px_rgba(255,255,255,0.15)]"
            >
              create a contest and earn
            </CustomLink>
          </div>

          <p className="text-neutral-11 text-2xl font-sabo-filled">vote. rally. earn.</p>
        </div>
      </header>
    </>
  );
};

export default LandingHeaderDesktop;
