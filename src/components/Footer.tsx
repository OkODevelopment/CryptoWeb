import React from 'react';
import { Wallet } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-6 border-t border-border hover:bg-muted/50 transition-colors">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Logo ou Nom de l'Application */}
        <div className="mb-4 md:mb-0 flex items-center space-x-2">
        <Wallet className="h-6 w-6" />
          <h1 className="text-xl font-bold">CryptoEx</h1>
        </div>

        {/* Liens Utiles */}
        <div className="flex space-x-4 mb-4 md:mb-0">
          <a href="/about" className="hover:text-gray-400">À Propos</a>
          <a href="/contact" className="hover:text-gray-400">Contact</a>
          <a href="/terms" className="hover:text-gray-400">Termes & Conditions</a>
        </div>

        {/* Informations Légales */}
        <div className="text-sm">
          &copy; {new Date().getFullYear()} CryptoWeb. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
