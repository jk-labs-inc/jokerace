import { FC } from "react";

interface LandingPageHowItWorksProcessStepProps {
  children: React.ReactNode;
}

const LandingPageHowItWorksProcessStepContainer: FC<LandingPageHowItWorksProcessStepProps> = ({ children }) => {
   return (
    <div className="flex items-center gap-2">
        {children}
    </div>
   )
}

export default LandingPageHowItWorksProcessStepContainer;