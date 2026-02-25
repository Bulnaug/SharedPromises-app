import type { ReactNode } from "react";

type ModalProps = {
  children: ReactNode;
  onClose: () => void;
};

export function Modal({ children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* content */}
      <div className="relative z-10 w-full max-w-sm rounded-xl bg-white dark:bg-gray-950 dark:border-gray-800 p-4 shadow-lg">
        {children}
      </div>
    </div>
  );
}
