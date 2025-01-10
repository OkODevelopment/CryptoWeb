import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { createChart, IChartApi, DeepPartial, LayoutOptions } from 'lightweight-charts';

type Crypto = {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
};

const Trading: React.FC = () => {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<any>(null);

  // Récupération des cryptomonnaies
  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const response = await fetch(
          'https://cors-anywhere.herokuapp.com/https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false'
        );
        if (!response.ok) {
          throw new Error('Échec de récupération des données');
        }
        const data = await response.json();
        setCryptos(data);
      } catch (err: any) {
        setError(err.message || 'Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCryptos();
  }, []);

  // Configuration initiale du graphique
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chartOptions: DeepPartial<LayoutOptions> = {
      layout: {
        textColor: 'white',
        background: { type: 'solid', color: 'black' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
      grid: {
        vertLines: { color: '#e1e1e1' },
        horzLines: { color: '#e1e1e1' },
      },
      priceScale: { borderColor: '#ccc' },
      timeScale: { borderColor: '#ccc', timeVisible: true, secondsVisible: false },
    };

    chartRef.current = createChart(chartContainerRef.current, chartOptions);

    candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    fetch(
      'https://api.coingecko.com/api/v3/coins/bitcoin/ohlc?vs_currency=usd&days=1'
    )
      .then((res) => res.json())
      .then((data: number[][]) => {
        const formattedData = data.map((d) => ({
          time: d[0] / 1000,
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

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
        chartRef.current.resize(chartContainerRef.current.clientWidth, 500);
      }
    };

    window.addEventListener('resize', handleResize);

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
          <div className="h-full bg-muted/20 rounded" ref={chartContainerRef}></div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-4">Liste des Cryptomonnaies</h3>
          {isLoading ? (
            <div>Chargement des données...</div>
          ) : error ? (
            <div className="text-red-500">Erreur : {error}</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left py-4 px-4">Crypto</th>
                  <th className="text-right py-4 px-4">Prix</th>
                  <th className="text-right py-4 px-4">24h %</th>
                </tr>
              </thead>
              <tbody>
                {cryptos.map((crypto) => (
                  <tr key={crypto.id}>
                    <td className="py-4 px-4 flex items-center gap-3">
                      <img src={crypto.image} alt={crypto.name} className="w-8 h-8" />
                      <div>
                        <div className="font-medium">{crypto.name}</div>
                        <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                          {crypto.symbol.toUpperCase()}
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-4 px-4">
                      ${crypto.current_price.toLocaleString()}
                    </td>
                    <td className="text-right py-4 px-4">
                      <div
                        className={`${
                          crypto.price_change_percentage_24h >= 0
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}
                      >
                        {crypto.price_change_percentage_24h.toFixed(2)}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Trading;
