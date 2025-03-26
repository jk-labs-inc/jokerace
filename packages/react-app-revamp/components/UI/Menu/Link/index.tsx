import LinkNavigation from "@components/UI/Link";

interface MenuLinkProps {
  active: boolean;
  href: string;
  children: React.ReactNode;
}

const MenuLink: React.FC<MenuLinkProps> = ({ active, href, children }) => (
  <LinkNavigation
    href={href}
    className={`${active ? "bg-blue-500 text-white" : "text-gray-900"} block px-4 py-2 rounded-md`}
  >
    {children}
  </LinkNavigation>
);

export default MenuLink;
