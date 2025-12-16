import { emailRegex } from "@helpers/regex";
import useEmailSignup from "@hooks/useEmailSignup";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useAccount } from "wagmi";

const Subscribe = () => {
  const [email, setEmail] = useState("");
  const { openConnectModal } = useConnectModal();
  const [emailError, setEmailError] = useState("");
  const [emailAlreadyExistsMessage, setEmailAlreadyExistsMessage] = useState("");
  const { subscribeUser, checkIfEmailExists, isLoading } = useEmailSignup();
  const { address } = useAccount();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubscribe = async () => {
    if (isLoading || !address) return;

    if (!isEmailValid()) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    const emailExists = await checkIfEmailExists({ emailAddress: email, userAddress: address });

    if (!emailExists) {
      await subscribeUser(email, address);
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
            className="bg-true-black w-full pl-4 py-2 text-[16px] md:text-[18px] placeholder-neutral-10 placeholder-bold rounded-[8px] border border-true-white transition-opacity focus:outline-none"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="email address..."
            required
          />
          <button
            className={`flex justify-center cursor-pointer items-center absolute right-0 w-36 md:w-48 rounded-r-[8px] top-0 h-full 
           bg-gradient-purple-white hover:opacity-90 ${
             isLoading ? "opacity-50 pointer-events-none" : ""
           } transition-all duration-300`}
            onClick={address ? handleSubscribe : openConnectModal}
          >
            <p className="text-[16px] md:text-[18px] font-bold text-true-black whitespace-nowrap px-2">
              {!address && !isMounted
                ? "connect wallet"
                : isMounted && isMobile
                ? "get updates"
                : "get contest updates"}
            </p>
          </button>
        </div>
      </div>
      {emailError ? (
        <p className="text-negative-11 text-[16px] font-bold pl-2">{emailError}</p>
      ) : emailAlreadyExistsMessage ? (
        <p className="text-positive-11 text-[16px] font-bold pl-2">{emailAlreadyExistsMessage}</p>
      ) : !address ? (
        <p className="text-neutral-11 text-[14px] font-medium pl-2">connect your wallet to get contest updates</p>
      ) : null}
    </div>
  );
};

export default Subscribe;
