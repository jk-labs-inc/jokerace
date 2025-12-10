import { FOOTER_LINKS } from "@config/links";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const SCROLL_THRESHOLD = 10;

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

const StickyFooter = () => {
  const [isVisible, setIsVisible] = useState(false);
  const lastScrollY = useRef(0);

  const filteredLinks = FOOTER_LINKS.filter(link => ALLOWED_LINKS.includes(link.label));

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY.current;

    if (Math.abs(scrollDelta) >= SCROLL_THRESHOLD) {
      setIsVisible(scrollDelta < 0);
      lastScrollY.current = currentScrollY;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.footer
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 bg-true-black border-t border-primary-2 z-40 hidden md:block"
          style={{ willChange: "transform, opacity" }}
        >
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
        </motion.footer>
      )}
    </AnimatePresence>
  );
};

export default StickyFooter;
