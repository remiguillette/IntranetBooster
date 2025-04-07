import { FC, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Payment } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { InvoiceForm } from './invoice-form';

export const AdminDashboard: FC = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [isInvoiceFormOpen, setIsInvoiceFormOpen] = useState(false);

  // Fetch payments
  const { data: payments, isLoading, error, refetch } = useQuery<Payment[]>({
    queryKey: ['/api/admin/payments'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/admin/payments');
      if (!res.ok) {
        throw new Error('Failed to fetch payments');
      }
      const data = await res.json();
      return data.payments;
    }
  });

  const handleLogout = () => {
    // Clear admin session
    apiRequest('POST', '/api/admin/logout')
      .then(() => {
        toast({
          title: 'Déconnexion réussie',
          description: 'Vous avez été déconnecté de l\'interface d\'administration'
        });
        navigate('/admin');
      })
      .catch((error) => {
        toast({
          title: 'Erreur de déconnexion',
          description: 'Une erreur est survenue lors de la déconnexion',
          variant: 'destructive'
        });
      });
  };

  // Generate payment link
  const handleGeneratePaymentLink = async (orderId: number) => {
    try {
      const response = await apiRequest('POST', `/api/admin/orders/${orderId}/generate-link`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la génération du lien de paiement');
      }
      
      const data = await response.json();
      
      // Copy the link to clipboard
      await navigator.clipboard.writeText(data.paymentLink);
      
      toast({
        title: 'Lien de paiement généré',
        description: 'Le lien a été copié dans le presse-papiers'
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: 'destructive'
      });
    }
  };

  // Send payment email
  const handleSendPaymentEmail = async (orderId: number) => {
    try {
      const response = await apiRequest('POST', `/api/admin/orders/${orderId}/send-email`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi de l\'email');
      }
      
      toast({
        title: 'Email envoyé',
        description: 'L\'email de paiement a été envoyé avec succès'
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: 'destructive'
      });
    }
  };

  // Filter payments
  const filteredPayments = payments?.filter(payment => {
    let matchesSearch = true;
    let matchesStatus = true;
    
    // Apply search filter
    if (searchTerm) {
      matchesSearch = 
        payment.id.toString().includes(searchTerm) || 
        payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.amount.toString().includes(searchTerm);
    }
    
    // Apply status filter
    if (filterStatus) {
      matchesStatus = payment.status === filterStatus;
    }
    
    return matchesSearch && matchesStatus;
  });

  // Format date
  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Formulaire de création de facture (style PayPal) */}
        <InvoiceForm open={isInvoiceFormOpen} onOpenChange={setIsInvoiceFormOpen} />
        
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary">Tableau de bord administrateur</h1>
          <div className="flex gap-3">
            <Button 
              onClick={() => setIsInvoiceFormOpen(true)}
              className="bg-primary text-black hover:bg-primary/90"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-4 w-4 mr-2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
                <path d="M12 16v-3"></path>
                <path d="M12 16h3"></path>
              </svg>
              Créer une facture
            </Button>
            <Button onClick={handleLogout} variant="outline" className="text-gray-300 border-gray-700">
              Déconnexion
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-[#242424]">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-300 text-sm font-medium">Total des paiements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">
                {payments?.length || 0}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#242424]">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-300 text-sm font-medium">Montant total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">
                {payments
                  ? new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' })
                      .format(payments.reduce((sum, payment) => sum + Number(payment.amount), 0))
                  : '$0.00 CAD'}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#242424]">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-300 text-sm font-medium">Paiements réussis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">
                {payments
                  ? payments.filter(payment => payment.status === 'completed').length
                  : 0}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[#242424] mb-6">
          <CardHeader>
            <CardTitle className="text-primary">Gestion des paiements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Rechercher par ID, transaction ou montant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#121212] border-gray-700 text-gray-300"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="text-gray-300 border-gray-700">
                    Filtrer par statut {filterStatus ? `(${filterStatus})` : ''}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#242424] border-gray-700">
                  <DropdownMenuLabel className="text-gray-300">Statut du paiement</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem 
                    className="text-gray-300 focus:bg-[#333333] focus:text-gray-100"
                    onClick={() => setFilterStatus(null)}
                  >
                    Tous
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-gray-300 focus:bg-[#333333] focus:text-gray-100"
                    onClick={() => setFilterStatus('completed')}
                  >
                    Complété
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-gray-300 focus:bg-[#333333] focus:text-gray-100"
                    onClick={() => setFilterStatus('pending')}
                  >
                    En attente
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-gray-300 focus:bg-[#333333] focus:text-gray-100"
                    onClick={() => setFilterStatus('failed')}
                  >
                    Échoué
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                variant="outline" 
                className="text-gray-300 border-gray-700"
                onClick={() => refetch()}
              >
                Actualiser
              </Button>
            </div>

            {isLoading ? (
              <div className="text-center p-6">
                <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-300">Chargement des paiements...</p>
              </div>
            ) : error ? (
              <div className="text-center p-6 text-red-500">
                Une erreur est survenue lors du chargement des paiements.
              </div>
            ) : filteredPayments && filteredPayments.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">ID</TableHead>
                      <TableHead className="text-gray-300">Date</TableHead>
                      <TableHead className="text-gray-300">Transaction</TableHead>
                      <TableHead className="text-gray-300">Méthode</TableHead>
                      <TableHead className="text-gray-300">Montant</TableHead>
                      <TableHead className="text-gray-300">Statut</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id} className="border-gray-700">
                        <TableCell className="text-gray-300">{payment.id}</TableCell>
                        <TableCell className="text-gray-300">{payment.createdAt ? formatDate(payment.createdAt) : '-'}</TableCell>
                        <TableCell className="text-gray-300 font-mono">{payment.transactionId || '-'}</TableCell>
                        <TableCell className="text-gray-300">
                          {payment.paymentMethod === 'creditCard' ? 'Carte de crédit' : 'PayPal'}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {new Intl.NumberFormat('fr-CA', { style: 'currency', currency: payment.currency || 'CAD' })
                            .format(Number(payment.amount))}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium 
                            ${payment.status === 'completed' ? 'bg-green-900 text-green-300' : 
                             payment.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                             'bg-red-900 text-red-300'}`}>
                            {payment.status === 'completed' ? 'Complété' : 
                             payment.status === 'pending' ? 'En attente' : 'Échoué'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0 text-gray-300">
                                <span className="sr-only">Menu</span>
                                <svg 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  viewBox="0 0 24 24" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  strokeWidth="2" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  className="h-4 w-4"
                                >
                                  <circle cx="12" cy="12" r="1" />
                                  <circle cx="12" cy="5" r="1" />
                                  <circle cx="12" cy="19" r="1" />
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-[#242424] border-gray-700">
                              <DropdownMenuLabel className="text-gray-300">Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-gray-700" />
                              <DropdownMenuItem 
                                className="text-gray-300 focus:bg-[#333333] focus:text-gray-100"
                                onClick={() => handleGeneratePaymentLink(payment.orderId)}
                              >
                                Générer un lien de paiement
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-gray-300 focus:bg-[#333333] focus:text-gray-100"
                                onClick={() => handleSendPaymentEmail(payment.orderId)}
                              >
                                Envoyer par email
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-gray-700" />
                              <DropdownMenuItem 
                                className="text-gray-300 focus:bg-[#333333] focus:text-gray-100"
                                onClick={() => navigate(`/admin/payments/${payment.id}`)}
                              >
                                Voir les détails
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center p-6 text-gray-300">
                Aucun paiement trouvé.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};