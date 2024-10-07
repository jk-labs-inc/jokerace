import { toastError, toastLoading, toastSuccess } from "@components/UI/Toast";
import { useState } from "react";

const useEmailSignup = () => {
  const [isLoading, setLoading] = useState(false);

  const subscribeUser = async (
    email_address: string,
    user_address: string | null = null,
    showToasts: boolean = true,
  ) => {
    setLoading(true);
    showToasts && toastLoading("Subscribing...");
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email_address, user_address }),
      });

      setLoading(false);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to subscribe");
      }

      showToasts && toastSuccess("You have been subscribed successfully.");
    } catch (error: any) {
      setLoading(false);
      showToasts && toastError("There was an error while subscribing. Please try again later.", error.message);
    }
  };

  const checkIfEmailExists = async (emailAddress: string, displayToasts: boolean = true) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ emailAddress });
      const response = await fetch(`/api/subscribe/is-subscribed?${params}`, { cache: "no-store" });

      setLoading(false);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to check email");
      }

      const { exists } = await response.json();
      return exists;
    } catch (error: any) {
      setLoading(false);
      displayToasts && toastError("There was an error while checking. Please try again later.", error.message);
      return false;
    }
  };

  return { subscribeUser, checkIfEmailExists, isLoading };
};

export default useEmailSignup;
