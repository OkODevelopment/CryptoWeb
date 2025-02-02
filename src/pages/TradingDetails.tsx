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
import { ArrowUpRight, ArrowDownRight, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"


interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  description: {
    en: string;
  };
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    subreddit_url: string;
    chat_url: string;
  };
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
  tickers: {
    market: {
      name: string;
      identifier: string;
      has_trading_incentive: boolean;
    };
    base: string;
    target: string;
    market_identifier: string;
    last: number;
    volume: number;
    converted_last: {
      [key: string]: number;
    };
    converted_volume: {
      [key: string]: number;
    };
    trust_score: string;
    bid_ask_spread_percentage: number;
    timestamp: string;
    last_traded_at: string;
    last_fetch_at: string;
    is_anomaly: boolean;
    is_stale: boolean;
    trade_url: string;
    token_info_url: string | null;
    coin_id: string | null;
    target_coin_id: string | null;
  }[];
}

interface MarketChartData {
  prices: [number, number][];
}

interface Message {
  id: number;
  username: string;
  content: string;
  timestamp: string;
}

const TradingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cryptoData, setCryptoData] = useState<CryptoData | null>(null);
  const [chartData, setChartData] = useState<{ date: string; price: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [chartLoading, setChartLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // État pour gérer la plage de temps sélectionnée pour le graphique
  const [chartRange, setChartRange] = useState<'1' | '7' | '14' | '30' | '90' | '180' | '365'>('30');

  // États pour la discussion
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false); // État pour le mode clair/sombre

  // États pour la traduction
  const [translatedDescription, setTranslatedDescription] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  const [balance, setBalance] = useState<number>(0);

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
                tickers: true, // Activer les tickers pour les marchés
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
          // Format de date simple (mois/jour)
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

  // Charger les messages depuis le localStorage au montage
  useEffect(() => {
    const storedMessages = localStorage.getItem(`crypto-${id}-messages`);
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, [id]);

  // Sauvegarder les messages dans le localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem(`crypto-${id}-messages`, JSON.stringify(messages));
  }, [messages, id]);

  useEffect(() => {
    const loadUserBalance = async () => {
      const email = localStorage.getItem('userEmail');
      if (email) {
        try {
          const response = await axios.post('http://localhost:5000/account', { email });
          setBalance(response.data.balance);
        } catch (error) {
          console.error('Erreur lors du chargement du solde:', error);
        }
      }
    };

    loadUserBalance();
  }, []);

  // Fonction pour ajouter un nouveau message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || username.trim() === '') return;

    const message: Message = {
      id: Date.now(),
      username: username.trim(),
      content: newMessage.trim(),
      timestamp: new Date().toLocaleString(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  // Fonction pour basculer le mode clair/sombre
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

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

  const handleBuy = async () => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      alert('Veuillez vous connecter.');
      navigate('/signin');
      return;
    }

    const quantityInput = document.getElementById('quantity') as HTMLInputElement;
    if (!quantityInput?.value) {
      alert('Veuillez entrer une quantité.');
      return;
    }

    const quantity = parseFloat(quantityInput.value);
    if (isNaN(quantity) || quantity <= 0) {
      alert('Veuillez entrer une quantité valide.');
      return;
    }

    const price = cryptoData?.market_data.current_price.usd;
    if (!price) {
      alert('Prix non disponible.');
      return;
    }

    try {
      console.log('Envoi des données:', {
        email,
        crypto_id: cryptoData?.id,
        quantity,
        price
      });

      const response = await axios.post('http://localhost:5000/buy', {
        email,
        crypto_id: cryptoData?.id,
        quantity,
        price
      });

      console.log('Réponse:', response.data);

      if (response.data) {
        alert('Achat réussi !');
        setBalance(response.data.new_balance);
        quantityInput.value = ''; // Réinitialiser le champ quantité
      }
    } catch (error: any) {
      console.error('Erreur détaillée:', error);
      console.error('Réponse d\'erreur:', error.response?.data);
      alert(error.response?.data?.error || 'Erreur lors de l\'achat.');
    }
  };

  const handleSell = async () => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      navigate('/signin');
      return;
    }

    const quantity = parseFloat((document.getElementById('quantity') as HTMLInputElement).value);
    if (isNaN(quantity) || quantity <= 0) {
      alert('Veuillez entrer une quantité valide.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/sell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          crypto_id: cryptoData?.id,
          quantity,
          price: cryptoData?.market_data.current_price.usd,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Vente réussie !');
        setBalance(data.new_balance);
      } else {
        alert(data.error || 'Erreur lors de la vente.');
      }
    } catch (error) {
      console.error('Erreur lors de la vente :', error);
    }
  };

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
                      size="sm"
                  >
                    1J
                  </Button>
                  <Button
                      variant={chartRange === '7' ? 'default' : 'outline'}
                      onClick={() => setChartRange('7')}
                      size="sm"
                  >
                    7J
                  </Button>
                  <Button
                      variant={chartRange === '14' ? 'default' : 'outline'}
                      onClick={() => setChartRange('14')}
                      size="sm"
                  >
                    14J
                  </Button>
                  <Button
                      variant={chartRange === '30' ? 'default' : 'outline'}
                      onClick={() => setChartRange('30')}
                      size="sm"
                  >
                    30J
                  </Button>
                  <Button
                      variant={chartRange === '90' ? 'default' : 'outline'}
                      onClick={() => setChartRange('90')}
                      size="sm"
                  >
                    90J
                  </Button>
                  <Button
                      variant={chartRange === '180' ? 'default' : 'outline'}
                      onClick={() => setChartRange('180')}
                      size="sm"
                  >
                    180J
                  </Button>
                  <Button
                      variant={chartRange === '365' ? 'default' : 'outline'}
                      onClick={() => setChartRange('365')}
                      size="sm"
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
                  <TabsContent value="markets" className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Principaux Marchés</h4>
                      <div className="overflow-x-auto">
                        <table
                            className={`min-w-full divide-y divide-border rounded-lg overflow-hidden ${
                                isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
                            }`}
                        >
                          <thead>
                          <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Exchange</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Paire</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Dernier Prix</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Volume 24h</th>
                          </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                          {cryptoData.tickers.slice(0, 10).map((ticker, index) => (
                              <tr key={index}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm">{ticker.market.name}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm">
                                  {ticker.base}/{ticker.target}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm">
                                  ${ticker.last.toLocaleString()}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm">
                                  ${ticker.volume.toLocaleString()}
                                </td>
                              </tr>
                          ))}
                          </tbody>
                        </table>
                      </div>
                      {cryptoData.tickers.length > 10 && (
                          <p className="text-sm text-gray-500 mt-2">
                            Affichage des 10 premiers marchés. Voir plus sur{' '}
                            <a href="https://www.coingecko.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                              CoinGecko
                            </a>
                            .
                          </p>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="fundamentals" className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Description</h4>
                      <p className="text-gray-700 whitespace-pre-line">
                        {cryptoData.description.en
                            ? cryptoData.description.en
                            : 'Aucune description disponible.'}
                      </p>
                    </div>
                    {/* Section Liens Officiels */}
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Liens Officiels</h4>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {cryptoData.links.homepage[0] && (
                            <li>
                              <a href={cryptoData.links.homepage[0]} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                Site Officiel
                              </a>
                            </li>
                        )}
                        {cryptoData.links.blockchain_site[0] && (
                            <li>
                              <a href={cryptoData.links.blockchain_site[0]} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                Blockchain Explorer
                              </a>
                            </li>
                        )}
                        {cryptoData.links.official_forum_url[0] && (
                            <li>
                              <a href={cryptoData.links.official_forum_url[0]} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                Forum Officiel
                              </a>
                            </li>
                        )}
                        {cryptoData.links.subreddit_url && (
                            <li>
                              <a href={cryptoData.links.subreddit_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                Subreddit
                              </a>
                            </li>
                        )}
                        {cryptoData.links.chat_url && (
                            <li>
                              <a href={cryptoData.links.chat_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                Chat
                              </a>
                            </li>
                        )}
                      </ul>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Carte pour les statistiques du marché */}
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
                <div className="mb-4">
                  <label className="text-sm font-medium">Solde disponible</label>
                  <div className="text-lg font-bold">${balance.toLocaleString()}</div>
                </div>
                <div>
                  <label className="text-sm">Quantité</label>
                  <Input id="quantity" type="number" placeholder="0.00"/>
                </div>
                <Button className="w-full" variant="default" onClick={handleBuy}>
                  Acheter
                </Button>
                <Button className="w-full" variant="destructive" onClick={handleSell}>
                  Vendre
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
        </div>
      </div>
  );
};

export default TradingDetails;
