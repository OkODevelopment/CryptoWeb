import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Wallet, History, Settings, ArrowDownToLine, ArrowUpToLine, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { TransactionTable } from "@/components/ui/TransactionTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [destinationIban, setDestinationIban] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [userCryptos, setUserCryptos] = useState<CryptoDetails[]>([]);

  const CRYPTO_MAPPING: { [key: string]: string } = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
  };

  const cryptoList = [
    { id: 'BTC', name: 'Bitcoin' },
    { id: 'ETH', name: 'Ethereum' },
    { id: 'USDT', name: 'Tether' },
    { id: 'XRP', name: 'XRP' },
    { id: 'BNB', name: 'BNB' },
    { id: 'SOL', name: 'Solana' },
    { id: 'DOGE', name: 'Dogecoin' },
    { id: 'USDC', name: 'USDC' },
    { id: 'ADA', name: 'Cardano' },
    { id: 'LDO', name: 'Lido' }
  ];

  type CryptoDetails = {
    id: string;
    quantity: number;
    price: number;
    eur_value: number;
  };


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

  const loadUserCryptos = () => {
    const email = localStorage.getItem('userEmail');
    if (!email) return;

    fetch('http://localhost:5000/user-cryptos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data)) {
            setUserCryptos(data);
          }
        })
        .catch(error => console.error('Erreur lors du chargement des cryptos:', error));
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
    loadUserCryptos();
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
            setTransactions(data);
          } else {
            console.error("Erreur lors de la récupération des transactions:", data.error);
          }
        })
        .catch((error) =>
            console.error("Erreur lors de la récupération des transactions:", error)
        );
  };

  const resetSendForm = () => {
    setDestinationIban('');
    setSendAmount('');
  };

  const handleSendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCrypto) {
      alert('Veuillez sélectionner une crypto-monnaie.');
      return;
    }

    // Step 1: Basic sanitization
    let sanitizedIban = destinationIban
      .replace(/\s+/g, '')        // Remove whitespace
      .toUpperCase();             // Convert to uppercase

    // Step 2: Validate CX prefix
    if (!sanitizedIban.startsWith('CX')) {
      alert('L\'IBAN doit commencer par CX');
      return;
    }

    // Step 3: Extract numbers and rebuild IBAN
    const numbers = sanitizedIban.substring(2).replace(/\D/g, '');
    
    // Step 4: Ensure exactly 20 digits after CX
    if (numbers.length !== 22) {
      alert('L\'IBAN doit contenir exactement 20 chiffres après CX');
      return;
    }

    // Step 5: Rebuild IBAN
    sanitizedIban = `CX${numbers}`;

    // Step 6: Final validation
    const cryptoExIbanRegex = /^CX\d{22}$/;
    const isValid = cryptoExIbanRegex.test(sanitizedIban);

    console.log({
      original: destinationIban,
      sanitized: sanitizedIban,
      length: sanitizedIban.length,
      isValid
    });

    if (!isValid) {
      alert('Veuillez entrer un IBAN CryptoEx valide (CX suivi de 20 chiffres).');
      return;
    }

    const amount = parseFloat(sendAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Veuillez entrer un montant valide.');
      return;
    }
  
    const cryptoFullName = CRYPTO_MAPPING[selectedCrypto] || selectedCrypto.toLowerCase();

    console.log('DEBUG - Crypto Matching:');
    console.log('1. Selected Crypto:', {
        raw: selectedCrypto,
        mapped: cryptoFullName
    });
    console.log('2. Available Cryptos:', userCryptos);

    const userCrypto = userCryptos.find(crypto => {
        console.log('3. Comparing:', {
            trying: crypto.id,
            against: cryptoFullName,
            matches: crypto.id.toLowerCase() === cryptoFullName.toLowerCase()
        });
        return crypto.id.toLowerCase() === cryptoFullName.toLowerCase();
    });

    console.log('4. Match Result:', userCrypto);

    if (!userCrypto) {
        console.log('No matching crypto found');
        alert('Vous ne possédez pas cette crypto-monnaie.');
        return;
    }

    if (amount > userCrypto.quantity) {
      alert('Le montant demandé dépasse votre solde en crypto-monnaie.');
      return;
    }

    try {
      const verifyResponse = await fetch('http://localhost:5000/verify-iban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ iban: destinationIban }),
      });

      const verifyData = await verifyResponse.json();
      if (!verifyData.exists) {
        alert('L\'IBAN de destination n\'existe pas.');
        return;
      }

      const sendData = {
        email: localStorage.getItem('userEmail'),
        destinationIban: sanitizedIban,
        amount: amount,
        cryptoCurrency: cryptoFullName,
      };

      console.log('Sending data:', sendData);

      const response = await fetch('http://localhost:5000/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sendData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        alert(errorData.error || 'Erreur lors de l\'envoi');
        return;
      }

      alert('Transfert effectué avec succès !');
      resetSendForm();
      setIsSendModalOpen(false);
      refreshTransactions();
      loadUserCryptos();
      
    } catch (error) {
      console.error('Erreur lors de la requête API :', error);
      alert('Erreur lors de l\'envoi');
    }
};

  const balanceInBTC = btcPrice ? (balance / btcPrice).toFixed(8) : '...'; // Convertir USD en BTC

  return (
      <div className="max-w-5xl mx-auto px-4 py-8 mt-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-16">Bonjour {pseudo} !</h1>
        </div>

        <Tabs defaultValue="wallet" className="space-y-6">
          <TabsList className="flex justify-center w-full max-w-md mx-auto">
            <TabsTrigger value="wallet" className="flex items-center gap-2 flex-1">
              <Wallet className="h-4 w-4" />
              Portefeuille
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2 flex-1">
              <History className="h-4 w-4" />
              Historique
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 flex-1">
              <Settings className="h-4 w-4" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wallet">
            <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Solde total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">${balance}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    ≈ {balanceInBTC} BTC
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Actions rapides</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-4 justify-start">
                  <Button
                      variant="outline"
                      onClick={() => setIsDepositModalOpen(true)}
                      className="flex items-center gap-2"
                  >
                    <ArrowDownToLine className="h-4 w-4 text-green-500" />
                    Dépôt
                  </Button>
                  <Button
                      variant="outline"
                      onClick={() => setIsWithdrawModalOpen(true)}
                      className="flex items-center gap-2"
                  >
                    <ArrowUpToLine className="h-4 w-4 text-red-500" />
                    Retrait
                  </Button>
                  <Button
                      variant="outline"
                      onClick={() => setIsSendModalOpen(true)}
                      className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4 text-blue-500" />
                    Envoyer
                  </Button>
                </CardContent>
              </Card>

              <Card className="md:col-span-2 shadow-md">
                <CardHeader>
                  <CardTitle>Mes actifs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userCryptos.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                          Vous ne possédez pas encore de crypto-monnaies
                        </div>
                    ) : (
                        userCryptos.map((crypto) => (
                            <div
                                key={crypto.id}
                                className="flex items-center justify-between p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <img
                                    src={`https://cryptologos.cc/logos/${crypto.id.toLowerCase()}-${crypto.id.toLowerCase()}-logo.png`}
                                    alt={crypto.id}
                                    className="w-8 h-8"
                                    onError={(e) => {
                                      e.currentTarget.src = 'https://cryptologos.cc/logos/question-mark-logo.png';
                                    }}
                                />
                                <div>
                                  <div className="font-medium">{
                                      cryptoList.find(c => c.id === crypto.id)?.name || crypto.id
                                  }</div>
                                  <div className="text-sm text-muted-foreground">{crypto.id}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">{crypto.quantity.toFixed(8)} {crypto.id}</div>
                                <div className="text-sm text-muted-foreground">
                                  ≈ €{crypto.eur_value.toFixed(2)}
                                </div>
                              </div>
                            </div>
                        ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="max-w-4xl mx-auto">
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

        <Dialog open={isSendModalOpen} onOpenChange={setIsSendModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Envoyer des fonds</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSendSubmit} className="space-y-4" noValidate>

              <div>
                <Label htmlFor="crypto-select">Crypto-monnaie</Label>
                <Select
                    value={selectedCrypto}
                    onValueChange={setSelectedCrypto}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez une crypto-monnaie" />
                  </SelectTrigger>
                  <SelectContent>
                    {cryptoList.map((crypto) => (
                        <SelectItem key={crypto.id} value={crypto.id}>
                          <div className="flex items-center gap-2">
                            <img
                                src={`https://cryptologos.cc/logos/${crypto.name.toLowerCase()}-${crypto.id.toLowerCase()}-logo.png`}
                                alt={crypto.name}
                                className="w-5 h-5"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://cryptologos.cc/logos/question-mark-logo.png';
                                }}
                            />
                            {crypto.name}
                          </div>
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="destination-iban">IBAN CryptoEx de destination</Label>
                <Input
                    id="destination-iban"
                    type="text"
                    placeholder="CX76 3000 6000 0112 3456 7890 189"
                    value={destinationIban}
                    maxLength={34}
                    onChange={(e) => setDestinationIban(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                    required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  L'IBAN CryptoEx doit commencer par CX et contenir 27 caractères alphanumériques.
                </p>
              </div>

              <div>
                <Label htmlFor="send-amount">Montant</Label>
                <Input
                    id="send-amount"
                    type="number"
                    placeholder="100"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    min={1}
                    required
                />
              </div>

              <DialogFooter>
                <Button type="submit">Confirmer</Button>
                <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      resetSendForm();
                      setIsSendModalOpen(false);
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
