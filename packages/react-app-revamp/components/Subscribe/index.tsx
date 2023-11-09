import { emailRegex } from "@helpers/regex";
import { ChevronRightIcon } from "@heroicons/react/outline";
import useEmailSignup from "@hooks/useEmailSignup";
import { useState } from "react";
import { useAccount } from "wagmi";

const Subscribe = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailAlreadyExistsMessage, setEmailAlreadyExistsMessage] = useState("");
  const { subscribeUser, checkIfEmailExists, isLoading } = useEmailSignup();
  const { address } = useAccount();

  const handleSubscribe = async () => {
    if (isLoading) return;
    if (!isEmailValid()) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    const emailExists = await checkIfEmailExists(email);
    if (!emailExists) {
      await subscribeUser(email, address ?? null);
      setEmail("");
      setEmailError("");
    } else {
      setEmailAlreadyExistsMessage("your email has already been subscribed! :)");
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setEmailError("");
    setEmailAlreadyExistsMessage("");
  };

  const isEmailValid = () => {
    return emailRegex.test(email);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full md:w-[500px]">
        <div className="relative w-full">
          <input
            className="bg-true-black w-full pl-4 py-2 text-[14px] md:text-[16px] placeholder-neutral-10 placeholder-bold rounded-[40px] border border-neutral-11 transition-opacity focus:outline-none"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="enter email to get updates on top contests..."
            required
          />
          <div
            className={`flex justify-center cursor-pointer items-center absolute right-0 w-[50px] border-r border-t border-b rounded-r-[40px] top-0 h-full bg-neutral-12 ${
              isLoading ? "opacity-50 pointer-events-none" : ""
            }`}
            onClick={handleSubscribe}
          >
            <ChevronRightIcon className="w-7 h-7 text-true-black" />
          </div>
        </div>
      </div>
      {emailError ? (
        <p className="text-negative-11 text-[16px] font-bold pl-2">{emailError}</p>
      ) : emailAlreadyExistsMessage ? (
        <p className="text-positive-11 text-[16px] font-bold pl-2">{emailAlreadyExistsMessage}</p>
      ) : null}
    </div>
  );
};

export default Subscribe;
