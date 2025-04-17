import Link, { LinkProps } from "next/link";
interface CustomLinkProps extends LinkProps {
  children: React.ReactNode;
  prefetch?: boolean;
  target?: string;
  className?: string;
}

const CustomLink = ({ href, children, prefetch = true, className, target, ...props }: CustomLinkProps) => {
  return (
    <Link href={href} prefetch={prefetch} className={className} target={target} {...props}>
      {children}
    </Link>
  );
};

export default CustomLink;
