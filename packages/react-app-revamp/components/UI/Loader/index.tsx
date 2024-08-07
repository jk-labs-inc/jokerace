import Image from "next/image";

interface LoaderProps {
  children?: React.ReactNode;
}

export const Loader = (props: LoaderProps) => {
  const { children } = props;
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col gap-8 items-center justify-center">
        <Image
          src="/contest/mona-lisa-moustache.png"
          alt="mona-lista-moustached"
          height={100}
          width={100}
          className="animate-card-rotation rounded-[5px]"
        />
      </div>
    </div>
  );
};

export default Loader;
