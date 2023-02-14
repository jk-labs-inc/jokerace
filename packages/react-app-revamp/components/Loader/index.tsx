import { memo } from "react";
import FunFact from "./FunFact";
import { loaderText, loaderIcon, loaderWrapper } from "./styles";
interface LoaderProps {
  children?: React.ReactNode;
  scale?: string;
  classNameIcon?: string;
  classNameWrapper?: string;
  classNameText?: string;
  withFunFact?: boolean;
}

export const Loader = (props: LoaderProps) => {
  const { children, scale, classNameText, classNameWrapper, classNameIcon, withFunFact } = props;

  return (
    /* @ts-ignore */
    <div className={loaderWrapper({ scale: scale ?? "page", class: classNameWrapper ?? "" })}>
      {/* @ts-ignore */}
      <div className={`${loaderIcon({ scale: scale ?? "page", class: classNameIcon ?? "" })} animate-card-rotation`}>
        🃏
      </div>
      {/* @ts-ignore */}
      <div className={loaderText({ scale: scale ?? "page", class: classNameText ?? "" })}>
        {children ?? "Loading, one moment please..."}
      </div>

      {withFunFact && <FunFact />}
    </div>
  );
};

// add useMemo on Loader
export default memo(Loader);
