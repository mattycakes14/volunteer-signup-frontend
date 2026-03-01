"use client";
import { useEffect } from "react";
import { CircleCheck } from "lucide-react";
import styles from "@/components/admin/Toast.module.css";

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

const Toast = ({ message, onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={styles.toast}>
      <CircleCheck size={16} />
      {message}
    </div>
  );
};

export default Toast;
