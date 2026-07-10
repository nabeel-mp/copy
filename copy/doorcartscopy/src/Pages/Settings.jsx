import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Globe, Shield, Moon, FileText, ChevronRight, Menu, Search } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/authContext';

// Rows below don't yet have a real destination/backend behind them. Rather
// than leaving them clickable-looking with no effect (a "dead button"),
// they're rendered as disabled with a "Soon" badge until the corresponding
// feature/page actually exists.
const COMING_SOON_ROWS = [
  { key: 'notifications', icon: Bell, label: 'Notifications', desc: 'Get real-time order updates' },
  { key: 'language', icon: Globe, label: 'App Language', desc: 'English (US)' },
  { key: 'security', icon: Shield, label: 'Security', desc: 'Change PIN or Password' },
  { key: 'darkMode', icon: Moon, label: 'Dark Mode', desc: 'Toggle visual theme' },
  { key: 'privacy', icon: FileText, label: 'Privacy Policy', desc: 'Data usage and legal terms' },
];

export default function Settings() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="relative w-full max-w-md mx-auto min-h-[100dvh] bg-[#f9f9fc] font-sans flex flex-col">
      <header className="w-full top-0 sticky bg-[#004aad] text-white shadow-md z-40 flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-extrabold tracking-tight">Doorcarts</h1>
        </div>
        <button aria-label="Search" className="hover:bg-white/20 p-2 rounded-full transition-colors">
          <Search size={20} />
        </button>
      </header>

      <main className="flex-grow pb-32">
        <section className="bg-[#004aad] pt-8 pb-16 px-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#005ce6] opacity-20 rounded-full -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold mb-2">Settings</h2>
            <p className="text-sm opacity-80">Manage your preferences and security</p>
          </div>
        </section>

        <div className="px-6 -mt-10 relative z-20">
          <div className="bg-white rounded-[32px] shadow-xl overflow-hidden p-5 flex flex-col gap-4 border border-gray-100">

            {COMING_SOON_ROWS.map(({ key, icon: Icon, label, desc }) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 bg-[#f9f9fc] rounded-xl opacity-60"
                aria-disabled="true"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 p-2.5 rounded-full text-[#004aad]">
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{label}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                  Soon
                </span>
              </div>
            ))}

            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <button onClick={handleLogout} className="px-8 py-3 bg-red-50 text-red-600 font-bold rounded-full w-full active:scale-95 transition-transform">
                Log Out
              </button>
              <p className="mt-4 text-xs text-gray-400 font-semibold">App Version 2.4.1</p>
            </div>
          </div>
        </div>
      </main>
      <BottomNav active="account" />
    </div>
  );
}