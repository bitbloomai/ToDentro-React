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
import Scanner from './sections/Scanner';

function Dashboard() {
  const [activeSection, setActiveSection] = useState('checkin');
  const [isModalOpen, setModalOpen] = useState(false);

  // Apenas o estado para a sidebar no mobile é necessário agora
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Função para renderizar a seção ativa (sem alterações na lógica)
  const renderSection = () => {
    switch (activeSection) {
      case 'checkin':
        return <Checkin onAddVisitor={() => setModalOpen(true)} />;
      case 'scanner':
        return <Scanner />;
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
      {/* O div principal agora usa a classe do layout Grid */}
      <div className="dashboard-layout">
        <Header setMobileSidebarOpen={setMobileSidebarOpen} />
        
        {/* A sidebar agora é um item direto do grid */}
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          // As props de 'collapsed' e 'toggle' para desktop não são mais necessárias
          isMobileSidebarOpen={isMobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />

        {/* O conteúdo também é um item direto do grid */}
        <main className="content">
          {renderSection()}
        </main>

        {/* O footer também é um item direto do grid */}
        <Footer />
      </div>
      
      {/* O modal continua fora do fluxo principal do layout */}
      <VisitorModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

export default Dashboard;
