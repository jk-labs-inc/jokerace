import Header from "@components/Header";
import { FOOTER_LINKS } from "@config/links";
import { MediaQuery } from "@helpers/mediaQuery";
import { useMediaQuery } from "react-responsive";

interface LayoutBaseProps {
  children: React.ReactNode;
}

const LayoutBase = (props: LayoutBaseProps) => {
  const { children } = props;
  const allowedLinks = ["Github", "Mirror", "Uniswap", "OpenSea", "Twitter", "Uniswap", "Report a bug"];
  const filteredLinks = FOOTER_LINKS.filter(link => allowedLinks.includes(link.label));
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <>
      <Header />
      <main className={`flex flex-col grow ${isMobile ? "pb-20" : ""}`}>{children}</main>
      <MediaQuery minWidth={768}>
        <footer className="mt-auto py-20 xs:pb-0 xs:pt-32">
          <div className="text-neutral-11 container justify-center items-start text-[16px] flex flex-col pl-8 pr-8 md:pl-16 md:pr-16 space-y-1 xs:space-y-0 xs:space-i-4 xs:flex-row xs:flex-wrap mx-auto">
            {filteredLinks.map((link, key) => (
              <a
                className="py-2 xs:px-2"
                key={`footer-link-${key}`}
                href={link.href}
                rel="nofollow noreferrer"
                target="_blank"
              >
                {link.label}
              </a>
            ))}
          </div>
        </footer>
      </MediaQuery>
    </>
  );
};

export const getLayout = (page: any) => <LayoutBase>{page}</LayoutBase>;

export default LayoutBase;
