import { Calendar, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Calendrier() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Calendrier</h1>
        <Button className="bg-primary">
          <CalendarIcon className="h-4 w-4 mr-2" />
          Nouvel Événement
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calendrier des rendez-vous</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-medium mb-2">Fonctionnalité à venir</h3>
              <p className="text-muted-foreground">
                Le calendrier des rendez-vous clients sera bientôt disponible.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}