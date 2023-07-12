import { loaderText, loaderIcon, loaderWrapper } from "./styles";
interface LoaderProps {
  children?: React.ReactNode;
  scale?: string;
  classNameIcon?: string;
  classNameWrapper?: string;
  classNameText?: string;
}

export const Loader = (props: LoaderProps) => {
  const { children, scale, classNameText, classNameWrapper, classNameIcon } = props;
  return (
    /* @ts-ignore */
    <div className={loaderWrapper({ scale: scale ?? "page", class: classNameWrapper ?? "" })}>
      {/* @ts-ignore */}
      <div className={`${loaderIcon({ scale: scale ?? "page", class: classNameIcon ?? "" })} animate-card-rotation`}>
        🃏
      </div>
    </div>
  );
};
export default Loader;
