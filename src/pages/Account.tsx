import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Wallet, History, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { TransactionTable } from "@/components/ui/TransactionTable";

export default function Account() {
  const navigate = useNavigate();
  const [pseudo, setPseudo] = useState('');
  const [balance, setBalance] = useState(0);
  const [btcPrice, setBtcPrice] = useState(0);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [fullName, setFullName] = useState('');
  const [iban, setIban] = useState('');
  const [bic, setBic] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [transactions, setTransactions] = useState([]);


  const resetForm = () => {
    setCardNumber('');
    setExpirationDate('');
    setCvv('');
    setFullName('');
  };

  const resetWithdrawForm = () => {
    setIban('');
    setBic('');
    setWithdrawAmount('');
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('authToken');
    const email = localStorage.getItem('userEmail');

    if (!isLoggedIn || !email) {
      navigate('/signin');
      return;
    }

    // Récupérer les données utilisateur
    fetch('http://localhost:5000/account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            console.error(data.error);
            navigate('/signin');
          } else {
            setPseudo(data.pseudo || 'Utilisateur');
            setBalance(data.balance || 0);
          }
        })
        .catch((error) =>
            console.error('Erreur lors de la récupération des données:', error)
        );

    // Récupérer le prix du BTC
    fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
    )
        .then((response) => response.json())
        .then((data) => {
          if (data.bitcoin?.usd) {
            setBtcPrice(data.bitcoin.usd); // Met à jour le prix du BTC
          }
        })
        .catch((error) =>
            console.error('Erreur lors de la récupération du prix BTC :', error)
        );

    // Récupérer les transactions
    fetch('http://localhost:5000/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setTransactions(data);
          } else {
            console.error('Erreur lors de la récupération des transactions:', data.error);
          }
        })
        .catch((error) =>
            console.error('Erreur lors de la récupération des transactions:', error)
        );
  }, [navigate]);


  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userPseudo');
    localStorage.removeItem('userEmail');
    navigate('/signin');
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardNumber || !expirationDate || !cvv || !fullName) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    const amountInput = (e.target as HTMLFormElement).querySelector('#deposit-amount') as HTMLInputElement;
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
      alert('Veuillez entrer un montant valide.');
      return;
    }

    try {
      const email = localStorage.getItem('userEmail');
      const response = await fetch('http://localhost:5000/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, amount }),
      });

      const data = await response.json();

      if (response.ok) {
        setBalance(data.new_balance); // Met à jour la balance locale
        alert('Dépôt effectué avec succès !');
        resetForm();
        setIsDepositModalOpen(false);
        refreshTransactions();
      } else {
        alert(data.error || 'Erreur lors du dépôt.');
      }
    } catch (error) {
      console.error('Erreur lors de la requête API :', error);
      alert('Erreur lors du dépôt.');
    }
  };



  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation uniquement si la modal est ouverte
    if (!isWithdrawModalOpen) return;

    // Validation IBAN
    const ibanRegex = /^FR\d{2}[0-9A-Z]{23}$/;
    if (!ibanRegex.test(iban)) {
      alert('Veuillez entrer un IBAN valide pour la France.');
      return;
    }

    // Validation BIC
    const bicRegex = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
    if (!bicRegex.test(bic)) {
      alert('Veuillez entrer un BIC valide.');
      return;
    }

    // Validation du montant
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Veuillez entrer un montant valide.');
      return;
    }

    if (amount > balance) {
      alert('Le montant demandé dépasse votre solde disponible.');
      return;
    }

    try {
      const email = localStorage.getItem('userEmail');
      const response = await fetch('http://localhost:5000/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, iban, bic, amount }),
      });

      const data = await response.json();

      if (response.ok) {
        setBalance(data.new_balance);
        alert('Retrait effectué avec succès !');
        resetWithdrawForm();
        setIsWithdrawModalOpen(false);
        refreshTransactions();
      } else {
        alert(data.error || 'Erreur lors du retrait.');
      }
    } catch (error) {
      console.error('Erreur lors de la requête API :', error);
      alert('Erreur lors du retrait.');
    }
  };

  const refreshTransactions = () => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    fetch("http://localhost:5000/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setTransactions(data); // Met à jour l'état des transactions
          } else {
            console.error("Erreur lors de la récupération des transactions:", data.error);
          }
        })
        .catch((error) =>
            console.error("Erreur lors de la récupération des transactions:", error)
        );
  };


  const balanceInBTC = btcPrice ? (balance / btcPrice).toFixed(8) : '...'; // Convertir USD en BTC

  return (
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Bonjour {pseudo} !</h1>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Mon Compte</h1>
          <Button variant="outline" onClick={handleLogout}>
            Déconnexion
          </Button>
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
                  <div className="text-3xl font-bold">${balance}</div> {/* Affiche la balance */}
                  <div className="text-sm text-muted-foreground mt-1">
                    ≈ {balanceInBTC} BTC {/* Affiche la corrélation en BTC */}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions rapides</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-4">
                  <Button variant="outline" onClick={() => setIsDepositModalOpen(true)}>
                    Dépôt
                  </Button>
                  <Button variant="outline" onClick={() => setIsWithdrawModalOpen(true)}>
                    Retrait
                  </Button>
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

          <TabsContent value="history">
            <div className="space-y-4">
              <TransactionTable transactions={transactions} />
            </div>
          </TabsContent>


        </Tabs>

        <Dialog open={isDepositModalOpen} onOpenChange={setIsDepositModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dépôt d'argent</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleDepositSubmit} className="space-y-4">
              {/* Numéro de carte */}
              <div>
                <Label htmlFor="card-number">Numéro de carte</Label>
                <Input
                    id="card-number"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19} // 16 chiffres + 3 espaces
                    value={cardNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\s+/g, ''); // Retirer les espaces
                      if (/^\d{0,16}$/.test(value)) {
                        setCardNumber(value.replace(/(\d{4})/g, '$1 ').trim()); // Ajouter des espaces
                      }
                    }}
                    required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Doit contenir exactement 16 chiffres.
                </p>
              </div>

              {/* Nom complet */}
              <div>
                <Label htmlFor="full-name">Nom complet</Label>
                <Input
                    id="full-name"
                    type="text"
                    placeholder="Prénom Nom"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                />
              </div>

              {/* Date d'expiration et CVV */}
              <div className="flex gap-4">
                <div>
                  <Label htmlFor="expiration-date">Date d'expiration</Label>
                  <Input
                      id="expiration-date"
                      type="text"
                      placeholder="MM/AA"
                      maxLength={5} // 4 chiffres + 1 séparateur
                      value={expirationDate}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, ''); // Retirer tout sauf les chiffres
                        if (value.length > 2) {
                          value = `${value.slice(0, 2)}/${value.slice(2, 4)}`; // Ajouter le séparateur
                        }
                        setExpirationDate(value);
                      }}
                      required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Format attendu : MM/AA.
                  </p>
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                      id="cvv"
                      type="text"
                      placeholder="123"
                      maxLength={3}
                      value={cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ''); // Retirer tout sauf les chiffres
                        if (/^\d{0,3}$/.test(value)) {
                          setCvv(value);
                        }
                      }}
                      required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Doit contenir exactement 3 chiffres.
                  </p>
                </div>
              </div>

              {/* Montant */}
              <div>
                <Label htmlFor="deposit-amount">Montant</Label>
                <Input
                    id="deposit-amount"
                    type="number"
                    placeholder="100"
                    min={1}
                    required
                />
              </div>

              {/* Boutons */}
              <DialogFooter>
                <Button type="submit">Confirmer</Button>
                <Button
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setIsDepositModalOpen(false);
                    }}
                >
                  Annuler
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>


        <Dialog open={isWithdrawModalOpen} onOpenChange={setIsWithdrawModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Retrait d'argent</DialogTitle>
            </DialogHeader>
            <form
                onSubmit={handleWithdrawSubmit}
                className="space-y-4"
                noValidate
            >
              {/* IBAN */}
              <div>
                <Label htmlFor="iban">IBAN</Label>
                <Input
                    id="iban"
                    type="text"
                    placeholder="FR76 3000 6000 0112 3456 7890 189"
                    value={iban}
                    maxLength={34} // IBAN max pour la France
                    onChange={(e) => setIban(e.target.value.toUpperCase().replace(/\s+/g, ''))} // En majuscules sans espaces
                    required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  L'IBAN doit commencer par FR et contenir 27 caractères alphanumériques.
                </p>
              </div>

              {/* BIC */}
              <div>
                <Label htmlFor="bic">BIC</Label>
                <Input
                    id="bic"
                    type="text"
                    placeholder="AGRIFRPPXXX"
                    value={bic}
                    maxLength={11} // Max pour le BIC
                    onChange={(e) => setBic(e.target.value.toUpperCase())} // En majuscules
                    required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Le BIC doit contenir 8 ou 11 caractères alphanumériques.
                </p>
              </div>

              {/* Montant */}
              <div>
                <Label htmlFor="withdraw-amount">Montant</Label>
                <Input
                    id="withdraw-amount"
                    type="number"
                    placeholder="100"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    min={1}
                    required
                />
              </div>

              {/* Boutons */}
              <DialogFooter>
                <Button type="submit">Confirmer</Button>
                <Button
                    variant="outline"
                    type="button" // Empêche la soumission du formulaire
                    onClick={() => {
                      resetWithdrawForm();
                      setIsWithdrawModalOpen(false);
                    }}
                >
                  Annuler
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>


      </div>
  );
}
