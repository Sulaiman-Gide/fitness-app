import React, { createContext, useCallback, useContext, useState } from "react";
import CustomToast from "./CustomToast"; // Assuming CustomToast is in the same directory

interface ToastContextType {
  showToast: (options: Omit<ToastOptions, "visible" | "onHide">) => void;
}

interface ToastOptions {
  visible: boolean;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
  onHide: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toastOptions, setToastOptions] = useState<ToastOptions>({
    visible: false,
    message: "",
    type: "info",
    onHide: () => {},
  });

  const hideToast = useCallback(() => {
    setToastOptions((prev) => ({ ...prev, visible: false }));
  }, []);

  const showToast = useCallback(
    (options: Omit<ToastOptions, "visible" | "onHide">) => {
      setToastOptions({ ...options, visible: true, onHide: hideToast });
    },
    [hideToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <CustomToast
        visible={toastOptions.visible}
        message={toastOptions.message}
        type={toastOptions.type}
        duration={toastOptions.duration}
        onHide={toastOptions.onHide}
      />
    </ToastContext.Provider>
  );
};
