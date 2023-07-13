import { useState } from "react";
import { toastError, toastSuccess, toastLoading } from "@components/UI/Toast";
import { supabase } from "@config/supabase";
import { isSupabaseConfigured } from "@helpers/database";
import { CustomError } from "types/error";

const useEmailSignup = () => {
  const [isLoading, setLoading] = useState(false);

  const subscribeUser = async (email_address: string, user_address: string | null = null) => {
    if (isSupabaseConfigured) {
      setLoading(true);
      toastLoading("Subscribing...");
      try {
        const { error } = await supabase.from("email_signups").insert([{ email_address, user_address }]);
        setLoading(false);
        if (error) {
          toastError("There was an error while subscribing. Please try again later.", error.message);
          return;
        }
        toastSuccess("You have been subscribed successfully.");
      } catch (error) {
        const customError = error as CustomError;

        setLoading(false);
        toastError("There was an error while subscribing. Please try again later.", customError.message);
      }
    }
  };

  const isEmailExists = async (email_address: string) => {
    if (isSupabaseConfigured) {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("email_signups").select("*").eq("email_address", email_address);
        setLoading(false);
        if (error) {
          toastError("There was an error while checking. Please try again later.", error.message);
          return false;
        }
        if (data?.length) {
          toastError("This email address is already subscribed.");
          return true;
        } else {
          return false;
        }
      } catch (error) {
        const customError = error as CustomError;
        setLoading(false);
        toastError("There was an error while checking. Please try again later.", customError.message);

        return false;
      }
    }
  };

  return { subscribeUser, isEmailExists, isLoading };
};

export default useEmailSignup;
