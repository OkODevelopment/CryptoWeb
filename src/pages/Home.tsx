import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, TrendingUp, Shield, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const cryptos = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 45123.45, change: 2.5 },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 2456.78, change: -1.2 },
  { id: 'binancecoin', name: 'BNB', symbol: 'BNB', price: 312.45, change: 0.8 },
  { id: 'solana', name: 'Solana', symbol: 'SOL', price: 98.76, change: 5.4 },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 1.23, change: -0.5 },
  { id: 'ripple', name: 'XRP', symbol: 'XRP', price: 0.54, change: 1.7 },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', price: 15.67, change: -2.1 },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', price: 0.12, change: 3.2 },
  { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX', price: 34.56, change: 4.3 },
  { id: 'chainlink', name: 'Chainlink', symbol: 'LINK', price: 14.32, change: 1.9 },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="py-12 text-center px-4">
        <h1 className="text-4xl font-bold mb-4">
          La plateforme de trading crypto la plus fiable
        </h1>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Achetez, vendez et échangez des cryptomonnaies en toute sécurité. Rejoignez des millions d'utilisateurs qui nous font confiance.
        </p>
        <Button size="lg" className="gap-2">
          Commencer maintenant <ArrowRight className="h-4 w-4" />
        </Button>
      </section>

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
                        src={`https://cryptologos.cc/logos/${crypto.id}-${crypto.symbol.toLowerCase()}-logo.png`}
                        alt={crypto.name}
                        className="w-8 h-8"
                      />
                      <div>
                        <div className="font-medium">{crypto.name}</div>
                        <div className="text-sm text-muted-foreground">{crypto.symbol}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="text-right py-4 px-4">
                    <div className="font-medium">${crypto.price.toLocaleString()}</div>
                  </td>
                  <td className="text-right py-4 px-4">
                    <div className={`flex items-center justify-end gap-1 ${
                      crypto.change >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {crypto.change >= 0 ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      {Math.abs(crypto.change)}%
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