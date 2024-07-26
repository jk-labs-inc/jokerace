"use client";
import Header from "@components/Header";
import { FOOTER_LINKS } from "@config/links";
import { usePathname } from "next/navigation";

interface LayoutBaseProps {
  children: React.ReactNode;
}

const LayoutBase = (props: LayoutBaseProps) => {
  const pathname = usePathname();
  const { children } = props;
  const allowedLinks = ["Github", "Twitter", "Report a bug", "Terms", "Telegram", "Media Kit"];
  const filteredLinks = FOOTER_LINKS.filter(link => allowedLinks.includes(link.label));
  const isCreateFlow = pathname?.includes("/new");

  return (
    <>
      <Header />
      <main className={`flex flex-col grow ${isCreateFlow ? "pb-72" : "pb-28"} md:pb-0`}>{children}</main>
      <footer className="mt-auto top-0 xs:pt-32">
        {/* //todo: adjust for mobile */}
        <div className="text-neutral-10 container justify-center items-start text-[12px] md:text-[16px] flex flex-col pl-8 pr-8 md:pl-16 md:pr-16 space-y-1 xs:space-y-0 xs:space-i-4 xs:flex-row xs:flex-wrap mx-auto">
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
    </>
  );
};

export default LayoutBase;
