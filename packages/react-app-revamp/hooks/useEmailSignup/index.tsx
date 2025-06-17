import { toastError, toastLoading, toastSuccess } from "@components/UI/Toast";
import { supabase } from "@config/supabase";
import { isSupabaseConfigured } from "@helpers/database";
import { useEmailSend } from "@hooks/useEmailSend";
import { EmailType } from "lib/email/types";
import moment from "moment";
import { useState } from "react";

interface CheckIfEmailExistsProps {
  emailAddress: string;
  displayToasts?: boolean;
  userAddress?: string;
}

const useEmailSignup = () => {
  const [isLoading, setLoading] = useState(false);
  const { sendEmail } = useEmailSend();

  const subscribeUser = async (
    email_address: string,
    user_address: string | null = null,
    showToasts: boolean = true,
  ) => {
    if (isSupabaseConfigured) {
      setLoading(true);
      showToasts && toastLoading("Subscribing...");
      try {
        let successMessage = "You have been subscribed successfully.";

        if (user_address) {
          const { data: existingUser } = await supabase
            .from("email_signups")
            .select("email_address")
            .eq("user_address", user_address);

          if (existingUser && existingUser.length > 0) {
            // User address exists, show replacement message
            successMessage = "We'll replace your old email associated with this address with this new one.";
          } else {
            // First time subscription for this address
            successMessage = "We'll add notifications for this address to your email.";
          }
        }

        const { error } = await supabase.from("email_signups").insert([
          {
            email_address,
            user_address,
            date: moment().format("YYYY-MM-DD HH:mm:ss"),
          },
        ]);

        if (error) {
          setLoading(false);
          showToasts && toastError("There was an error while subscribing. Please try again later.", error.message);
          return;
        }

        await sendEmail(user_address ?? "", EmailType.SignUpConfirmation);
        setLoading(false);
        showToasts && toastSuccess(successMessage);
      } catch (error: any) {
        setLoading(false);
        showToasts && toastError("There was an error while subscribing. Please try again later.", error.message);
      }
    }
  };

  const checkIfEmailExists = async ({ emailAddress, displayToasts = true, userAddress }: CheckIfEmailExistsProps) => {
    if (isSupabaseConfigured) {
      setLoading(true);
      try {
        let query = supabase
          .from("email_signups")
          .select("email_address, user_address")
          .eq("email_address", emailAddress);

        if (userAddress) {
          // Check if both email AND user address match (tied together)
          query = query.eq("user_address", userAddress);
        }

        const { data, error } = await query;

        setLoading(false);
        if (error) {
          displayToasts && toastError("There was an error while checking. Please try again later.", error.message);
          return false;
        }
        if (data?.length) {
          return true;
        } else {
          return false;
        }
      } catch (error: any) {
        setLoading(false);
        displayToasts && toastError("There was an error while checking. Please try again later.", error.message);
        return false;
      }
    }
  };

  return { subscribeUser, checkIfEmailExists, isLoading };
};

export default useEmailSignup;
