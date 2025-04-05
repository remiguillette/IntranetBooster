import { useState } from "react";
import { MobileHeader } from "@/components/layout/mobile-header";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  FileText, 
  Calendar, 
  AlertTriangle, 
  TrendingUp, 
  BarChart3, 
  Users, 
  CheckCircle
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Données pour les graphiques
  const clientTypeData = [
    { name: "Particuliers", value: 85, color: "#f89422" },
    { name: "Entreprises", value: 15, color: "#3b82f6" },
  ];

  const documentStatusData = [
    { name: "Complets", value: 65, color: "#22c55e" },
    { name: "Incomplets", value: 35, color: "#f43f5e" },
  ];

  const monthlyData = [
    { name: "Jan", clients: 12, documents: 18 },
    { name: "Fév", clients: 19, documents: 28 },
    { name: "Mar", clients: 15, documents: 22 },
    { name: "Avr", clients: 25, documents: 31 },
    { name: "Mai", clients: 18, documents: 25 },
    { name: "Juin", clients: 21, documents: 30 },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <MobileHeader onOpenSidebar={() => setIsSidebarOpen(true)} />
      
      <main className="flex-1 overflow-y-auto bg-background pt-0 md:pt-0 mt-16 md:mt-0">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Tableau de Bord</h2>
              <p className="text-muted-foreground mt-1">Bienvenue sur Beavernet CRM</p>
            </div>
          </div>
          
          {/* Statistiques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Clients</p>
                  <p className="text-2xl font-bold">126</p>
                  <p className="text-success text-sm">↑ 12% ce mois</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="text-primary h-6 w-6" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Documents</p>
                  <p className="text-2xl font-bold">358</p>
                  <p className="text-success text-sm">↑ 5% ce mois</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <FileText className="text-primary h-6 w-6" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Rendez-vous</p>
                  <p className="text-2xl font-bold">38</p>
                  <p className="text-success text-sm">↑ 8% ce mois</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Calendar className="text-primary h-6 w-6" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Permis à renouveler</p>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-destructive text-sm">↑ 3 nouveaux</p>
                </div>
                <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                  <AlertTriangle className="text-destructive h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Graphiques */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activité mensuelle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--surface))', 
                          borderColor: 'hsl(var(--border))',
                          color: 'hsl(var(--foreground))'
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="clients" name="Clients" fill="#f89422" />
                      <Bar dataKey="documents" name="Documents" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Type de clients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={clientTypeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {clientTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--surface))', 
                            borderColor: 'hsl(var(--border))',
                            color: 'hsl(var(--foreground))'
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">État des documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={documentStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {documentStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--surface))', 
                            borderColor: 'hsl(var(--border))',
                            color: 'hsl(var(--foreground))'
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Listes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Permis à renouveler bientôt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <div key={index} className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs mr-3">
                          {["MD", "SL", "JD", "PG", "AC"][index - 1]}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {["Martin Dubois", "Sophie Leroy", "Jean Dupont", "Pierre Girard", "Anne Clerc"][index - 1]}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {["15/10/2023", "18/10/2023", "22/10/2023", "28/10/2023", "02/11/2023"][index - 1]}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-warning">
                        {["12", "15", "19", "25", "30"][index - 1]} jours
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activités récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <div key={index} className="flex items-start border-b border-border pb-2 last:border-0 last:pb-0">
                      <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center text-white ${
                        ["bg-primary", "bg-success", "bg-info", "bg-primary", "bg-success"][index - 1]
                      }`}>
                        {[<User key="1" className="h-4 w-4" />, 
                          <CheckCircle key="2" className="h-4 w-4" />, 
                          <FileText key="3" className="h-4 w-4" />, 
                          <User key="4" className="h-4 w-4" />, 
                          <CheckCircle key="5" className="h-4 w-4" />
                         ][index - 1]}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm">
                          {[
                            "Nouveau client ajouté",
                            "Document validé",
                            "Permis de conduire téléchargé",
                            "Fiche client mise à jour",
                            "Rendez-vous confirmé"
                          ][index - 1]}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {["Il y a 35 min", "Il y a 2h", "Hier, 14:25", "Hier, 9:12", "20/09/2023"][index - 1]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
