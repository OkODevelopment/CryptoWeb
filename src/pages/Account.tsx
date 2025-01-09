import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Wallet, History, Settings } from 'lucide-react';

export default function Account() {
  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Mon Compte</h1>
        <Button variant="outline">Déconnexion</Button>
      </div>

      <Tabs defaultValue="wallet" className="space-y-4">
        <TabsList>
          <TabsTrigger value="wallet" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Portefeuille
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Historique
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Paramètres
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wallet">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Solde total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$12,345.67</div>
                <div className="text-sm text-muted-foreground mt-1">
                  ≈ 0.28945 BTC
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Button>Dépôt</Button>
                <Button variant="outline">Retrait</Button>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Mes actifs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/20 rounded">
                    <div className="flex items-center gap-4">
                      <img 
                        src="https://cryptologos.cc/logos/bitcoin-btc-logo.png"
                        alt="BTC"
                        className="w-8 h-8"
                      />
                      <div>
                        <div className="font-medium">Bitcoin</div>
                        <div className="text-sm text-muted-foreground">BTC</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">0.12345 BTC</div>
                      <div className="text-sm text-muted-foreground">≈ $5,432.10</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}