import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PortfolioView } from './components/PortfolioView';
import { ApiExplorer } from './components/ApiExplorer';
import { ArchitectureDoc } from './components/ArchitectureDoc';

export default function App() {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'api-explorer' | 'architecture'>('portfolio');
  const [apiHealth, setApiHealth] = useState<string>('checking');

  useEffect(() => {
    fetch('/api/v1/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'healthy') {
          setApiHealth('healthy');
        } else {
          setApiHealth('degraded');
        }
      })
      .catch(() => setApiHealth('offline'));
  }, []);

  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col font-sans selection:bg-orange-500 selection:text-black">
      
      {/* Top Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        apiStatus={apiHealth}
      />

      {/* Main View Container */}
      <main className="flex-1">
        {activeTab === 'portfolio' && <PortfolioView />}
        {activeTab === 'api-explorer' && <ApiExplorer />}
        {activeTab === 'architecture' && <ArchitectureDoc />}
      </main>

    </div>
  );
}
