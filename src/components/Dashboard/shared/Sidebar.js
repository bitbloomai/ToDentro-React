import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faQrcode, faChartBar, faImages, faUserPlus, faCog,
  faUser, faPalette, faHeadset 
} from '@fortawesome/free-solid-svg-icons';

// O componente NavItem foi criado para evitar repetição de código
const NavItem = ({ icon, label, sectionId, activeSection, onClick }) => (
  <button
    className={`nav-item ${activeSection === sectionId ? 'active' : ''}`}
    onClick={() => onClick(sectionId)}
  >
    <FontAwesomeIcon icon={icon} />
    <span>{label}</span>
  </button>
);

function Sidebar({ activeSection, setActiveSection }) {
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  return (
    <aside className="sidebar">
      <nav className="nav-menu">
        <NavItem icon={faQrcode} label="Check-in" sectionId="checkin" activeSection={activeSection} onClick={setActiveSection} />
        <NavItem icon={faChartBar} label="Relatórios" sectionId="relatorios" activeSection={activeSection} onClick={setActiveSection} />
        <NavItem icon={faImages} label="Galeria" sectionId="galeria" activeSection={activeSection} onClick={setActiveSection} />
        <NavItem icon={faUserPlus} label="Cadastro" sectionId="cadastro" activeSection={activeSection} onClick={setActiveSection} />
      </nav>

      <div className="sidebar-bottom">
        <div className={`settings-menu ${isSettingsOpen ? 'active' : ''}`}>
           <NavItem icon={faUser} label="Perfil" sectionId="perfil" activeSection={activeSection} onClick={setActiveSection} />
           <NavItem icon={faPalette} label="Personalização" sectionId="personalizacao" activeSection={activeSection} onClick={setActiveSection} />
           <NavItem icon={faHeadset} label="Suporte" sectionId="suporte" activeSection={activeSection} onClick={setActiveSection} />
        </div>
        <button className="settings-btn" onClick={() => setSettingsOpen(!isSettingsOpen)}>
          <FontAwesomeIcon icon={faCog} />
          <span>Configurações</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;