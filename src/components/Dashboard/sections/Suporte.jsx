import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faComments } from '@fortawesome/free-solid-svg-icons';

function Suporte() {

  const handleStartChat = () => {
    console.log('Iniciando chat de suporte...');
    alert('O chat de suporte seria iniciado aqui!');
    // Em um app real, aqui você chamaria a API de um serviço de chat (Intercom, Zendesk, etc.)
  };

  return (
    <section className="section active" id="suporte">
      <h2>Suporte</h2>
      <p style={{paddingLeft: '20px', marginBottom: '2rem', maxWidth: '800px'}}>Precisa de ajuda? Entre em contato conosco através de um dos canais abaixo. Nossa equipe está pronta para te atender!</p>
      
      <div className="support-content">
        <div className="support-card">
          <FontAwesomeIcon icon={faEnvelope} />
          <h3>Email</h3>
          <p>bitbloomai@gmail.com</p>
        </div>
        <div className="support-card">
          <FontAwesomeIcon icon={faPhone} />
          <h3>Telefone</h3>
          <p>(32) 9 9952-6526</p>
        </div>
        <div className="support-card">
          <FontAwesomeIcon icon={faComments} />
          <h3>Chat Online</h3>
          <button className="btn-chat" onClick={handleStartChat}>Iniciar Chat</button>
        </div>
      </div>
    </section>
  );
}

export default Suporte;