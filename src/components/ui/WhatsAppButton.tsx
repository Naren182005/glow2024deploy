import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  message = "Submit your order in WhatsApp",
  className = "",
  size = 'md',
  variant = 'primary',
  fullWidth = false
}) => {
  const whatsappNumber = "+919363717744";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'bg-green-500 hover:bg-green-600 text-white',
    secondary: 'bg-green-100 hover:bg-green-200 text-green-800 border border-green-300'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  return (
    <div className={`text-center ${className}`}>
      {message && (
        <p className="text-white/80 text-sm mb-3">{message}</p>
      )}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${fullWidth ? 'w-full' : 'inline-flex'}
          rounded-lg font-medium transition-colors 
          flex items-center justify-center space-x-2
          hover:shadow-lg transform hover:scale-105 transition-all duration-200
        `}
      >
        <MessageCircle size={iconSizes[size]} />
        <span>WhatsApp Order</span>
      </a>
    </div>
  );
};

export default WhatsAppButton;
