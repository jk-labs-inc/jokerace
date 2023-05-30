import Header from "@components/Header";
import { FOOTER_LINKS } from "@config/links";
import { useRouter } from "next/router";

interface LayoutBaseProps {
  children: React.ReactNode;
}

const LayoutBase = (props: LayoutBaseProps) => {
  const { children } = props;
  const allowedLinks = ["Github", "Mirror", "Uniswap", "OpenSea", "Twitter", "Uniswap", "Report a bug"];
  const filteredLinks = FOOTER_LINKS.filter(link => allowedLinks.includes(link.label));
  const router = useRouter();
  const createRoute = router.pathname === "/contest/new";

  return (
    <>
      <Header />
      <main className="flex flex-col grow">{children}</main>
      {!createRoute && (
        <footer className="mt-auto py-20 xs:pb-0 xs:pt-32">
          <div className="text-true-white text-opacity-80 font-medium container justify-center items-start text-[18px] flex flex-col pl-8 pr-8 md:pl-16 md:pr-16 space-y-1 xs:space-y-0 xs:space-i-4 xs:flex-row xs:flex-wrap mx-auto">
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
      )}
    </>
  );
};

export const getLayout = (page: any) => <LayoutBase>{page}</LayoutBase>;

export default LayoutBase;
