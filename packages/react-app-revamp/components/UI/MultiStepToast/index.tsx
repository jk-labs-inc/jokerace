import { useEffect, useState, FC } from "react";

type ToastMessage = {
  text: string;
  status: "pending" | "completed" | "error" | null;
};

type MultiStepToastProps = {
  closeToast: () => void;
  messages: ToastMessage[];
  promises: (() => Promise<any>)[];
};

const MultiStepToast: FC<MultiStepToastProps> = ({ closeToast, messages, promises }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const executePromises = async () => {
      for (let i = 0; i < promises.length; i++) {
        try {
          setStep(i);
          await promises[i]();
          messages[i].status = "completed";
        } catch (error) {
          messages[i].status = "error";
          messages[i].text += ` Error: ${(error as Error).message}`;
          break;
        }
      }
      closeToast();
    };

    executePromises();
  }, []);

  return (
    <div>
      {messages.map((message, index) => (
        <div
          key={index}
          style={{
            color:
              message.status === "completed"
                ? "green"
                : message.status === "error"
                ? "red"
                : index === step
                ? "black"
                : "grey",
          }}
        >
          {message.text}
        </div>
      ))}
    </div>
  );
};

export default MultiStepToast;
