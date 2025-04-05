import { FC } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PaymentMethodSelector } from "@/components/payment/payment-method-selector";
import { CreditCardForm } from "@/components/payment/credit-card-form";
import { OrderSummary } from "@/components/payment/order-summary";
import { PaymentLogos } from "@/components/payment/payment-logos";
import { useToast } from "@/hooks/use-toast";
import { usePaymentForm } from "@/hooks/use-payment-form";

const PaymentPage: FC = () => {
  const { toast } = useToast();
  const { form, isSubmitting, onSubmit, paymentMethod, setPaymentMethod } = usePaymentForm();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header with security indicators */}
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center mb-2">
          <svg 
            className="w-5 h-5 mr-2 text-green-500"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <h1 className="text-2xl font-semibold text-primary">Paiement Sécurisé</h1>
        </div>
        <p className="text-sm text-text-light opacity-80 flex items-center justify-center">
          <svg 
            className="w-4 h-4 mr-1 text-green-500"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          Connexion sécurisée SSL - Toutes vos données sont protégées
        </p>
      </header>

      {/* Main content area */}
      <main>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Payment form section */}
          <div className="w-full md:w-2/3">
            <Card className="bg-[#242424]">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6 text-primary">Informations de paiement</h2>
                
                {/* Payment method selection */}
                <PaymentMethodSelector 
                  selectedMethod={paymentMethod} 
                  onSelectMethod={setPaymentMethod} 
                />
                
                {/* Credit card form */}
                {paymentMethod === "creditCard" && (
                  <CreditCardForm 
                    form={form} 
                    onSubmit={onSubmit} 
                    isSubmitting={isSubmitting}
                  />
                )}
                
                {/* PayPal button (would be replaced with actual PayPal button in production) */}
                {paymentMethod === "paypal" && (
                  <div className="mt-6 text-center">
                    <button 
                      className="w-full bg-[#0070ba] text-white font-medium py-3 px-4 rounded-md hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0070ba] mb-4"
                      onClick={() => {
                        toast({
                          title: "Redirection vers PayPal",
                          description: "Vous allez être redirigé vers PayPal pour compléter votre paiement."
                        });
                      }}
                    >
                      <div className="flex items-center justify-center">
                        <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.067 8.478c.492.876.76 1.894.76 3.057 0 3.351-2.741 5.966-6.303 5.966-3.596 0-6.5-2.83-6.5-6.289 0-3.46 2.904-6.29 6.5-6.29.957 0 1.863.207 2.674.56-1.48-1.439-3.476-2.312-5.674-2.312-4.485 0-8.124 3.589-8.124 8.023 0 4.434 3.639 8.023 8.124 8.023 4.485 0 8.124-3.589 8.124-8.023 0-.969-.184-1.899-.521-2.751l.94.036z" />
                          <path d="M8.303 9.302c-.687 0-1.248.534-1.248 1.193 0 .658.561 1.193 1.248 1.193h3.643c1.128 0 2.044.903 2.044 2.017l.005.058v.972c0 1.114-.916 2.017-2.044 2.017h-6.353a.624.624 0 01-.624-.596l-.001-.181c0-.44.358-.795.8-.795h5.605a.624.624 0 00.624-.596l.001-.181v-.35a.624.624 0 00-.574-.596l-.051-.005h-5.605c-1.128 0-2.044-.902-2.044-2.016v-.973c0-1.114.916-2.017 2.044-2.017h6.353a.624.624 0 01.624.596l.001.18c0 .44-.358.796-.8.796h-5.605a.624.624 0 00-.624.596l-.001.181v.349a.624.624 0 00.574.596l.051.005h5.605c1.128 0 2.044.903 2.044 2.017v.973c0 1.114-.916 2.017-2.044 2.017h-6.353a.624.624 0 01-.624-.596l-.001-.181c0-.44.358-.795.8-.795h5.605a.624.624 0 00.624-.596l.001-.181v-.35a.624.624 0 00-.574-.596l-.051-.005h-6.394z" />
                        </svg>
                        Payer avec PayPal
                      </div>
                    </button>
                    <p className="text-sm text-gray-300">
                      Vous serez redirigé vers PayPal pour finaliser votre paiement en toute sécurité.
                    </p>
                  </div>
                )}
                
                {/* Logos de paiement et badges de sécurité */}
                <PaymentLogos />
              </CardContent>
            </Card>
          </div>
          
          {/* Order summary section */}
          <div className="w-full md:w-1/3">
            <OrderSummary />
            
            {/* Payment help section */}
            <Card className="mt-6 bg-[#242424]">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3 text-primary">Besoin d'aide?</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="flex items-center text-gray-300 hover:text-primary">
                      <svg 
                        className="w-4 h-4 mr-2"
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                      FAQ sur les paiements
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center text-gray-300 hover:text-primary">
                      <svg 
                        className="w-4 h-4 mr-2"
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                      Contacter le support
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center text-gray-300 hover:text-primary">
                      <svg 
                        className="w-4 h-4 mr-2"
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                      Politique de sécurité
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      {/* Footer with additional security information */}
      <footer className="mt-12 text-center text-sm text-gray-300 opacity-80">
        <div className="mb-4 flex flex-wrap justify-center gap-4">
          <a href="#" className="hover:text-primary">Conditions d'utilisation</a>
          <a href="#" className="hover:text-primary">Politique de confidentialité</a>
          <a href="#" className="hover:text-primary">Sécurité</a>
          <a href="#" className="hover:text-primary">Modes de paiement</a>
        </div>
        <p className="mb-2 flex items-center justify-center">
          <svg 
            className="w-4 h-4 mr-1"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          Toutes les transactions sont sécurisées et cryptées
        </p>
        <p>
          © {new Date().getFullYear()} Company Name. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
};

export default PaymentPage;
