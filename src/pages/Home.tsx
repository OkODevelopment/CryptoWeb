import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight,
  TrendingUp,
  Shield,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

type Crypto = {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
};

export default function Home() {
  const [cryptos, setCryptos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Position réelle de la souris
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // Position animée pour le cercle
  const [animatedPosition, setAnimatedPosition] = useState({ x: 0, y: 0 });

  const LOCAL_STORAGE_KEY = 'cryptos_data';
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes en ms

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const smoothFollow = () => {
      setAnimatedPosition((prev) => ({
        x: prev.x + (mousePosition.x - prev.x) * 0.2,
        y: prev.y + (mousePosition.y - prev.y) * 0.2,
      }));
    };
    const animationFrame = requestAnimationFrame(smoothFollow);
    return () => cancelAnimationFrame(animationFrame);
  }, [mousePosition]);

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const storedValue = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedValue) {
          const { data, timestamp } = JSON.parse(storedValue);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setCryptos(data);
            setIsLoading(false);
            return;
          }
        }

        const response = await fetch(
            'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false'
        );
        if (!response.ok) {
          throw new Error('Échec de récupération des données');
        }
        const data = await response.json();
        setCryptos(data);

        localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify({ data, timestamp: Date.now() })
        );
      } catch (err: any) {
        setError(err.message || 'Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCryptos();
  }, []);

  if (isLoading) {
    return <div className="text-center py-12">Chargement des données...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Erreur : {error}</div>;
  }

  return (
      <div className="flex flex-col min-h-screen">
        <div
            className="pointer-events-none fixed w-12 h-12 bg-white rounded-full blur-lg opacity-40"
            style={{
              transform: `translate(${animatedPosition.x - 24}px, ${
                  animatedPosition.y - 80
              }px)`,
              transition: 'transform 0.05s linear',
            }}
        ></div>

        {/* Section d'introduction */}
        <section className="py-12 text-center px-4 relative">
          <div className="absolute inset-0 flex justify-center items-center -z-2">
            <div className="w-96 h-96 bg-white rounded-full blur-3xl opacity-20"></div>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            La plateforme de trading crypto la plus fiable
          </h1>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Achetez, vendez et échangez des cryptomonnaies en toute sécurité. Rejoignez des millions d'utilisateurs qui
            nous font confiance.
          </p>
          <Button size="lg" className="gap-2">
            Commencer maintenant <ArrowRight className="h-4 w-4" />
          </Button>
        </section>

        {/* Section des avantages */}
        <section className="container grid md:grid-cols-3 gap-6 py-12">
          <Card>
            <CardContent className="pt-6">
              <TrendingUp className="h-12 w-12 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Trading avancé</h3>
              <p className="text-muted-foreground">
                Outils professionnels et graphiques en temps réel
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Shield className="h-12 w-12 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Sécurité maximale</h3>
              <p className="text-muted-foreground">
                Protection de vos actifs avec une sécurité de niveau institutionnel
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Zap className="h-12 w-12 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Exécution rapide</h3>
              <p className="text-muted-foreground">
                Transactions instantanées et support 24/7
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Section des cryptomonnaies */}
        <section className="container py-12">
          <h2 className="text-2xl font-bold mb-6">Marché des cryptomonnaies</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4">Crypto</th>
                <th className="text-right py-4 px-4">Prix</th>
                <th className="text-right py-4 px-4">24h %</th>
              </tr>
              </thead>
              <tbody>
              {cryptos.map((crypto) => (
                  <tr
                      key={crypto.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <Link
                          to={`/crypto/${crypto.id}`}
                          className="flex items-center gap-3 hover:text-primary"
                      >
                        <img
                            src={crypto.image}
                            alt={crypto.name}
                            className="w-8 h-8"
                        />
                        <div>
                          <div className="font-medium">{crypto.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {crypto.symbol.toUpperCase()}
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="text-right py-4 px-4">
                      <div className="font-medium">
                        ${crypto.current_price.toLocaleString()}
                      </div>
                    </td>
                    <td className="text-right py-4 px-4">
                      <div
                          className={`flex items-center justify-end gap-1 ${
                              crypto.price_change_percentage_24h >= 0
                                  ? 'text-green-500'
                                  : 'text-red-500'
                          }`}
                      >
                        {crypto.price_change_percentage_24h >= 0 ? (
                            <ArrowUpRight className="h-4 w-4" />
                        ) : (
                            <ArrowDownRight className="h-4 w-4" />
                        )}
                        {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                      </div>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
  );
}
