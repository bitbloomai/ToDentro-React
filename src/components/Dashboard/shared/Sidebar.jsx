import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQrcode, faChartBar, faImages, faUserPlus, faCog,
  faUser, faPalette, faHeadset,
  faSignOutAlt,
  faCamera // Ícone para o novo Scanner
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../supabaseClient';

const NavItem = ({ icon, label, sectionId, activeSection, onClick }) => (
  <button
    className={`nav-item ${activeSection === sectionId ? 'active' : ''}`}
    onClick={() => onClick(sectionId)}
  >
    <FontAwesomeIcon icon={icon} />
    <span>{label}</span>
  </button>
);

function Sidebar({ activeSection, setActiveSection, isCollapsed, toggleSidebar, isMobileSidebarOpen, setMobileSidebarOpen }) {
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${isMobileSidebarOpen
        ? 'mobile-open'
        : isCollapsed
          ? 'collapsed'
          : ''
      }`}>
      {window.innerWidth < 450 ? (
        <button className="close-mobile-sidebar" onClick={() => setMobileSidebarOpen(false)}>
          <p>X</p>
        </button>
      ) : <button className="hamburger-btn" onClick={toggleSidebar}>
        <p>☰</p>
      </button>}

      <nav className="nav-menu">
        <NavItem icon={faQrcode} label="Check-in" sectionId="checkin" activeSection={activeSection} onClick={setActiveSection} />
        {/* --- NOVO BOTÃO PARA O SCANNER --- */}
        <NavItem icon={faCamera} label="Scanner QR" sectionId="scanner" activeSection={activeSection} onClick={setActiveSection} />
        <NavItem icon={faChartBar} label="Relatórios" sectionId="relatorios" activeSection={activeSection} onClick={setActiveSection} />
        <NavItem icon={faImages} label="Galeria" sectionId="galeria" activeSection={activeSection} onClick={setActiveSection} />
        <NavItem icon={faUserPlus} label="Cadastro" sectionId="cadastro" activeSection={activeSection} onClick={setActiveSection} />
      </nav>

      <div className="sidebar-bottom">
        <div className={`settings-menu ${isSettingsOpen ? 'active' : ''}`}>
          <NavItem icon={faUser} label={!isCollapsed ? "Perfil" : ""} sectionId="perfil" activeSection={activeSection} onClick={setActiveSection} />
          <NavItem icon={faPalette} label={!isCollapsed ? "Personalização" : ""} sectionId="personalizacao" activeSection={activeSection} onClick={setActiveSection} />
          <NavItem icon={faHeadset} label={!isCollapsed ? "Suporte" : ""} sectionId="suporte" activeSection={activeSection} onClick={setActiveSection} />
          <button className="nav-item" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Sair</span>
          </button>
        </div>
        <button className="settings-btn" onClick={() => setSettingsOpen(!isSettingsOpen)}>
          <FontAwesomeIcon icon={faCog} />
          {!isCollapsed && <span>Configurações</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
