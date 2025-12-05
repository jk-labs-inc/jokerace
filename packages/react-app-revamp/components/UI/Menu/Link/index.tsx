import CustomLink from "@components/UI/Link";

interface MenuLinkProps {
  active: boolean;
  href: string;
  children: React.ReactNode;
}

const MenuLink: React.FC<MenuLinkProps> = ({ active, href, children }) => (
  <CustomLink to={href} className={`${active ? "bg-blue-500 text-white" : "text-gray-900"} block px-4 py-2 rounded-md`}>
    {children}
  </CustomLink>
);

export default MenuLink;
