import { FC, useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { PaymentFormValues } from '@shared/schema';
import { formatCardNumber, formatExpiryDate } from '@/lib/validators';

interface CreditCardFormProps {
  form: UseFormReturn<PaymentFormValues>;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const CreditCardForm: FC<CreditCardFormProps> = ({ form, onSubmit, isSubmitting }) => {
  const [cardType, setCardType] = useState<string | null>(null);
  
  // Detect card type based on card number
  const detectCardType = (cardNumber: string) => {
    const number = cardNumber.replace(/\D/g, '');
    
    // Simple regex patterns for card detection
    const patterns = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
      discover: /^6(?:011|5)/,
    };
    
    if (patterns.visa.test(number)) return 'visa';
    if (patterns.mastercard.test(number)) return 'mastercard';
    if (patterns.amex.test(number)) return 'amex';
    if (patterns.discover.test(number)) return 'discover';
    
    return null;
  };
  
  // Update card type when card number changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'cardNumber') {
        const type = detectCardType(value.cardNumber as string);
        setCardType(type);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);
  
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4 mt-6">
        {/* Cardholder name */}
        <FormField
          control={form.control}
          name="cardName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Nom sur la carte</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Jean Dupont" 
                  className="bg-[#121212] border-gray-700 text-gray-300"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Card number */}
        <FormField
          control={form.control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Numéro de carte</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    placeholder="1234 5678 9012 3456" 
                    className={`bg-[#121212] border-gray-700 text-gray-300 
                    ${cardType ? `bg-[url('/card-icons/${cardType}.svg')] bg-no-repeat bg-right-8 bg-[length:40px_25px] pr-12` : ''}`}
                    maxLength={19}
                    {...field}
                    onChange={(e) => {
                      const formatted = formatCardNumber(e.target.value);
                      field.onChange(formatted);
                    }}
                  />
                  <svg 
                    className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
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
                </div>
              </FormControl>
              <FormDescription className="text-xs text-gray-400">
                Format: XXXX XXXX XXXX XXXX
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Expiration date and CVV */}
        <div className="flex flex-col sm:flex-row gap-4">
          <FormField
            control={form.control}
            name="cardExpiry"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-gray-300">Date d'expiration</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="MM/AA" 
                    className="bg-[#121212] border-gray-700 text-gray-300"
                    maxLength={5}
                    {...field}
                    onChange={(e) => {
                      const formatted = formatExpiryDate(e.target.value);
                      field.onChange(formatted);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cardCvv"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-gray-300">CVV</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      placeholder="123" 
                      className="bg-[#121212] border-gray-700 text-gray-300"
                      maxLength={4}
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        field.onChange(value);
                      }}
                    />
                    <svg 
                      className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-help"
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      title="Le code de sécurité à 3 chiffres au dos de votre carte"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Billing address */}
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Adresse de facturation</h3>
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel className="text-gray-300">Adresse</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="123 rue des Érables" 
                    className="bg-[#121212] border-gray-700 text-gray-300"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex flex-col sm:flex-row gap-4 mb-3">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-gray-300">Ville</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Montréal" 
                      className="bg-[#121212] border-gray-700 text-gray-300"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-gray-300">Code postal</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="H1A 1B2" 
                      className="bg-[#121212] border-gray-700 text-gray-300"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel className="text-gray-300">Province</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-[#121212] border-gray-700 text-gray-300">
                      <SelectValue placeholder="Sélectionnez une province" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-[#242424] border-gray-700">
                    <SelectItem value="AB">Alberta</SelectItem>
                    <SelectItem value="BC">Colombie-Britannique</SelectItem>
                    <SelectItem value="MB">Manitoba</SelectItem>
                    <SelectItem value="NB">Nouveau-Brunswick</SelectItem>
                    <SelectItem value="NL">Terre-Neuve-et-Labrador</SelectItem>
                    <SelectItem value="NS">Nouvelle-Écosse</SelectItem>
                    <SelectItem value="NT">Territoires du Nord-Ouest</SelectItem>
                    <SelectItem value="NU">Nunavut</SelectItem>
                    <SelectItem value="ON">Ontario</SelectItem>
                    <SelectItem value="PE">Île-du-Prince-Édouard</SelectItem>
                    <SelectItem value="QC">Québec</SelectItem>
                    <SelectItem value="SK">Saskatchewan</SelectItem>
                    <SelectItem value="YT">Yukon</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Terms and conditions */}
        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-6">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm text-gray-300">
                  J'accepte les <a href="#" className="text-primary hover:underline">conditions générales</a> et la{' '}
                  <a href="#" className="text-primary hover:underline">politique de confidentialité</a>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        
        {/* Submit button */}
        <Button 
          type="submit" 
          className="w-full bg-primary text-black font-medium h-12"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Traitement en cours...
            </>
          ) : (
            'Payer maintenant'
          )}
        </Button>
      </form>
    </Form>
  );
};
