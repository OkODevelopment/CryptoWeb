import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Trading() {
  return (
    <div className="container grid lg:grid-cols-[1fr_300px] gap-4 py-6">
      <div className="space-y-4">
        <Card className="p-4 h-[500px]">
          <div className="text-sm text-muted-foreground mb-2">BTC/USDT</div>
          <div className="text-2xl font-bold">$45,123.45</div>
          {/* Ici viendrait le graphique TradingView */}
          <div className="h-full bg-muted/20 rounded flex items-center justify-center">
            Graphique TradingView
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-4">Carnet d'ordres</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>Prix (USDT)</div>
            <div>Quantité (BTC)</div>
            <div>Total</div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="p-4">
          <Tabs defaultValue="market">
            <TabsList className="w-full">
              <TabsTrigger value="market" className="flex-1">Marché</TabsTrigger>
              <TabsTrigger value="limit" className="flex-1">Limite</TabsTrigger>
            </TabsList>
            <TabsContent value="market" className="space-y-4 mt-4">
              <div>
                <label className="text-sm">Quantité</label>
                <Input type="number" placeholder="0.00" />
              </div>
              <Button className="w-full" variant="default">Acheter BTC</Button>
              <Button className="w-full" variant="destructive">Vendre BTC</Button>
            </TabsContent>
          </Tabs>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-4">Positions ouvertes</h3>
          <div className="text-sm text-muted-foreground">
            Aucune position ouverte
          </div>
        </Card>
      </div>
    </div>
  );
}