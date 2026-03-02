"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type PopupSize = "sm" | "md" | "lg" | "xl" | "full";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: PopupSize;
  backgroundStyle?: string;
  backgroundStyleInto?: string;
}

const sizeClasses: Record<PopupSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  full: "w-full h-full max-w-none",
};

export default function Popup({
  isOpen,
  onClose,
  children,
  size = "md",
  backgroundStyle = "bg-black/50",
  backgroundStyleInto = "bg-white",
}: PopupProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // 🔒 Bloquear scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ⌨️ Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // 👆 Click fuera
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      onMouseDown={handleOutsideClick}
      className={`fixed inset-0 z-50 flex items-center justify-center ${backgroundStyle} backdrop-blur-sm transition-opacity duration-300`}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        className={`
          relative w-full mx-4 ${backgroundStyleInto} rounded-2xl shadow-2xl
          ${sizeClasses[size]}
          transform transition-all duration-300
          scale-100 opacity-100
          animate-in fade-in zoom-in-95
          border border-gray-200
        `}
      >
        {/* ❌ Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
          aria-label="Cerrar"
        >
          ✕
        </button>

        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
