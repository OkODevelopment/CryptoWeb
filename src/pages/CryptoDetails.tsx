import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CryptoDetails() {
  const { id } = useParams();

  return (
    <div className="container py-6">
      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <img 
                  src={`https://cryptologos.cc/logos/${id}-logo.png`} 
                  alt={id} 
                  className="w-8 h-8"
                />
                {id?.toUpperCase()} Prix et Graphique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] bg-muted/20 rounded flex items-center justify-center">
                Graphique détaillé
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations sur {id?.toUpperCase()}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Aperçu</TabsTrigger>
                  <TabsTrigger value="markets">Marchés</TabsTrigger>
                  <TabsTrigger value="fundamentals">Fondamentaux</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Prix actuel</div>
                      <div className="text-xl font-bold">$45,123.45</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Volume 24h</div>
                      <div className="text-xl font-bold">$28.5B</div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Statistiques du marché</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rang</span>
              <span className="font-medium">#1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cap. marché</span>
              <span className="font-medium">$880.5B</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Volume total</span>
              <span className="font-medium">$28.5B</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}