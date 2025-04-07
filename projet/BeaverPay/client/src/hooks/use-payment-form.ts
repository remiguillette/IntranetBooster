import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { 
  PaymentFormValues, 
  paymentFormSchema 
} from '@shared/schema';
import { extendedPaymentFormSchema } from '@/lib/validators';

export function usePaymentForm() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'creditCard' | 'paypal'>('creditCard');
  
  // Form with validation
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(extendedPaymentFormSchema),
    defaultValues: {
      paymentMethod: 'creditCard',
      cardName: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvv: '',
      address: '',
      city: '',
      postalCode: '',
      province: '',
      acceptTerms: false,
    },
    mode: 'onBlur'
  });

  // Handle form submission
  const onSubmit = async (values: PaymentFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Clean card number - remove spaces and non-numeric characters
      const cleanedCardNumber = values.cardNumber.replace(/\D/g, '');
      
      // API call to process payment
      const response = await apiRequest('POST', '/api/payments/process', {
        ...values,
        cardNumber: cleanedCardNumber,
        currency: 'CAD'
      });
      
      if (!response.ok) {
        throw new Error('Payment processing failed');
      }
      
      const result = await response.json();
      
      toast({
        title: "Paiement réussi",
        description: "Votre paiement a été traité avec succès.",
      });
      
      // Redirect to success page
      navigate('/payment-success');
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Erreur de paiement",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors du traitement du paiement.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
    paymentMethod,
    setPaymentMethod
  };
}
