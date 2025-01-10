import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Spinner } from '@/components/ui/Spinner';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  market_data: {
    current_price: {
      [key: string]: number;
    };
    market_cap: {
      [key: string]: number;
    };
    total_volume: {
      [key: string]: number;
    };
    price_change_percentage_24h: number;
    market_cap_rank: number;
  };
}

interface MarketChartData {
  prices: [number, number][];
}

const CryptoDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cryptoData, setCryptoData] = useState<CryptoData | null>(null);
  const [chartData, setChartData] = useState<{ date: string; price: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [chartLoading, setChartLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // État pour gérer la plage de temps sélectionnée pour le graphique
  // Possibles valeurs de 'days' pour CoinGecko : 1, 7, 14, 30, 90, 180, 365, 'max'
  const [chartRange, setChartRange] = useState<'1' | '7' | '14' | '30' | '90' | '180' | '365'>('30');

  // Récupération des données de la crypto
  useEffect(() => {
    const fetchCryptoData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<CryptoData>(
          `https://api.coingecko.com/api/v3/coins/${id}`,
          {
            params: {
              localization: false,
              tickers: false,
              market_data: true,
              community_data: false,
              developer_data: false,
              sparkline: false,
            },
          },
        );
        setCryptoData(response.data);
      } catch (err: any) {
        setError('Erreur lors de la récupération des données de la crypto-monnaie.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCryptoData();
    }
  }, [id]);

  // Récupération des données du graphique
  useEffect(() => {
    const fetchChartData = async () => {
      if (!id) return;
      setChartLoading(true);
      try {
        const response = await axios.get<MarketChartData>(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
          {
            params: {
              vs_currency: 'usd',
              days: chartRange, // On utilise la plage depuis l'état
            },
          },
        );
        const formattedData = response.data.prices.map((price) => {
          const date = new Date(price[0]);
          // Format de date simple (mois/jour) – vous pouvez l'améliorer selon vos besoins
          return {
            date: `${date.getMonth() + 1}/${date.getDate()}`,
            price: price[1],
          };
        });
        setChartData(formattedData);
      } catch (err) {
        console.error('Erreur lors de la récupération des données du graphique.', err);
      } finally {
        setChartLoading(false);
      }
    };

    fetchChartData();
  }, [id, chartRange]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (error || !cryptoData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error || 'Crypto-monnaie non trouvée.'}</p>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        {/* Section principale avec le graphique et les informations */}
        <div className="space-y-6">
          {/* Carte pour le prix et le graphique */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <img src={cryptoData.image.small} alt={cryptoData.name} className="w-8 h-8" />
                {cryptoData.name} ({cryptoData.symbol.toUpperCase()}) Prix et Graphique
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Boutons de filtre pour la plage de temps */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Button
                  variant={chartRange === '1' ? 'default' : 'outline'}
                  onClick={() => setChartRange('1')}
                >
                  1J
                </Button>
                <Button
                  variant={chartRange === '7' ? 'default' : 'outline'}
                  onClick={() => setChartRange('7')}
                >
                  7J
                </Button>
                <Button
                  variant={chartRange === '14' ? 'default' : 'outline'}
                  onClick={() => setChartRange('14')}
                >
                  14J
                </Button>
                <Button
                  variant={chartRange === '30' ? 'default' : 'outline'}
                  onClick={() => setChartRange('30')}
                >
                  30J
                </Button>
                <Button
                  variant={chartRange === '90' ? 'default' : 'outline'}
                  onClick={() => setChartRange('90')}
                >
                  90J
                </Button>
                <Button
                  variant={chartRange === '180' ? 'default' : 'outline'}
                  onClick={() => setChartRange('180')}
                >
                  180J
                </Button>
                <Button
                  variant={chartRange === '365' ? 'default' : 'outline'}
                  onClick={() => setChartRange('365')}
                >
                  1an
                </Button>
              </div>

              {chartLoading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <Spinner />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={['auto', 'auto']} />
                    <Tooltip />
                    <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Carte pour les informations détaillées */}
          <Card>
            <CardHeader>
              <CardTitle>Informations sur {cryptoData.name}</CardTitle>
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
                      <div className="text-xl font-bold">
                        ${cryptoData.market_data.current_price.usd.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Volume 24h</div>
                      <div className="text-xl font-bold">
                        ${cryptoData.market_data.total_volume.usd.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Capitalisation Marché</div>
                      <div className="text-xl font-bold">
                        ${cryptoData.market_data.market_cap.usd.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Changement 24h</div>
                      <div
                        className={`text-xl font-bold ${
                          cryptoData.market_data.price_change_percentage_24h >= 0
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}
                      >
                        {cryptoData.market_data.price_change_percentage_24h.toFixed(2)}%
                        {cryptoData.market_data.price_change_percentage_24h >= 0 ? (
                          <ArrowUpRight className="inline h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="inline h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                {/* Vous pouvez ajouter des contenus pour "markets" et "fundamentals" ici */}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Carte pour les statistiques du marché */}
        <Card>
          <CardHeader>
            <CardTitle>Statistiques du marché</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rang</span>
              <span className="font-medium">#{cryptoData.market_data.market_cap_rank}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cap. marché</span>
              <span className="font-medium">
                ${cryptoData.market_data.market_cap.usd.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Volume total</span>
              <span className="font-medium">
                ${cryptoData.market_data.total_volume.usd.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CryptoDetails;
