import React, { useEffect } from "react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  autoCloseTime?: number; // tiempo en milisegundos
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  autoCloseTime = 3000,
}) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseTime);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, autoCloseTime]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-4 border-teal-500 rounded-lg p-8 max-w-sm w-full mx-4 text-center shadow-2xl transform transition-all duration-300 scale-100">
        <h3 className="text-2xl font-bold text-teal-600 mb-2">
          ¡Bienvenido/a!
        </h3>
        <p className="text-gray-700 mb-1">Tu registro se completó</p>
        <p className="text-gray-700">correctamente.</p>
      </div>
    </div>
  );
};
