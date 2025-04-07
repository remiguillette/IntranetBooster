import { FC } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PaymentSuccess: FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md bg-[#242424]">
        <CardContent className="pt-6 flex flex-col items-center text-center p-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg 
              className="w-8 h-8 text-green-500"
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-primary mb-2">Paiement Réussi!</h1>
          
          <p className="text-gray-300 mb-4">
            Merci pour votre achat. Votre paiement a été traité avec succès.
          </p>
          
          <div className="border border-gray-700 rounded-lg p-4 mb-6 w-full">
            <div className="flex justify-between mb-2">
              <span className="text-gray-300">Numéro de commande:</span>
              <span className="text-primary font-medium">ORD-{Math.floor(100000 + Math.random() * 900000)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-300">Date:</span>
              <span className="text-gray-300">{new Date().toLocaleDateString('fr-CA')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Montant total:</span>
              <span className="text-primary font-medium">94,49 $CAN</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-300 mb-6">
            Un reçu de confirmation a été envoyé à votre adresse email.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center p-6 pt-0">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/">
              Retour à l'accueil
            </Link>
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            Voir les détails de la commande
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
