"use client";
import Footer from "@components/Footer";
import Header from "@components/Header";
import { usePathname } from "next/navigation";

interface LayoutBaseProps {
  children: React.ReactNode;
}

const LayoutBase = (props: LayoutBaseProps) => {
  const pathname = usePathname();
  const { children } = props;
  const isCreateFlow = pathname?.includes("/new");

  return (
    <>
      <Header />
      <main
        className={`flex flex-col grow min-h-0 ${
          isCreateFlow ? "pb-[calc(9rem+env(safe-area-inset-bottom))]" : "pb-[calc(6rem+env(safe-area-inset-bottom))]"
        } md:pb-4`}
      >
        {children}
      </main>
      <Footer />
    </>
  );
};

export default LayoutBase;
