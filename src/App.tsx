import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './components/public/LandingPage';
import { ClientLayout } from './components/client/ClientLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import { AuthModal } from './components/auth/AuthModal';

const MainApp: React.FC = () => {
  const { userRole, setUserRole } = useApp();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState<'client' | 'admin'>('client');

  // Check URL hash or query for direct admin access if needed
  useEffect(() => {
    const hash = window.location.hash;
    const search = window.location.search;
    if (hash === '#admin' || search.includes('role=admin')) {
      setUserRole('admin');
    }
  }, [setUserRole]);

  const handleOpenLogin = (role: 'client' | 'admin' = 'client') => {
    setAuthModalRole(role);
    setAuthModalOpen(true);
  };

  const handleOpenDemoDashboard = () => {
    setUserRole('client');
  };

  return (
    <>
      {userRole === 'public' && (
        <LandingPage
          onOpenLogin={handleOpenLogin}
          onOpenDemoDashboard={handleOpenDemoDashboard}
        />
      )}

      {userRole === 'client' && <ClientLayout />}

      {userRole === 'admin' && <AdminLayout />}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialRole={authModalRole}
      />
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
