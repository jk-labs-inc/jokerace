import { Link } from "next-view-transitions";
import { LinkProps } from "next/link";

interface LinkNavigationProps extends LinkProps {
  children: React.ReactNode;
  prefetch?: boolean;
  target?: string;
  className?: string;
}

const LinkNavigation = ({ href, children, prefetch = true, className, target, ...props }: LinkNavigationProps) => {
  return (
    <Link href={href} prefetch={prefetch} className={className} target={target} {...props}>
      {children}
    </Link>
  );
};

export default LinkNavigation;
