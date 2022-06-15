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
    <div className={loaderWrapper({ scale: scale ?? "page", class: classNameWrapper ?? "" })}>
      <div className={`${loaderIcon({ scale: scale ?? "page", class: classNameIcon ?? "" })} animate-card-rotation`}>
        🃏
      </div>
      <div className={loaderText({ scale: scale ?? "page", class: classNameText ?? "" })}>
        {children ?? "Loading, one moment please..."}
      </div>
    </div>
  );
};
export default Loader;
