import { Switch } from "@headlessui/react";
import { FC, useState } from "react";

interface CreateSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const CreateSwitch: FC<CreateSwitchProps> = ({ checked, onChange }) => {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      className="group relative flex h-6 w-12 cursor-pointer rounded-full bg-neutral-10 ease-in-out focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none inline-block size-6 translate-x-0 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-7"
      />
    </Switch>
  );
};

export default CreateSwitch;
