import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Copy, Send } from 'lucide-react';

const invoiceFormSchema = z.object({
  customerName: z.string().min(2, "Le nom du client est requis"),
  customerEmail: z.string().email("Adresse email invalide"),
  productName: z.string().min(2, "Nom du produit requis"),
  productDescription: z.string().optional(),
  amount: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Le montant doit être un nombre positif"
  }),
  quantity: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0 && Number.isInteger(Number(val)), {
    message: "La quantité doit être un nombre entier positif"
  }),
});

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

interface InvoiceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const InvoiceForm: FC<InvoiceFormProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [isEmailSending, setIsEmailSending] = useState(false);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      productName: '',
      productDescription: '',
      amount: '',
      quantity: '1',
    },
  });

  const handleSubmit = async (values: InvoiceFormValues) => {
    setIsSubmitting(true);
    try {
      const subtotal = Number(values.amount) * Number(values.quantity);
      const tax = subtotal * 0.05; // 5% tax rate
      const total = subtotal + tax;
      
      const response = await apiRequest('POST', '/api/admin/invoices/create', {
        customerName: values.customerName,
        customerEmail: values.customerEmail,
        items: [
          {
            name: values.productName,
            description: values.productDescription,
            price: Number(values.amount),
            quantity: Number(values.quantity)
          }
        ],
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de la création de la facture");
      }

      const data = await response.json();
      setPaymentLink(data.paymentLink);
      
      toast({
        title: "Facture créée",
        description: "Le lien de paiement a été généré avec succès",
      });

      // Update the payments list
      queryClient.invalidateQueries({ queryKey: ['/api/admin/payments'] });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    if (paymentLink) {
      navigator.clipboard.writeText(paymentLink);
      toast({
        title: "Lien copié",
        description: "Le lien de paiement a été copié dans le presse-papiers",
      });
    }
  };

  const handleSendEmail = async () => {
    if (!paymentLink) return;
    
    setIsEmailSending(true);
    try {
      const customerEmail = form.getValues("customerEmail");
      const response = await apiRequest('POST', '/api/admin/invoices/send-email', {
        email: customerEmail,
        paymentLink
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de l'envoi de l'email");
      }

      toast({
        title: "Email envoyé",
        description: `Le lien de paiement a été envoyé à ${customerEmail}`,
      });

      // Close the dialog after successful email send
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'envoi de l'email",
        variant: "destructive",
      });
    } finally {
      setIsEmailSending(false);
    }
  };

  const resetForm = () => {
    form.reset();
    setPaymentLink(null);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        resetForm();
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="bg-[#242424] text-gray-300 border-gray-700 sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-primary">Créer une facture</DialogTitle>
          <DialogDescription className="text-gray-400">
            Créez une facture et générez un lien de paiement comme PayPal.
          </DialogDescription>
        </DialogHeader>

        {!paymentLink ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Nom du client</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nom du client"
                            className="bg-[#121212] border-gray-700 text-gray-300"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Email du client</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="client@exemple.com"
                            className="bg-[#121212] border-gray-700 text-gray-300"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Produit/Service</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nom du produit ou service"
                          className="bg-[#121212] border-gray-700 text-gray-300"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="productDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Description (optionnelle)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Description du produit ou service"
                          className="bg-[#121212] border-gray-700 text-gray-300 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Prix unitaire (CAD)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="0.00"
                            className="bg-[#121212] border-gray-700 text-gray-300"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Quantité</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            step="1"
                            placeholder="1"
                            className="bg-[#121212] border-gray-700 text-gray-300"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-primary text-black hover:bg-primary/90 w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    "Générer le lien de paiement"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <div className="bg-[#121212] p-4 rounded-md border border-gray-700">
              <p className="text-sm text-gray-400 mb-2">Lien de paiement :</p>
              <div className="flex items-center justify-between">
                <p className="text-primary font-mono text-sm break-all mr-2">{paymentLink}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-shrink-0 text-primary border-primary hover:bg-primary/10"
                  onClick={handleCopyLink}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-400">Utiliser ce lien :</p>
              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-primary text-black hover:bg-primary/90"
                  onClick={handleSendEmail}
                  disabled={isEmailSending}
                >
                  {isEmailSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Envoyer par email
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-gray-700 text-gray-300 hover:bg-[#333]"
                  onClick={() => onOpenChange(false)}
                >
                  Fermer
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};