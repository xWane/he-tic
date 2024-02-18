import { toast } from "react-toastify";

type ToastType = "success" | "error" | "warning" | "info";

/**
 * Custom hook to show toast messages much more easily and less repeating code
 * @returns showToast function
 */
const useToast = () => {
  const showToast = (type: ToastType, message: string) => {
    toast[type](message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return showToast;
};

export default useToast;
