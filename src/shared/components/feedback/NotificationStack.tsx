import "./NotificationStack.css";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Box,
  CheckCircle,
} from "lucide-react";

type NotificationVariant =
  | "default"
  | "cart";

interface Toast {
  id: number;
  title: string;
  message: string;
  variant: NotificationVariant;
  leaving: boolean;
}

let toastId = 0;

type Listener = (
  title: string,
  message: string,
  variant?: NotificationVariant,
) => void;

const listeners: Set<Listener> =
  new Set();

export function showNotification(
  title: string,
  message: string,
  variant: NotificationVariant = "default",
) {
  listeners.forEach(
    (listener) =>
      listener(
        title,
        message,
        variant,
      ),
  );
}

export function NotificationStack() {
  const [
    toasts,
    setToasts,
  ] =
    useState<Toast[]>([]);

  const addToast =
    useCallback(
      (
        title: string,
        message: string,
        variant:
          NotificationVariant =
            "default",
      ) => {
        const id =
          ++toastId;

        setToasts(
          (previous) => [
            ...previous,
            {
              id,
              title,
              message,
              variant,
              leaving: false,
            },
          ],
        );

        setTimeout(() => {
          setToasts(
            (previous) =>
              previous.map(
                (toast) =>
                  toast.id === id
                    ? {
                        ...toast,
                        leaving: true,
                      }
                    : toast,
              ),
          );

          setTimeout(() => {
            setToasts(
              (previous) =>
                previous.filter(
                  (toast) =>
                    toast.id !== id,
                ),
            );
          }, 300);
        }, 2500);
      },
      [],
    );

  useEffect(() => {
    listeners.add(addToast);

    return () => {
      listeners.delete(
        addToast,
      );
    };
  }, [addToast]);

  return (
    <div
      className="notification-stack"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map(
        (toast) => {
          const Icon =
            toast.variant ===
            "cart"
              ? Box
              : CheckCircle;

          return (
            <div
              key={toast.id}
              className={
                toast.leaving
                  ? "notification-toast-out"
                  : "notification-toast-in"
              }
            >
              <div
                className={[
                  "notification-toast",
                  `notification-toast--${toast.variant}`,
                ].join(" ")}
                role="status"
              >
                <div className="notification-toast-icon">
                  <Icon className="w-5 h-5" />
                </div>

                <div className="notification-toast-content">
                  <span>
                    {toast.title}
                  </span>

                  <p>
                    {toast.message}
                  </p>
                </div>
              </div>
            </div>
          );
        },
      )}
    </div>
  );
}
