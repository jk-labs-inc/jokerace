import Image from "next/image";
interface LoaderProps {
  children?: React.ReactNode;
}

export const Loader = (props: LoaderProps) => {
  const { children } = props;
  return (
    <div className="flex flex-col gap-8 items-center justify-center mt-40">
      <Image
        src="/contest/mona-lisa-moustache.png"
        alt="mona-lista-moustached"
        height={72}
        width={72}
        className="animate-card-rotation rounded-[5px]"
      />
      <p className="font-sabo text-neutral-14 text-[20px]">{children ?? "Loading, one moment please"}</p>
    </div>
  );
};
export default Loader;
