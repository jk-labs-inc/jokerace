import Image from "next/image";
import { FC } from "react";

interface LogoProps {
  width?: number;
  height?: number;
}

const Logo: FC<LogoProps> = ({ width = 214, height = 41 }) => {
  return <Image src="/confetti/confetti-logo.svg" alt="Confetti" width={width} height={height} />;
};

export default Logo;
