import { FOOTER_LINKS } from "@config/links";

const ALLOWED_LINKS = [
  "Github",
  "Twitter",
  "Report a bug",
  "Terms",
  "Privacy Policy",
  "Telegram",
  "Media Kit",
  "FAQ",
  "Substack",
];

const Footer = () => {
  const filteredLinks = FOOTER_LINKS.filter(link => ALLOWED_LINKS.includes(link.label));

  return (
    <footer className="bg-true-black border-t border-primary-2 hidden md:block">
      <div className="text-neutral-10 container justify-center items-center text-xs md:text-base font-bold flex pl-8 pr-8 md:pl-16 md:pr-16 mx-auto py-3">
        {filteredLinks.map((link, index) => (
          <a
            className="py-2 px-3 hover:text-neutral-11 transition-colors"
            key={`footer-link-${index}`}
            href={link.href}
            rel="nofollow noreferrer"
            target="_blank"
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
