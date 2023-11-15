import { ChevronUpIcon } from "@heroicons/react/outline";
import React, { useState, ReactNode } from "react";

interface CollapsibleProps {
  children: ReactNode;
  isOpen: boolean;
}

const Collapsible: React.FC<CollapsibleProps> = ({ isOpen, children }) => {
  return (
    <div
      className={`${isOpen ? "block" : "hidden"} transition-all duration-300 ease-in-out overflow-hidden`}
      style={{ maxHeight: isOpen ? "10000px" : "0" }}
    >
      {children}
    </div>
  );
};

export default Collapsible;
