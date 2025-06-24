import React, { useState } from 'react';

function VisitorModal({ isOpen, onClose }) {
  const [name, setName] = useState('');
  const [doc, setDoc] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Novo visitante:', { name, doc });
    // Aqui você adicionaria a lógica para salvar o visitante
    onClose(); // Fecha o modal após o envio
  };

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h3>Adicionar Visitante</h3>
        <form id="visitorForm" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Nome do visitante" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
          />
          <input 
            type="text" 
            placeholder="Documento (opcional)"
            value={doc}
            onChange={(e) => setDoc(e.target.value)}
          />
          <button type="submit" className="btn-submit">Adicionar</button>
        </form>
      </div>
    </div>
  );
}

export default VisitorModal;