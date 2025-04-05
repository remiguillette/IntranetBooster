import { FC } from 'react';

interface PaymentMethodSelectorProps {
  selectedMethod: 'creditCard' | 'paypal';
  onSelectMethod: (method: 'creditCard' | 'paypal') => void;
}

export const PaymentMethodSelector: FC<PaymentMethodSelectorProps> = ({ 
  selectedMethod, 
  onSelectMethod 
}) => {
  return (
    <div className="mb-8">
      <p className="text-sm text-gray-300 mb-3">Choisissez votre méthode de paiement</p>
      <div className="flex flex-wrap gap-3">
        {/* Credit card option */}
        <label className={`flex items-center p-3 border rounded-md bg-[#121212] cursor-pointer group hover:bg-opacity-80 transition-colors
          ${selectedMethod === 'creditCard' 
            ? 'border-primary' 
            : 'border-gray-700'}`}
        >
          <input 
            type="radio" 
            name="paymentMethod" 
            value="creditCard" 
            checked={selectedMethod === 'creditCard'}
            onChange={() => onSelectMethod('creditCard')}
            className="mr-3" 
          />
          <svg 
            className="w-5 h-5 mr-2 text-gray-300"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
            <line x1="1" y1="10" x2="23" y2="10"></line>
          </svg>
          <span className="text-gray-300">Carte de crédit</span>
        </label>
        
        {/* PayPal option */}
        <label className={`flex items-center p-3 border rounded-md bg-[#121212] cursor-pointer group hover:bg-opacity-80 transition-colors
          ${selectedMethod === 'paypal' 
            ? 'border-primary' 
            : 'border-gray-700'}`}
        >
          <input 
            type="radio" 
            name="paymentMethod" 
            value="paypal" 
            checked={selectedMethod === 'paypal'}
            onChange={() => onSelectMethod('paypal')}
            className="mr-3" 
          />
          <svg 
            className="w-5 h-5 mr-2 text-gray-300"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M20.067 8.478c.492.876.76 1.894.76 3.057 0 3.351-2.741 5.966-6.303 5.966-3.596 0-6.5-2.83-6.5-6.289 0-3.46 2.904-6.29 6.5-6.29.957 0 1.863.207 2.674.56-1.48-1.439-3.476-2.312-5.674-2.312-4.485 0-8.124 3.589-8.124 8.023 0 4.434 3.639 8.023 8.124 8.023 4.485 0 8.124-3.589 8.124-8.023 0-.969-.184-1.899-.521-2.751l.94.036z"></path>
          </svg>
          <span className="text-gray-300">PayPal</span>
        </label>
      </div>
    </div>
  );
};
