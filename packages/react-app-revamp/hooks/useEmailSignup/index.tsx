import { toastError, toastLoading, toastSuccess } from "@components/UI/Toast";
import { supabase } from "@config/supabase";
import { isSupabaseConfigured } from "@helpers/database";
import { useState } from "react";

const useEmailSignup = () => {
  const [isLoading, setLoading] = useState(false);

  const subscribeUser = async (
    email_address: string,
    user_address: string | null = null,
    showToasts: boolean = true,
  ) => {
    if (isSupabaseConfigured) {
      setLoading(true);
      showToasts && toastLoading("Subscribing...");
      try {
        const { error } = await supabase.from("email_signups").insert([{ email_address, user_address }]);
        setLoading(false);
        if (error) {
          showToasts && toastError("There was an error while subscribing. Please try again later.", error.message);
          return;
        }
        showToasts && toastSuccess("You have been subscribed successfully.");
      } catch (error: any) {
        setLoading(false);
        showToasts && toastError("There was an error while subscribing. Please try again later.", error.message);
      }
    }
  };

  const isEmailExists = async (email_address: string, showToasts: boolean = true) => {
    if (isSupabaseConfigured) {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("email_signups")
          .select("email_address")
          .eq("email_address", email_address);
        setLoading(false);
        if (error) {
          showToasts && toastError("There was an error while checking. Please try again later.", error.message);
          return false;
        }
        if (data?.length) {
          showToasts && toastError("This email address is already subscribed.");
          return true;
        } else {
          return false;
        }
      } catch (error: any) {
        setLoading(false);
        showToasts && toastError("There was an error while checking. Please try again later.", error.message);
        return false;
      }
    }
  };

  return { subscribeUser, isEmailExists, isLoading };
};

export default useEmailSignup;
