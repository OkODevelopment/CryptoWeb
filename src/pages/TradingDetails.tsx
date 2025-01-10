import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createChart, IChartApi, DeepPartial, LayoutOptions } from 'lightweight-charts';

const TradingDetails: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Configuration initiale du graphique
    const chartOptions: DeepPartial<LayoutOptions> = {
      layout: {
        textColor: 'white',
        background: { type: 'solid', color: 'black' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
      grid: {
        vertLines: {
          color: '#e1e1e1',
        },
        horzLines: {
          color: '#e1e1e1',
        },
      },
      priceScale: {
        borderColor: '#ccc',
      },
      timeScale: {
        borderColor: '#ccc',
        timeVisible: true,
        secondsVisible: false,
      },
    };

    // Création du graphique
    chartRef.current = createChart(chartContainerRef.current, chartOptions);

    // Ajout de la série chandelier
    candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    // Appel à l’API CoinGecko pour récupérer des données OHLC sur Bitcoin
    fetch(
      'https://api.coingecko.com/api/v3/coins/bitcoin/ohlc?vs_currency=usd&days=1'
    )
      .then((res) => res.json())
      .then((data: number[][]) => {
        // data est un tableau de tableaux : [ [timestamp, open, high, low, close], ... ]
        // On convertit ce format pour qu’il soit compatible avec Lightweight Charts
        const formattedData = data.map((d) => ({
          time: d[0] / 1000, // CoinGecko renvoie le timestamp en millisecondes, Lightweight Charts le veut en secondes
          open: d[1],
          high: d[2],
          low: d[3],
          close: d[4],
        }));

        candlestickSeriesRef.current.setData(formattedData);
        chartRef.current?.timeScale().fitContent();
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des données', error);
      });

    // Gérer la responsivité
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
        chartRef.current.resize(chartContainerRef.current.clientWidth, 500);
      }
    };

    window.addEventListener('resize', handleResize);

    // Nettoyage à la destruction du composant
    return () => {
      window.removeEventListener('resize', handleResize);
      chartRef.current?.remove();
    };
  }, []);

  return (
    <div className="container grid lg:grid-cols-[1fr_300px] gap-4 py-6">
      <div className="space-y-4">
        <Card className="p-4 h-[500px]">
          <div className="text-sm text-muted-foreground mb-2">BTC/USDT</div>
          <div className="text-2xl font-bold">$45,123.45</div>
          {/* Intégration du graphique Lightweight Charts */}
          <div className="h-full bg-muted/20 rounded" ref={chartContainerRef}></div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-4">Carnet d'ordres</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>Prix (USDT)</div>
            <div>Quantité (BTC)</div>
            <div>Total</div>
            {/* Données statiques de testing */}
            <div>45,000</div>
            <div>0.5</div>
            <div>22,500</div>
            <div>44,800</div>
            <div>1.2</div>
            <div>53,760</div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="p-4">
          <Tabs defaultValue="market">
            <TabsList className="w-full">
              <TabsTrigger value="market" className="flex-1">
                Marché
              </TabsTrigger>
              <TabsTrigger value="limit" className="flex-1">
                Limite
              </TabsTrigger>
            </TabsList>
            <TabsContent value="market" className="space-y-4 mt-4">
              <div>
                <label className="text-sm">Quantité</label>
                <Input type="number" placeholder="0.00" />
              </div>
              <Button className="w-full" variant="default">
                Acheter BTC
              </Button>
              <Button className="w-full" variant="destructive">
                Vendre BTC
              </Button>
            </TabsContent>
            <TabsContent value="limit" className="space-y-4 mt-4">
              <div>
                <label className="text-sm">Prix Limite (USDT)</label>
                <Input type="number" placeholder="45000" />
              </div>
              <div>
                <label className="text-sm">Quantité</label>
                <Input type="number" placeholder="0.00" />
              </div>
              <Button className="w-full" variant="default">
                Placer Ordre Limite
              </Button>
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
};

export default TradingDetails;