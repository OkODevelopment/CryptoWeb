import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { createChart, IChartApi, DeepPartial, LayoutOptions } from 'lightweight-charts';
import {Link} from "react-router-dom";
import {ArrowDownRight, ArrowUpRight} from "lucide-react";

type Crypto = {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
};

const Trading: React.FC = () => {
  const [cryptos, setCryptos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const LOCAL_STORAGE_KEY = 'cryptos_data';
  const CACHE_DURATION = 5 * 60 * 1000;

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const storedValue = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedValue) {
          const {data, timestamp} = JSON.parse(storedValue);
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
            JSON.stringify({data, timestamp: Date.now()})
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
      <div>
        <section className="py-12 text-center px-4 relative">
          <div className="absolute inset-0 flex justify-center items-center -z-2">
            <div className="w-96 h-96 bg-white rounded-full blur-3xl opacity-20"></div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 max-w-3xl mx-auto">
            Investissez dès maintenant
          </h1>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Optimisez vos placements et atteignez vos objectifs financiers. Découvrez des opportunités d'investissement fiables et performantes.
          </p>
        </section>


        <section className="flex justify-center w-full py-12 px-4">
          <div className="w-[95%] max-w-[1400px]">
            <h2 className="text-2xl font-bold mb-6 text-center">Marché des cryptomonnaies</h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
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
                            to={`/invest/${crypto.id}`}
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
                              <ArrowUpRight className="h-4 w-4"/>
                          ) : (
                              <ArrowDownRight className="h-4 w-4"/>
                          )}
                          {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                        </div>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
  );
};

export default Trading;
