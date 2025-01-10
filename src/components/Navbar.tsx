import { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu';
import { Wallet, LineChart, User, Home, LogIn, LogOut } from 'lucide-react';

export default function Navbar() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Supprime le jeton
    localStorage.removeItem("userPseudo"); // Supprime le pseudo
    localStorage.removeItem("userEmail"); // Supprime l'email
    window.dispatchEvent(new Event("authChanged")); // Lever l'événement global pour mettre à jour la navbar
    navigate('/');
  };

  useEffect(() => {
    const updateAuthStatus = () => {
      const authToken = localStorage.getItem("authToken");
      setIsLoggedIn(!!authToken);
    };

    updateAuthStatus();

    window.addEventListener("authChanged", updateAuthStatus);

    return () => {
      window.removeEventListener("authChanged", updateAuthStatus);
    };
  }, []);


  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Wallet className="h-6 w-6" />
          <span className="font-bold">CryptoEx</span>
        </Link>
        
        <NavigationMenu className="mx-6">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/">
                <Button variant="ghost" className="flex items-center gap-2">
                  <Home className="h-4 w-4"/>
                  Accueil
                </Button>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/invest">
                <Button variant="ghost" className="flex items-center gap-2">
                  <LineChart className="h-4 w-4" />
                  Invest
                </Button>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/account">
                <Button variant="ghost" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Compte
                </Button>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

          <div className="ml-auto flex items-center space-x-4">
            {!isLoggedIn ? (
                <>
                  <Link to="/signin">
                    <Button variant="outline" className="flex items-center gap-2">
                      <LogIn className="h-4 w-4"/>
                      Connexion
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="default" className="flex items-center gap-2">
                      <LogOut className="h-4 w-4"/>
                      Inscription
                    </Button>
                  </Link>
                </>
            ) : (
                <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4"/>
                  Déconnexion
                </Button>
            )}
          </div>
        </div>
      </nav>
  );
}
