import React from 'react';
import logoToDentro from '../../../assets/images/logo-cabeçalho.png';
import logoEmpresa from '../../../assets/images/Logo BB.png'; // Imagem de placeholder

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <img src={logoToDentro} alt="ToDentro" className="logo-todentro" />
      </div>
      <div className="header-right">
        <img src={logoEmpresa} alt="Logo Empresa" className="logo-empresa" />
      </div>
    </header>
  );
}

export default Header;