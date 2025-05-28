interface LoaderProps {
  className?: string;
  children?: React.ReactNode;
}

//TODO: check this loader on multiple places in rewards tab
export const Loader = (props: LoaderProps) => {
  const { children, className } = props;
  return (
    <div className={`flex flex-col gap-8 items-center justify-center mt-40 ${className}`}>
      <img
        src="/contest/mona-lisa-moustache.png"
        alt="mona-lista-moustached"
        height={72}
        width={72}
        className="animate-card-rotation rounded-[5px]"
      />
      <p className="font-sabo text-neutral-14 text-[16px]">{children ?? "Loading, one moment please"}</p>
    </div>
  );
};
export default Loader;
