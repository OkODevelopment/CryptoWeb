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
import { ArrowUpRight, ArrowDownRight, Sun, Moon, Edit, Trash2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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

interface Post {
  id: number;
  username: string;
  title: string;
  content: string;
  date: string;
  likes: number;
}

const CryptoDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cryptoData, setCryptoData] = useState<CryptoData | null>(null);
  const [chartData, setChartData] = useState<{ date: string; price: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [chartLoading, setChartLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // État pour gérer la plage de temps sélectionnée pour le graphique
  const [chartRange, setChartRange] = useState<'1' | '7' | '14' | '30' | '90' | '180' | '365'>('30');

  function saveToLocalStorage(key: string, value: any) {
    localStorage.setItem(key , JSON.stringify(value));
  }

  function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  }
  
  // États pour la discussion
  const [messages, setMessages] = useState<Message[]>(() => loadFromLocalStorage(`crypto-${id}-messages`, []));
  const [newMessage, setNewMessage] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => loadFromLocalStorage('isDarkMode', true)); // Mode sombre stocké globalement

  // États pour la traduction
  const [translatedDescription, setTranslatedDescription] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  // États pour les posts
  const [posts, setPosts] = useState<Post[]>(() => loadFromLocalStorage(`crypto-${id}-posts`, []));
  const [newPostTitle, setNewPostTitle] = useState<string>('');
  const [newPostContent, setNewPostContent] = useState<string>('');
  const [sortCriteria, setSortCriteria] = useState<'date' | 'likes'>('date');
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editingPostTitle, setEditingPostTitle] = useState<string>('');
  const [editingPostContent, setEditingPostContent] = useState<string>('');

  // État pour gérer les posts étendus
  const [expandedPostIds, setExpandedPostIds] = useState<Set<number>>(() => {
    const stored = loadFromLocalStorage<number[]>(`crypto-${id}-expandedPosts`, []);
    return new Set(stored);
  });

  // Sauvegarder les messages dans le localStorage à chaque changement
  useEffect(() => {
    saveToLocalStorage(`crypto-${id}-messages`, messages);
  }, [messages, id]);

  // Sauvegarder les posts dans le localStorage à chaque changement
  useEffect(() => {
    saveToLocalStorage(`crypto-${id}-posts`, posts);
  }, [posts, id]);

  // Sauvegarder les posts étendus dans le localStorage à chaque changement
  useEffect(() => {
    saveToLocalStorage(`crypto-${id}-expandedPosts`, Array.from(expandedPostIds));
  }, [expandedPostIds, id]);

  // Sauvegarder le mode sombre globalement
  useEffect(() => {
    saveToLocalStorage('isDarkMode', isDarkMode);
  }, [isDarkMode]);

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

  // Fonction pour traduire la description en français
  const translateDescription = async () => {
    if (!cryptoData || !cryptoData.description.en) return;
    setIsTranslating(true);
    setTranslationError(null);
    try {
      const response = await axios.post('https://libretranslate.de/translate', {
        q: cryptoData.description.en,
        source: 'en',
        target: 'fr',
        format: 'text',
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      setTranslatedDescription(response.data.translatedText);
    } catch (err) {
      console.error('Erreur lors de la traduction de la description.', err);
      setTranslationError('Erreur lors de la traduction de la description.');
    } finally {
      setIsTranslating(false);
    }
  };

  // Fonctions pour gérer les posts
  const addPost = () => {
    if (newPostTitle.trim() === '' || newPostContent.trim() === '' || username.trim() === '') return;

    const newPost: Post = {
      id: Date.now(),
      username: username.trim(),
      title: newPostTitle.trim(),
      content: newPostContent.trim(),
      date: new Date().toLocaleString(),
      likes: 0,
    };

    setPosts([newPost, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
  };

  const deletePost = (postId: number) => {
    if (!username.trim()) return;
    const post = posts.find(p => p.id === postId);
    if (post && post.username === username.trim()) {
      if (window.confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) {
        setPosts(posts.filter(p => p.id !== postId));
        setExpandedPostIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      }
    } else {
      alert('Vous ne pouvez supprimer que vos propres posts.');
    }
  };

  const likePost = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    }));
  };

  const startEditingPost = (post: Post) => {
    if (!username.trim()) return;
    if (post.username !== username.trim()) {
      alert('Vous ne pouvez modifier que vos propres posts.');
      return;
    }
    setEditingPostId(post.id);
    setEditingPostTitle(post.title);
    setEditingPostContent(post.content);
  };

  const saveEditedPost = (postId: number) => {
    if (editingPostTitle.trim() === '' || editingPostContent.trim() === '') return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, title: editingPostTitle.trim(), content: editingPostContent.trim() };
      }
      return post;
    }));
    setEditingPostId(null);
    setEditingPostTitle('');
    setEditingPostContent('');
  };

  const cancelEditingPost = () => {
    setEditingPostId(null);
    setEditingPostTitle('');
    setEditingPostContent('');
  };

  // Fonction pour trier les posts
  const sortedPosts = [...posts].sort((a, b) => {
    if (sortCriteria === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortCriteria === 'likes') {
      return b.likes - a.likes;
    }
    return 0;
  });

  // Fonction pour gérer l'expansion/réduction des posts
  const togglePostExpansion = (postId: number) => {
    setExpandedPostIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
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
                    <div className="flex items-center space-x-2 mb-2">
                      <Button
                        variant="outline"
                        onClick={translateDescription}
                        disabled={isTranslating || translatedDescription !== null}
                      >
                        {isTranslating ? 'Traduction...' : 'Traduire en Français'}
                      </Button>
                      {translatedDescription && (
                        <Button
                          variant="ghost"
                          onClick={() => setTranslatedDescription(null)}
                        >
                          Réinitialiser
                        </Button>
                      )}
                    </div>
                    {translationError && (
                      <p className="text-red-500">{translationError}</p>
                    )}
                    <p className="text-gray-700 whitespace-pre-line">
                      {translatedDescription
                        ? translatedDescription
                        : cryptoData.description.en
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

      {/* Section Discussion */}
      <div className="mt-12">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Discussion sur {cryptoData.name}</CardTitle>
            <Button
              variant="ghost"
              onClick={toggleDarkMode}
              aria-label="Toggle Dark Mode"
              className="flex items-center gap-2"
            >
              {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              {isDarkMode ? 'Sombre' : 'Clair'}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Liste des messages */}
            <div className="max-h-80 overflow-y-auto space-y-4">
              {messages.length === 0 ? (
                <p className="text-gray-500">Aucun message pour l'instant. Soyez le premier à discuter !</p>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="border-b border-border pb-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{msg.username}</span>
                      <span className="text-xs text-gray-400">{msg.timestamp}</span>
                    </div>
                    <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{msg.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* Formulaire pour envoyer un nouveau message */}
            <form onSubmit={handleSendMessage} className="flex flex-col space-y-2">
              <Input
                type="text"
                placeholder="Votre nom"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode
                    ? 'bg-gray-800 text-white placeholder-gray-400'
                    : 'bg-white text-black placeholder-gray-500'
                }`}
                required
              />
              <Textarea
                placeholder="Votre message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className={`px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                  isDarkMode
                    ? 'bg-gray-800 text-white placeholder-gray-400'
                    : 'bg-white text-black placeholder-gray-500'
                }`}
                rows={3}
                required
              ></Textarea>
              <Button type="submit" variant="default" className="self-end">
                Envoyer
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Section Posts */}
      <div className="mt-12">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Posts sur {cryptoData.name}</CardTitle>
            <div className="flex items-center space-x-2">
              <select
                value={sortCriteria}
                onChange={(e) => setSortCriteria(e.target.value as 'date' | 'likes')}
                className={`px-2 py-1 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode
                    ? 'bg-gray-800 text-white'
                    : 'bg-white text-black'
                }`}
              >
                <option value="date">Trier par Date</option>
                <option value="likes">Trier par Pertinence</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Formulaire pour ajouter un nouveau post */}
            <div className="flex flex-col space-y-2">
              <Input
                type="text"
                placeholder="Titre du post"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                className={`px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode
                    ? 'bg-gray-800 text-white placeholder-gray-400'
                    : 'bg-white text-black placeholder-gray-500'
                }`}
                required
              />
              <Textarea
                placeholder="Contenu du post"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className={`px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                  isDarkMode
                    ? 'bg-gray-800 text-white placeholder-gray-400'
                    : 'bg-white text-black placeholder-gray-500'
                }`}
                rows={3}
                required
              ></Textarea>
              <span className="text-xs">
                <i>
                  *Pour que vous puissiez poster, il vous faut entrer votre nom dans le champ ci-dessus.
                </i>
              </span>
              <Button
                onClick={addPost}
                variant="default"
                disabled={newPostTitle.trim() === '' || newPostContent.trim() === '' || username.trim() === ''}
                className="self-end"
              >
                Publier
              </Button>
            </div>

            {/* Liste des posts */}
            <div className="space-y-4">
              {sortedPosts.length === 0 ? (
                <p className="text-gray-500">Aucun post pour l'instant. Soyez le premier à publier !</p>
              ) : (
                sortedPosts.map((post) => (
                  <Card key={post.id} className={`border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-border'}`}>
                    <CardHeader className="flex justify-between items-center">
                      <div>
                        {/* Titre cliquable pour étendre/réduire le contenu */}
                        <h5
                          className="text-lg font-semibold cursor-pointer flex items-center"
                          onClick={() => togglePostExpansion(post.id)}
                        >
                          {post.title}
                          {/* Icône indiquant l'état d'expansion */}
                          <span className="ml-2">
                            {expandedPostIds.has(post.id) ? (
                              <ArrowUpRight className="h-4 w-4 transform rotate-45 transition-transform duration-300" />
                            ) : (
                              <ArrowUpRight className="h-4 w-4 transition-transform duration-300" />
                            )}
                          </span>
                        </h5>
                        <p className="text-sm text-gray-500">Posté par {post.username} le {post.date}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          onClick={() => likePost(post.id)}
                          aria-label="Like Post"
                          className="flex items-center space-x-1 text-red-500"
                        >
                          <Heart className="h-4 w-4" />
                          <span>{post.likes}</span>
                        </Button>
                        {post.username === username.trim() && (
                          <>
                            <Button
                              variant="ghost"
                              onClick={() => startEditingPost(post)}
                              aria-label="Edit Post"
                              className="text-yellow-500"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => deletePost(post.id)}
                              aria-label="Delete Post"
                              className="text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </CardHeader>
                    {/* Contenu du post avec animation */}
                    <CardContent>
                      <div
                        className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
                          expandedPostIds.has(post.id) ? 'max-h-96' : 'max-h-0'
                        }`}
                      >
                        {editingPostId === post.id ? (
                          <div className="flex flex-col space-y-2">
                            <Input
                              type="text"
                              placeholder="Titre du post"
                              value={editingPostTitle}
                              onChange={(e) => setEditingPostTitle(e.target.value)}
                              className={`px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                isDarkMode
                                  ? 'bg-gray-800 text-white placeholder-gray-400'
                                  : 'bg-white text-black placeholder-gray-500'
                              }`}
                              required
                            />
                            <Textarea
                              placeholder="Contenu du post"
                              value={editingPostContent}
                              onChange={(e) => setEditingPostContent(e.target.value)}
                              className={`px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                                isDarkMode
                                  ? 'bg-gray-800 text-white placeholder-gray-400'
                                  : 'bg-white text-black placeholder-gray-500'
                              }`}
                              rows={3}
                              required
                            ></Textarea>
                            <div className="flex space-x-2">
                              <Button
                                onClick={() => saveEditedPost(post.id)}
                                variant="default"
                                disabled={editingPostTitle.trim() === '' || editingPostContent.trim() === ''}
                              >
                                Sauvegarder
                              </Button>
                              <Button
                                onClick={cancelEditingPost}
                                variant="ghost"
                                className="text-gray-500"
                              >
                                Annuler
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className={`text-gray-700 whitespace-pre-line ${isDarkMode ? 'text-gray-300' : ''}`}>
                            {post.content}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CryptoDetails;
