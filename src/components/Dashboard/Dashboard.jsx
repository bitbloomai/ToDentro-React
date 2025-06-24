import React, { useState } from 'react';
import './Dashboard.css';

// Importando os componentes da estrutura
import Header from './shared/Header';
import Sidebar from './shared/Sidebar';
import Footer from './shared/Footer';
import VisitorModal from './shared/VisitorModal';

// Importando os componentes de cada seção
import Checkin from './sections/Checkin';
import Relatorios from './sections/Relatorios';
import Galeria from './sections/Galeria';
import Cadastro from './sections/Cadastro';
import Perfil from './sections/Perfil';
import Personalizacao from './sections/Personalizacao';
import Suporte from './sections/Suporte';

function Dashboard() {
  const [activeSection, setActiveSection] = useState('checkin');
  const [isModalOpen, setModalOpen] = useState(false);

  // sidebar
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
  const toggleSidebar = () => setSidebarCollapsed(prev => !prev);

  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);


  // Função para renderizar a seção ativa
  const renderSection = () => {
    switch (activeSection) {
      case 'checkin':
        return <Checkin onAddVisitor={() => setModalOpen(true)} />;
      case 'relatorios':
        return <Relatorios />;
      case 'galeria':
        return <Galeria />;
      case 'cadastro':
        return <Cadastro />;
      case 'perfil':
        return <Perfil />;
      case 'personalizacao':
        return <Personalizacao />;
      case 'suporte':
        return <Suporte />;
      default:
        return <Checkin onAddVisitor={() => setModalOpen(true)} />;
    }
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header setMobileSidebarOpen={setMobileSidebarOpen} />
        <div className="main-container">
          <Sidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            isCollapsed={isSidebarCollapsed}
            toggleSidebar={toggleSidebar}
            isMobileSidebarOpen={isMobileSidebarOpen}
            setMobileSidebarOpen={setMobileSidebarOpen}
          />


          <main className="content">
            {renderSection()}
          </main>
        </div>
        <Footer />
      </div>
      <VisitorModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

export default Dashboard;