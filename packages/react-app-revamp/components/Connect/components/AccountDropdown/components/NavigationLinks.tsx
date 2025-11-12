import CustomLink from "@components/UI/Link";
import { MenuItem } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { FC } from "react";
import { NAV_LINKS } from "../constants";

interface NavigationLinksProps {
  address: string;
}

const NavigationLinks: FC<NavigationLinksProps> = ({ address }) => {
  return (
    <div className="flex flex-col p-2">
      {NAV_LINKS.map(link => (
        <MenuItem key={link.href}>
          <CustomLink
            href={link.href.replace("[address]", address)}
            target="_blank"
            className="flex gap-2 items-center justify-between text-[16px] font-bold text-neutral-11 uppercase px-4 py-3 rounded-lg data-focus:bg-white/10 hover:bg-white/10 transition-colors"
          >
            <span>my {link.label}</span>
            <ChevronRightIcon width={16} height={16} className="text-neutral-11" />
          </CustomLink>
        </MenuItem>
      ))}
    </div>
  );
};

export default NavigationLinks;
