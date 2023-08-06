/* eslint-disable react-hooks/exhaustive-deps */
import Image from "next/image";
import { FC, RefObject, useEffect, useState } from "react";
import { FadeLoader } from "react-spinners";
import { toast } from "react-toastify";

export type ToastMessage = {
  message: string;
  successMessage: string;
  status: "pending" | "completed" | "error" | null;
};

type MultiStepToastProps = {
  messages: ToastMessage[];
  promises: (() => Promise<any>)[];
  toastIdRef: RefObject<any>;
  completionMessage: string;
};

const MultiStepToast: FC<MultiStepToastProps> = ({ messages, promises, toastIdRef, completionMessage }) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const executePromises = async () => {
      for (let i = 0; i < promises.length; i++) {
        setLoading(true);
        setStep(i);
        try {
          await promises[i]();
          messages[i].status = "completed";
          messages[i].message = messages[i].successMessage;
        } catch (error) {
          setLoading(false);
          break;
        } finally {
          setLoading(false);
          setStep(i + 1);
        }
      }

      // Check if all promises are completed
      const allCompleted = messages.every(msg => msg.status === "completed");
      const timeout = allCompleted ? 4000 : 0;

      // Update the toast with completion message and auto-close timeout
      toast.update(toastIdRef.current, {
        render: allCompleted ? successMessage : undefined,
        type: allCompleted ? toast.TYPE.SUCCESS : undefined,
        autoClose: timeout,
      });
    };

    executePromises();
  }, []);

  const successMessage = (
    <div className="flex gap-4 items-center pl-4">
      <Image src="/toast/success.svg" width={40} height={40} alt="success" />
      <div className="flex flex-col">
        <p className="uppercase font-bold text-[16px]">success!</p>
        <p className="text-[12px]">{completionMessage}</p>
      </div>
    </div>
  );

  return (
    <div className="flex gap-2 pl-4 items-center">
      {loading ? <FadeLoader /> : null}
      <div className="flex flex-col">
        {messages.map((message, index) => (
          <div
            className={`text-[14px] items-center ${index === step ? "animate-flicker" : ""}`}
            key={index}
            style={{
              color: message.status === "completed" ? "#6A6A6A" : index === step ? "black" : "#6A6A6A",
            }}
          >
            <span className="font-bold">{message.message}</span>
          </div>
        ))}
        <span className="text-true-black text-[12px]">check wallet to sign all transactions</span>
      </div>
    </div>
  );
};

export default MultiStepToast;
