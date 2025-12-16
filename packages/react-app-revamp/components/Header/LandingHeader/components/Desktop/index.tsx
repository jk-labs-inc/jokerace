import LandingPageTicker from "@components/_pages/Landing/components/Ticker";
import { ConnectButtonCustom } from "@components/Connect";
import CustomLink from "@components/UI/Link";
import { LINK_BRIDGE_DOCS, LINK_DOCS, LINK_LINKTREE } from "@config/links";
import { ROUTE_CREATE_CONTEST } from "@config/routes";
import { motion } from "motion/react";

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

          <div className="flex items-center gap-4 mt-4">
            {/* TODO: add links to all of these */}
            <a href="#how-it-works" className="hidden min-[1440px]:block text-2xl text-neutral-11 font-bold">
              how it works
            </a>
            <a
              href={LINK_DOCS}
              rel="noopener noreferrer"
              target="_blank"
              className="hidden min-[1440px]:block text-2xl text-neutral-11 font-bold"
            >
              docs
            </a>
            <a
              href={LINK_LINKTREE}
              rel="noopener noreferrer"
              target="_blank"
              className="hidden min-[1440px]:block text-2xl text-neutral-11 font-bold"
            >
              linktree
            </a>
            <motion.div whileTap={{ scale: 0.97 }} style={{ willChange: "transform" }}>
              <CustomLink
                prefetch={true}
                href={ROUTE_CREATE_CONTEST}
                className="hidden bg-secondary-11 text-base text-true-black font-bold px-4 h-10 xl:flex items-center justify-center rounded-2xl"
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
