import React, { useState, useEffect } from 'react';
import { SessionProvider, useSession } from './context/SessionContext';
import { LoanEngineProvider, useLoanEngine } from './context/LoanEngineContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { HeroAIBundler } from './components/HeroAIBundler';
import { ResourceCatalog } from './components/ResourceCatalog';
import { ResourceModal } from './components/ResourceModal';
import { BundleCartDrawer } from './components/BundleCartDrawer';
import { LifecycleTracker } from './components/LifecycleTracker';
import { ListResourceModal } from './components/ListResourceModal';
import { CommunityBeaconDrawer } from './components/CommunityBeaconDrawer';
import { AdminDashboard } from './components/AdminDashboard';
import { ImpactSection } from './components/ImpactSection';
import { UserProfileModal } from './components/UserProfileModal';
import type { CampusResource } from './types/campus';
import { MOCK_RESOURCES } from './data/mockCampusData';
import { safeStorage } from './lib/safeStorage';

const MainApp: React.FC = () => {
  const { activeRole, switchRole } = useSession();
  const { setActiveOrderId } = useLoanEngine();

  const [resources, setResources] = useState<CampusResource[]>(() => {
    return safeStorage.getItem<CampusResource[]>('catalog_resources', MOCK_RESOURCES);
  });

  const [selectedResource, setSelectedResource] = useState<CampusResource | null>(null);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [listModalImage, setListModalImage] = useState<string>('');
  const [listModalFileName, setListModalFileName] = useState<string>('');
  const [isBeaconDrawerOpen, setIsBeaconDrawerOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    safeStorage.setItem('catalog_resources', resources);
  }, [resources]);

  useEffect(() => {
    const handleReset = () => {
      setResources(MOCK_RESOURCES);
      setSelectedResource(null);
      setIsListModalOpen(false);
      setListModalImage('');
      setListModalFileName('');
      setIsBeaconDrawerOpen(false);
    };
    window.addEventListener('campus_state_reset', handleReset);
    return () => window.removeEventListener('campus_state_reset', handleReset);
  }, []);

  const handleOpenListModal = (imageUrl?: string, fileName?: string) => {
    setListModalImage(imageUrl || '');
    setListModalFileName(fileName || '');
    setIsListModalOpen(true);
  };

  const handleCloseListModal = () => {
    setIsListModalOpen(false);
    setListModalImage('');
    setListModalFileName('');
  };

  const handleResourceAdded = (newRes: CampusResource) => {
    setResources(prev => [newRes, ...prev]);
  };

  const handleOrderCreated = (orderId: string) => {
    setActiveOrderId(orderId);
    // Smooth scroll down to the 10-stage lifecycle stepper
    const stepperElement = document.getElementById('lifecycle-engine');
    if (stepperElement) {
      stepperElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-indigo-600 selection:text-white flex flex-col justify-between font-sans">
      <div>
        {/* Navigation Bar */}
        <Navbar
          onOpenListModal={handleOpenListModal}
          onOpenBeaconDrawer={() => setIsBeaconDrawerOpen(true)}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
        />

        {/* View Switcher: Admin View vs Borrower/Lender View */}
        {activeRole === 'admin' ? (
          <div className="py-6">
            <AdminDashboard onClose={() => switchRole('borrower')} />
          </div>
        ) : (
          <main className="space-y-6 pb-12">
            {/* 1. Hero AI Need Bundler (PS Section 4) */}
            <HeroAIBundler
              resources={resources}
              onOpenListModal={handleOpenListModal}
            />

            {/* 2. Interactive 10-Stage Borrowing Lifecycle (PS Section 8, 9 & 10) */}
            <div id="lifecycle-engine">
              <LifecycleTracker />
            </div>

            {/* 3. Filterable Campus Resource Catalog (PS Section 2 & 3) */}
            <ResourceCatalog
              resources={resources}
              onSelectResource={setSelectedResource}
              onOpenBeaconDrawer={() => setIsBeaconDrawerOpen(true)}
              onOpenListModal={handleOpenListModal}
            />

            {/* 4. Campus Circular Impact & Sustainability Dashboard (PS Section 13) */}
            <ImpactSection />
          </main>
        )}
      </div>

      {/* Global Modals & Drawers */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <ResourceModal
        resource={selectedResource}
        onClose={() => setSelectedResource(null)}
      />

      <BundleCartDrawer onOrderCreated={handleOrderCreated} />

      {isListModalOpen && (
        <ListResourceModal
          key={`${listModalImage}-${listModalFileName}-${isListModalOpen}`}
          isOpen={isListModalOpen}
          onClose={handleCloseListModal}
          onResourceAdded={handleResourceAdded}
          initialImageUrl={listModalImage}
          initialFileName={listModalFileName}
        />
      )}

      <CommunityBeaconDrawer
        isOpen={isBeaconDrawerOpen}
        onClose={() => setIsBeaconDrawerOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 space-y-2">
        <p className="font-bold text-slate-400">
          CAMPUS CIRCULAR • WEBFUSION 2.0 Inter-College Web Development Competition
        </p>
        <p>
          Organized by CODING CLUB - CODECRAFTERS • From Ownership to Access • 100% Client-Side Local State
        </p>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <SessionProvider>
      <LoanEngineProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </LoanEngineProvider>
    </SessionProvider>
  );
}

export default App;
