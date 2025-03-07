import toast from "react-simple-toasts";
import "react-simple-toasts/dist/style.css";
import "react-simple-toasts/dist/theme/success.css";
import "react-simple-toasts/dist/theme/warning.css";
import "react-simple-toasts/dist/theme/dark.css";
import "react-simple-toasts/dist/theme/failure.css";

const initiateToastAlert = (
  message: string,
  theme: string,
  loading?: boolean,
) => {
  toast(message, {
    theme: theme,
    position: "top-center",
    loading: loading || false,
    maxVisibleToasts: 3,
  });
};

export default initiateToastAlert;
