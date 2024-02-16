import { FC } from "react";
import { Steps } from "../..";

interface CreateContestConfirmTagProps {
    tag: string;
    step: Steps;
    onClick?: () => void;    
}

const CreateContestConfirmTag:FC<CreateContestConfirmTagProps> = ({
    tag,
    step,
    onClick
}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (

    )
}

export default CreateContestConfirmTag;