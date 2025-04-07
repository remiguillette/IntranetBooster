import { FC, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent, 
  DialogTitle, 
  DialogHeader,
  DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

// Sample order items (would be fetched from an API in production)
const orderItems: OrderItem[] = [
  {
    name: 'Produit exemple',
    quantity: 1,
    price: 89.99
  }
];

// Calculate subtotal
const subtotal = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
// Calculate tax (5%)
const tax = subtotal * 0.05;
// Calculate total
const total = subtotal + tax;

// Format price in CAD
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    currencyDisplay: 'symbol',
  }).format(price);
};

export const OrderSummary: FC = () => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isLinkGenerated, setIsLinkGenerated] = useState(false);
  const [paymentLink, setPaymentLink] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // In a real app, this would use the actual order ID from a created order
  const orderId = 1;

  const handleGenerateLink = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to generate payment link
      // In a real app, this would call the actual API endpoint
      const response = await apiRequest('POST', `/api/payments/generate-link`, {
        orderId,
        items: orderItems,
        total
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la génération du lien de paiement');
      }
      
      const data = await response.json();
      setPaymentLink(data.paymentLink || `${window.location.origin}/?order=${orderId}&token=sample-token-123456`);
      setIsLinkGenerated(true);
      
      toast({
        title: 'Lien généré',
        description: 'Le lien de paiement a été généré avec succès',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de générer le lien de paiement',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(paymentLink);
    toast({
      title: 'Lien copié',
      description: 'Le lien de paiement a été copié dans le presse-papiers',
    });
  };

  const handleSendEmail = async () => {
    if (!email) {
      toast({
        title: 'Erreur',
        description: 'Veuillez entrer une adresse email valide',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call to send email
      // In a real app, this would call the actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Email envoyé',
        description: `Le lien de paiement a été envoyé à ${email}`,
      });
      
      setIsShareDialogOpen(false);
      setEmail('');
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer l\'email',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="bg-[#242424]">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-primary">Résumé de la commande</h2>
          
          {/* Order items */}
          <div className="space-y-3 mb-4">
            {orderItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center pb-2 border-b border-gray-700">
                <div>
                  <p className="text-gray-300">{item.name}</p>
                  <p className="text-xs text-gray-300 opacity-70">Quantité: {item.quantity}</p>
                </div>
                <p className="text-gray-300">{formatPrice(item.price)}</p>
              </div>
            ))}
          </div>
          
          {/* Price breakdown */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-300">Sous-total</span>
              <span className="text-gray-300">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">TPS/TVH (5%)</span>
              <span className="text-gray-300">{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Livraison</span>
              <span className="text-gray-300">Gratuit</span>
            </div>
          </div>
          
          {/* Total */}
          <div className="flex justify-between pt-3 border-t border-gray-700 mb-4">
            <span className="text-lg font-semibold text-primary">Total</span>
            <span className="text-lg font-semibold text-primary">{formatPrice(total)}</span>
          </div>
          
          {/* Payment link generation button */}
          <div className="mt-4">
            <Button 
              variant="outline" 
              className="w-full text-primary border-primary hover:bg-primary/10"
              onClick={() => setIsShareDialogOpen(true)}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              Partager la commande
            </Button>
          </div>
          
          {/* Return policy */}
          <div className="mt-6 p-3 bg-[#121212] rounded-md border border-gray-700">
            <p className="text-sm text-gray-300 flex items-start">
              <svg 
                className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0"
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <span>
                Questions sur votre commande? Consultez notre{' '}
                <a href="#" className="text-primary hover:underline">politique de retour</a> ou{' '}
                <a href="#" className="text-primary hover:underline">contactez-nous</a>.
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Share Payment Link Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="bg-[#242424] text-gray-300 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-primary">Partager cette commande</DialogTitle>
            <DialogDescription className="text-gray-400">
              Générez un lien de paiement que vous pouvez partager ou envoyer par email.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {!isLinkGenerated ? (
              <Button 
                onClick={handleGenerateLink} 
                className="w-full bg-primary text-black hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg 
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      ></circle>
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Génération en cours...
                  </>
                ) : (
                  'Générer un lien de paiement'
                )}
              </Button>
            ) : (
              <>
                <div className="flex items-center space-x-2">
                  <Input 
                    value={paymentLink} 
                    readOnly 
                    className="bg-[#121212] border-gray-700 text-gray-300"
                  />
                  <Button 
                    onClick={handleCopyLink} 
                    variant="outline" 
                    className="flex-shrink-0 text-primary border-primary hover:bg-primary/10"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </Button>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-400">
                    Envoyer par email
                  </label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      id="email"
                      placeholder="adresse@email.com" 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-[#121212] border-gray-700 text-gray-300"
                    />
                    <Button 
                      onClick={handleSendEmail} 
                      variant="outline"
                      disabled={isLoading}
                      className="flex-shrink-0 text-primary border-primary hover:bg-primary/10"
                    >
                      {isLoading ? (
                        <svg 
                          className="animate-spin h-4 w-4" 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24"
                        >
                          <circle 
                            className="opacity-25" 
                            cx="12" 
                            cy="12" 
                            r="10" 
                            stroke="currentColor" 
                            strokeWidth="4"
                          ></circle>
                          <path 
                            className="opacity-75" 
                            fill="currentColor" 
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
