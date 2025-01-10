import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import Navbar from '@/components/Navbar';
import Home from '@/pages/Home';
import Trading from '@/pages/Trading';
import CryptoDetails from '@/pages/CryptoDetails';
import TradingDetails from '@/pages/TradingDetails';
import Account from '@/pages/Account';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import Terms from '@/pages/Terms';

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <div className="min-h-screen bg-background">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trading" element={<Trading />} />
            <Route path="/crypto/:id" element={<CryptoDetails />} />
            <Route path="/trading/:id" element={<TradingDetails />} />
            <Route path="/account" element={<Account />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}