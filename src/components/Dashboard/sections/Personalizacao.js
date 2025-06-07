import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPalette, faImage, faUpload } from '@fortawesome/free-solid-svg-icons';

// Importe a logo padrão da sua empresa
import defaultLogo from '../../../assets/images/logo-cabeçalho.png';

function Personalizacao() {
  const [logoPreview, setLogoPreview] = useState(defaultLogo);
  const [colors, setColors] = useState({
    primary: '#7FA869',
    secondary: '#0F5DA4',
  });
  const [notification, setNotification] = useState('');
  const logoInputRef = useRef(null);
  const bgInputRef = useRef(null);

  // Aplica as cores do tema dinamicamente usando variáveis CSS
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', colors.primary);
    document.documentElement.style.setProperty('--secondary-color', colors.secondary);
  }, [colors]);

  const handleColorChange = (e) => {
    setColors({ ...colors, [e.target.id]: e.target.value });
  };

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogoPreview(URL.createObjectURL(e.target.files[0]));
    }
  };
  
  const handleBgChange = (e) => {
     if (e.target.files && e.target.files[0]) {
      const newBgUrl = URL.createObjectURL(e.target.files[0]);
      console.log("Nova imagem de fundo selecionada:", newBgUrl);
      // Lógica para aplicar a imagem de fundo iria aqui
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Salvando personalizações:", { colors, logo: logoPreview });
    // Aqui você salvaria as preferências do usuário no banco de dados
    setNotification('Personalizações aplicadas com sucesso!');
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <section className="section active" id="personalizacao">
      <h2>Personalização</h2>
      {notification && <div className="notification success show">{notification}</div>}

      <form onSubmit={handleSubmit}>
        <div className="customization-group">
          <h3><FontAwesomeIcon icon={faUpload} /> Logo da Empresa</h3>
          <div className="logo-upload">
            <img src={logoPreview} alt="Logo Preview" id="logoPreview" />
            <button type="button" className="btn-upload-logo" onClick={() => logoInputRef.current.click()}>
              Alterar Logo
            </button>
            <input type="file" ref={logoInputRef} onChange={handleLogoChange} accept="image/*" style={{ display: 'none' }} />
          </div>
        </div>

        <div className="customization-group">
          <h3><FontAwesomeIcon icon={faPalette} /> Cores do Tema</h3>
          <div className="color-picker-group">
            <div className="color-item">
              <label htmlFor="primary">Cor Primária</label>
              <input type="color" id="primary" value={colors.primary} onChange={handleColorChange} />
            </div>
            <div className="color-item">
              <label htmlFor="secondary">Cor Secundária</label>
              <input type="color" id="secondary" value={colors.secondary} onChange={handleColorChange} />
            </div>
          </div>
        </div>

        <div className="customization-group">
          <h3><FontAwesomeIcon icon={faImage} /> Imagem de Fundo</h3>
          <button type="button" className="btn-bg-image" onClick={() => bgInputRef.current.click()}>
            Escolher Imagem
          </button>
           <input type="file" ref={bgInputRef} onChange={handleBgChange} accept="image/*" style={{ display: 'none' }} />
        </div>

        <button type="submit" className="btn-submit">Aplicar Personalizações</button>
      </form>
    </section>
  );
}

export default Personalizacao;