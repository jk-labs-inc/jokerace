import Link, { LinkProps } from "next/link";
interface CustomLinkProps extends LinkProps {
  children: React.ReactNode;
  prefetch?: boolean;
  target?: string;
  className?: string;
  style?: React.CSSProperties;
}

const CustomLink = ({ href, children, prefetch = true, className, target, style, ...props }: CustomLinkProps) => {
  return (
    <Link href={href} prefetch={prefetch} className={className} target={target} style={style} {...props}>
      {children}
    </Link>
  );
};

export default CustomLink;
