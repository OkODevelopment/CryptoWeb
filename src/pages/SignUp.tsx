import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pseudo, setPseudo] = useState(''); // Nouveau champ pour le pseudo
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, pseudo }), // Envoi du pseudo avec l'email et le mot de passe
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', 'your-token'); // Stocker un jeton
        localStorage.setItem('userPseudo', pseudo); // Stocker le pseudo
        alert(`Inscription réussie !`);
        navigate('/account'); // Redirection
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Créer un compte</CardTitle>
            <CardDescription>
              Commencez votre voyage dans le trading de cryptomonnaies
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pseudo">Pseudo</Label>
                <Input
                    id="pseudo"
                    type="text"
                    placeholder="Choisissez un pseudo"
                    value={pseudo}
                    onChange={(e) => setPseudo(e.target.value)}
                    required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="exemple@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    required
                />
                <label
                    htmlFor="terms"
                    className="text-sm text-muted-foreground"
                >
                  J'accepte les{' '}
                  <Link to="/terms" className="text-primary hover:underline">
                    conditions d'utilisation
                  </Link>
                </label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={!acceptTerms}>
                S'inscrire
              </Button>
              <div className="text-sm text-center text-muted-foreground">
                Déjà un compte ?{' '}
                <Link to="/signin" className="text-primary hover:underline">
                  Se connecter
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
  );
}
