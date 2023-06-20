import { ChevronUpIcon } from "@heroicons/react/outline";
import React, { useState, ReactNode } from "react";

interface CollapsibleProps {
  children: ReactNode;
  isOpen: boolean;
}

const Collapsible: React.FC<CollapsibleProps> = ({ isOpen, children }) => {
  return (
    <>
      {isOpen && (
        <div
          className="transition-all duration-300 ease-in-out overflow-hidden"
          style={{ height: isOpen ? "auto" : "0" }}
        >
          {children}
        </div>
      )}
    </>
  );
};

export default Collapsible;
