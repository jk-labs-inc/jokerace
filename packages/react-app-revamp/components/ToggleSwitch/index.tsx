import { Switch } from "@headlessui/react";

export const ToggleSwitch = (props: any) => {
  const { label, helpText, ...rest } = props;
  const { checked } = rest;
  return (
    <Switch.Group>
      <div className="flex flex-col">
        <div className="flex items-center">
          <Switch.Label className="flex flex-col font-bold text-sm">
            <span className="pie-2">{label}</span>
          </Switch.Label>
          <Switch
            {...rest}
            type="button"
            className={`${
              checked
                ? "bg-positive-11 focus-visible:ring-positive-9 focus-visible:ring-opacity-25"
                : "focus-visible:ring-true-white bg-neutral-7 focus-visible:ring-opacity-30"
            }
          disabled:opacity-50 disabled:cursor-not-allowed
          relative inline-flex h-5 lg:h-6 w-10 lg:w-12 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-4  border-2 border-transparent`}
          >
            <span
              aria-hidden="true"
              className={`${
                checked ? "translate-x-5 lg:translate-x-6" : "translate-x-0"
              } pointer-events-none inline-block h-4 w-4 lg:h-5 lg:w-5  transform rounded-full bg-true-white shadow-lg transition duration-200 ease-in-out`}
            />
          </Switch>
        </div>
        {helpText && <span className="text-neutral-11 pt-1 text-2xs">{helpText}</span>}
      </div>
    </Switch.Group>
  );
};

export default ToggleSwitch;
