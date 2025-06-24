import React from 'react';
import { Link } from 'react-router-dom'; // Importar Link para navegação
import './Home.css'; // Importar o CSS

// Importação das Imagens e Ícones
// Certifique-se que os caminhos estão corretos
import logoCabecalho from '../../assets/images/logo-cabeçalho.png';
import heroImage from '../../assets/images/Imagem 1 - Hero.png';
import sobreImage from '../../assets/images/Imagem 2 - sobre.png';
import precosImage from '../../assets/images/Imegem  3 - Preços.png';
import contatoImage from '../../assets/images/Imagem 4 - Contato.png';
import logoBB from '../../assets/images/Logo BB.png';
import iconeGE from '../../assets/icons/Icone GE.svg';
import iconeCHCH from '../../assets/icons/Ichone CHCH.svg'; // Mantido com o erro de digitação do HTML original
import iconeRA from '../../assets/icons/Icone RA.svg';
import iconPhone from '../../assets/icons/Icon Phone.svg';
import iconMail from '../../assets/icons/Icone Mail.svg';
import iconGlobo from '../../assets/icons/Icone Globo Web.svg';
import iconInsta from '../../assets/icons/Icone - Insta.svg';
import instaIconRP from '../../assets/icons/Insta Icon RP.svg';
import webIconRP from '../../assets/icons/Web Icon RP.svg';

function Home() {
  // Função para rolar suavemente para uma seção
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Função para rolar para o topo da página
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="homepage-container">

      {/* # Cabeçalho */}
      <header className="header-section">
        <button className="header-logo" onClick={scrollToTop}>
          <img src={logoCabecalho} alt="Logo ToDentro" width="145" height="45" />
        </button>

        <nav className="header-nav">
          <button onClick={() => scrollToSection('sobre')}>Sobre</button>
          <button onClick={() => scrollToSection('funcionalidades')}>Funcionalidades</button>
          <button onClick={() => scrollToSection('precos')}>Preços</button>
          <button onClick={() => scrollToSection('contato')}>Contato</button>
        </nav>

        <div className="header-login-frame">
          <Link to="/login">
            <button className="header-login-btn">Login</button>
          </Link>
          <Link to="/signup">
            <button className="header-signup-btn">SignUp</button>
          </Link>
        </div>
      </header>

      {/* # Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-slogan">
            Chegou,<br />
            <span className="slogan-highlight">Tá Confirmado!</span>
          </h1>
          <p className="hero-subtitle">
            Sua plataforma de check-in e cadastro de pessoas personalizada do seu jeito!
          </p>
          <button className="hero-saiba-mais" onClick={() => scrollToSection('sobre')}>Saiba Mais</button>
        </div>
        <div className="hero-image-frame">
          <img
            src={heroImage}
            alt="Ilustração Plataforma"
            className="hero-image"
            draggable="false"
          />
        </div>
      </section>

      {/* # Sobre */}
      <section id="sobre" className="sobre-section">
        <div className="container-sobre">
          <img src={sobreImage} alt="Imagem Sobre" className="imagem-sobre" />
          <div className="texto-sobre">
            <h2>Sobre a TôDentro</h2>
            <p>A TôDentro é uma plataforma inovadora desenvolvida para simplificar o gerenciamento de eventos e personalizar experiências. Ideal para igrejas, eventos corporativos e outras organizações, nossa missão é oferecer uma solução integrada e acessível que facilite a vida tanto dos organizadores quanto dos participantes.</p>
            <h2>Nossa História</h2>
            <p>Fundada por uma equipe apaixonada por tecnologia e inovação, a TôDentro nasceu da necessidade de criar uma ferramenta que alinhasse simplicidade com robustez. Com raízes na BitBloomAI, unimos expertise em tecnologia da informação e design para desenvolver uma plataforma intuitiva e escalável.</p>
            <button className="botao-saiba-mais">Saiba Mais</button>
          </div>
        </div>
      </section>

      {/* # Funcionalidades */}
      <section id="funcionalidades" className="funcionalidades-section">
        <h2 className="titulo">Funcionalidades</h2>
        <div className="caixas-container">
          <div className="caixa">
            <img src={iconeGE} alt="Ícone Gestão de Eventos" className="icone" />
            <h3 className="funcionalidade">Gestão de Eventos</h3>
            <p className="descricao">Adapte o dashboard conforme o tipo de evento ou necessidade organizacional.</p>
          </div>
          <div className="caixa">
            <img src={iconeCHCH} alt="Ícone Check-in" className="icone" />
            <h3 className="funcionalidade">Check-in e Check-out</h3>
            <p className="descricao">Marcação de presença rápida e eficiente com relatórios em tempo real.</p>
          </div>
          <div className="caixa">
            <img src={iconeRA} alt="Ícone Relatórios" className="icone" />
            <h3 className="funcionalidade">Relatórios e Análises</h3>
            <p className="descricao">Geração de relatórios para análise da participação e engajamento.</p>
          </div>
        </div>
      </section>

      {/* # Preços */}
      <section id="precos" className="precos-section">
        <div className="titulo">
          <h2>Nossos Planos</h2>
          <h2 className="verde">E Preços!</h2>
        </div>
        <img src={precosImage} alt="Imagem de preços" className="imagem-precos" />
      </section>

      {/* # Contato */}
      <section id="contato" className="contato-section">
        <div className="imagem-contato left">
          <img src={contatoImage} alt="Imagem de contato" />
        </div>

      <div className='contato-content'>
        <div className="texto-contato">
          <h2>Fale Conosco!</h2>
        </div>
        <div className="informacoes-contato">
          <div className="informacao-contato2">
            <img src={iconPhone} alt="Ícone do telefone" />
            <span>(32) 9 9952-6526</span>
          </div>
          <div className="informacao-contato">
            <img src={iconMail} alt="Ícone do email" />
            <span>bitbloomai@gmail.com</span>
          </div>
          <div className="informacao-contato">
            <img src={iconGlobo} alt="Ícone do endereço" />
            <span>bitbloomai.com</span>
          </div>
          <div className="informacao-contato">
            <img src={iconInsta} alt="Ícone do Instagram" />
            <span>@bitbloomai</span>
          </div>
        </div>
        </div>
      </section>

      {/* # Frase de Efeito */}
      <section className="frase-efeito-section">
        <h2 className="frase-efeito">Transforme eventos em experiências inesquecíveis!</h2>
        <button className="botao-saiba-mais">Saiba Mais</button>
      </section>

      {/* # Rodapé */}
      <footer className="rodape-section">
        <div className="logo-rodape">
          <img src={logoBB} alt="Logo BitBloom" />
          <p>Copyright 2024 BitBloomAI.</p>
          <p>All rights reserved</p>
          <div className="icones-rodape">
            <a href="https://www.instagram.com/bitbloomai" target="_blank" rel="noopener noreferrer" className="icone-rodape">
              <img src={instaIconRP} alt="Ícone do Instagram" />
            </a>
            <a href="https://bitbloomai.com" target="_blank" rel="noopener noreferrer" className="icone-rodape">
              <img src={webIconRP} alt="Ícone da Internet" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;