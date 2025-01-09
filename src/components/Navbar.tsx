import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu';
import { Wallet, LineChart, User, Home } from 'lucide-react';

export default function Navbar() {
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
                  <Home className="h-4 w-4" />
                  Accueil
                </Button>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/trading">
                <Button variant="ghost" className="flex items-center gap-2">
                  <LineChart className="h-4 w-4" />
                  Trading
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
          <Link to="/signin">
            <Button variant="ghost">Connexion</Button>
          </Link>
          <Link to="/signup">
            <Button variant="default">Inscription</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}