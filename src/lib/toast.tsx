import React, { useState } from "react";

export interface IToastContextProps {
  visible: boolean;
  message: string | null;
  show: (text: string, timeout?: number) => void;
  clear: () => void;
}

export const ToastContext = React.createContext<IToastContextProps | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [timeoutInstance, setTimeoutInstance] = useState<NodeJS.Timeout | null>(null);

  return (
    <ToastContext.Provider
      value={{
        visible,
        message,
        show: (text: string, timeout: number = 3) => {
          setMessage(text);
          setVisible(true);

          setTimeoutInstance((e) => {
            if (e) clearTimeout(e);

            return setTimeout(() => {
              setVisible(false);
            }, timeout * 1000);
          });
        },
        clear: () => setVisible(false),
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};
