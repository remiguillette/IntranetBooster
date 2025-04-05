import { useState, useEffect } from 'react';
import { X, AlertTriangle, AlertCircle, Info } from 'lucide-react';

type AlertType = 'danger' | 'warning' | 'success';

interface AlertBannerProps {
  type: AlertType;
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function AlertBanner({ type, message, isVisible, onClose }: AlertBannerProps) {
  if (!isVisible) return null;

  const getBackgroundColor = () => {
    switch (type) {
      case 'danger':
        return 'bg-[#ff4444]';
      case 'warning':
        return 'bg-[#ffbb33]';
      case 'success':
        return 'bg-[#00C851]';
      default:
        return 'bg-[#ffbb33]';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <AlertCircle className="mr-2" />;
      case 'warning':
        return <AlertTriangle className="mr-2" />;
      case 'success':
        return <Info className="mr-2" />;
      default:
        return <AlertTriangle className="mr-2" />;
    }
  };

  return (
    <div className={`fixed top-0 left-0 w-full p-4 z-50 flex items-center justify-between text-black ${getBackgroundColor()}`}>
      <div className="flex items-center">
        {getIcon()}
        <span className="text-xl font-bold">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="px-2 py-1 rounded-md bg-opacity-20 bg-black hover:bg-opacity-30"
      >
        <X />
      </button>
    </div>
  );
}
