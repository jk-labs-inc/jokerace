import { Link } from "@tanstack/react-router";
interface CustomLinkProps {
  to: string;
  children: React.ReactNode;
  target?: string;
  className?: string;
}

const CustomLink = ({ to, children, className, target, ...props }: CustomLinkProps) => {
  return (
    <Link to={to} className={className} target={target} {...props}>
      {children}
    </Link>
  );
};

export default CustomLink;
