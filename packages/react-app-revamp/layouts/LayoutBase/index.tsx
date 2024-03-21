import Header from "@components/Header";
import AddToHomeScreenPopup from "@components/UI/AddToHomeScreen";
import { FOOTER_LINKS } from "@config/links";
import { MediaQuery } from "@helpers/mediaQuery";
import { useRouter } from "next/router";

interface LayoutBaseProps {
  children: React.ReactNode;
}

const LayoutBase = (props: LayoutBaseProps) => {
  const router = useRouter();
  const { children } = props;
  const allowedLinks = ["Github", "Twitter", "Report a bug", "Terms", "Telegram"];
  const filteredLinks = FOOTER_LINKS.filter(link => allowedLinks.includes(link.label));
  const isCreateFlow = router.pathname.includes("/new");

  return (
    <>
      <Header />
      <main className={`flex flex-col grow ${isCreateFlow ? "pb-60" : "pb-28"} md:pb-0`}>{children}</main>
      <MediaQuery maxWidth={768}>
        <AddToHomeScreenPopup />
      </MediaQuery>
      <MediaQuery minWidth={768}>
        <footer className="mt-auto top-0 xs:pt-32">
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
