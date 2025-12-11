import LandingPageTicker from "@components/_pages/Landing/components/Ticker";
import { ConnectButtonCustom } from "@components/Connect";
import CustomLink from "@components/UI/Link";
import { ROUTE_CREATE_CONTEST, ROUTE_VIEW_LIVE_CONTESTS } from "@config/routes";
import { motion } from "motion/react";

const textShadowStyle = {
  textShadow: `
    1px 1px 0 black,
    -1px -1px 0 black,
    1px -1px 0 black,
    -1px 1px 0 black,
    0 1px 0 black,
    1px 0 0 black,
    0 -1px 0 black,
    -1px 0 0 black
  `,
};

const LandingHeaderDesktop = () => {
  return (
    <>
      <LandingPageTicker isFixed />
      <header className="pl-16 3xl:pl-20 mt-12">
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

          <div className="flex items-center gap-4 mt-4">
            {/* TODO: add links to all of these */}
            <p className="hidden min-[1440px]:block text-2xl text-neutral-11 font-bold">how it works</p>
            <p className="hidden min-[1440px]:block text-2xl text-neutral-11 font-bold">docs</p>
            <p className="hidden min-[1440px]:block text-2xl text-neutral-11 font-bold">linktree</p>
            <motion.div whileTap={{ scale: 0.97 }} style={{ willChange: "transform" }}>
              <CustomLink
                prefetch={true}
                href={ROUTE_CREATE_CONTEST}
                className="hidden bg-secondary-11 text-base min-[1440px]:text-2xl text-neutral-11 font-bold px-4 h-10 md:flex items-center justify-center rounded-2xl"
                style={textShadowStyle}
              >
                create a contest
              </CustomLink>
            </motion.div>
            <div className="flex gap-3 items-center ml-auto">
              <ConnectButtonCustom />
            </div>
          </div>

          <p className="text-neutral-11 text-2xl font-sabo-filled">vote. rally. earn.</p>
        </div>
      </header>
    </>
  );
};

export default LandingHeaderDesktop;
