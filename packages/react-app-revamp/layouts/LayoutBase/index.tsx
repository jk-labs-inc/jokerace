"use client";
import Header from "@components/Header";
import StickyFooter from "@components/StickyFooter";
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
      <main className={`flex flex-col grow ${isCreateFlow ? "pb-72" : "pb-40"} md:pb-0`}>{children}</main>
      <StickyFooter />
    </>
  );
};

export default LayoutBase;
