import { Link } from "@tanstack/react-router";

interface CustomLinkProps {
  to: string;
  children: React.ReactNode;
  target?: string;
  className?: string;
  search?: Record<string, string | number | undefined>;
}

const CustomLink = ({ to, children, className, target, search, ...props }: CustomLinkProps) => {
  return (
    <Link to={to} search={search} className={className} target={target} {...props}>
      {children}
    </Link>
  );
};

export default CustomLink;
