import React from 'react';
import { useProfile } from '../../../context/ProfileContext'; // Importa o hook
import logoToDentro from '../../../assets/images/logo-cabeçalho.png';

function Header({ setMobileSidebarOpen }) {
  // Pega o nome, as cores e o estado de carregamento do contexto
  const { companyName, colors, loading } = useProfile();

  // Função de segurança para renderizar o nome da empresa
  // Isso previne o erro "Objects are not valid as a React child"
  const renderCompanyName = () => {
    if (loading) {
      return 'Carregando...';
    }
    // Se companyName for um texto (string), exibe normalmente.
    if (typeof companyName === 'string' && companyName.trim() !== '') {
      return companyName;
    }
    // Se for um objeto ou um texto vazio, exibe um texto padrão e avisa no console.
    if (typeof companyName === 'object') {
      console.error("ERRO NO HEADER: 'companyName' é um objeto e não um texto. Valor recebido:", companyName);
    }
    return 'Nome do Evento'; // Retorna um valor padrão para evitar quebra
  };

  return (
    <header className="header">
      <div className="header-left">
        <img src={logoToDentro} alt="ToDentro" className="logo-todentro" />
      </div>
      <div className="header-right">
        {/* Aplica a cor secundária diretamente no estilo do h1 */}
        <h1
          className="header-company-name"
          style={{ color: colors.secondary }}
        >
          {/* Usa a nova função segura para renderizar o nome */}
          {renderCompanyName()}
        </h1>
      </div>
      {window.innerWidth < 450 && (
        <button className="hamburger-header" onClick={() => setMobileSidebarOpen(true)}>
          <p>☰</p>
        </button>
      )}
    </header>
  );
}

export default Header;
