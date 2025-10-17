import { FC } from "react";
import { Drawer as VaulDrawer } from "vaul";

interface DrawerProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

const Drawer: FC<DrawerProps> = ({ isOpen, children, className, onClose }) => {
  return (
    <VaulDrawer.Root open={isOpen} onClose={onClose}>
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className="fixed inset-0 bg-black/40" />
        <VaulDrawer.Content
          className={`bg-true-black z-50 rounded-t-4xl border-t border-l border-r border-neutral-17 h-fit fixed bottom-0 left-0 right-0 outline-none ${className}`}
        >
          <VaulDrawer.Handle className="!mx-auto !w-12 !h-1.5 !flex-shrink-0 !rounded-full !bg-neutral-9 !my-4" />
          {children}
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  );
};

export default Drawer;
