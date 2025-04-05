import { BarChart2, PieChart, LineChart, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Rapports() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Rapports</h1>
        <Button className="bg-primary">
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </div>

      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="activite">Activité</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clients">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Distribution par type</CardTitle>
                <CardDescription>Répartition des clients par type</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center h-60">
                <div className="text-center">
                  <PieChart className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground">
                    Fonctionnalité à venir
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Croissance</CardTitle>
                <CardDescription>Acquisition de clients dans le temps</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center h-60">
                <div className="text-center">
                  <LineChart className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground">
                    Fonctionnalité à venir
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Distribution par région</CardTitle>
                <CardDescription>Répartition géographique des clients</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center h-60">
                <div className="text-center">
                  <BarChart2 className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground">
                    Fonctionnalité à venir
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques des documents</CardTitle>
              <CardDescription>Vue d'ensemble des documents traités</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center h-60">
              <div className="text-center">
                <BarChart2 className="h-12 w-12 mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">
                  Fonctionnalité à venir
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activite">
          <Card>
            <CardHeader>
              <CardTitle>Journal d'activité</CardTitle>
              <CardDescription>Suivi des activités et interactions récentes</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center h-60">
              <div className="text-center">
                <LineChart className="h-12 w-12 mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">
                  Fonctionnalité à venir
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}