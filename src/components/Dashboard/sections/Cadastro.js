import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

// Dados iniciais de exemplo
const initialPeople = [
  { id: 1, nome: 'Fernanda Lima', email: 'fernanda.lima@example.com', telefone: '11987654321', documento: '12.345.678-9' },
  { id: 2, nome: 'Ricardo Alves', email: 'ricardo.alves@example.com', telefone: '21912345678', documento: '98.765.432-1' }
];

const emptyForm = { nome: '', email: '', telefone: '', documento: '' };

function Cadastro() {
  const [people, setPeople] = useState(initialPeople);
  const [formData, setFormData] = useState(emptyForm);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para adicionar nova pessoa
    // No app real, você enviaria 'formData' para o Supabase
    const newPerson = { id: Date.now(), ...formData };
    setPeople([...people, newPerson]);
    console.log('Pessoa cadastrada:', newPerson);
    setFormData(emptyForm); // Limpa o formulário
  };

  const handleDelete = (personId) => {
    // Lógica para deletar
    if (window.confirm('Tem certeza que deseja remover esta pessoa?')) {
        setPeople(people.filter(p => p.id !== personId));
        console.log('Pessoa removida:', personId);
    }
  };

  return (
    <section className="section active" id="cadastro">
      <h2>Cadastro de Pessoas</h2>
      
      <form className="cadastro-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nome">Nome Completo</label>
            <input type="text" id="nome" value={formData.nome} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={formData.email} onChange={handleInputChange} required />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="telefone">Telefone</label>
            <input type="tel" id="telefone" value={formData.telefone} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="documento">Documento</label>
            <input type="text" id="documento" value={formData.documento} onChange={handleInputChange} />
          </div>
        </div>
        
        <button type="submit" className="btn-submit">
          <FontAwesomeIcon icon={faSave} /> Cadastrar
        </button>
      </form>

      <div className="registered-people">
        <h3>Pessoas Cadastradas</h3>
        <div className="people-table">
          {/* Cabeçalho da tabela */}
          <div className="person-row" style={{ fontWeight: 'bold' }}>
              <div>Nome</div>
              <div>Email</div>
              <div>Telefone</div>
              <div>Documento</div>
              <div>Ações</div>
          </div>
          {/* Linhas da tabela */}
          {people.length > 0 ? people.map(person => (
            <div key={person.id} className="person-row">
              <div>{person.nome}</div>
              <div>{person.email}</div>
              <div>{person.telefone}</div>
              <div>{person.documento}</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn-edit"><FontAwesomeIcon icon={faEdit} /></button>
                <button className="btn-delete" onClick={() => handleDelete(person.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          )) : (
            <div className="empty-state" style={{ padding: '1rem' }}>Nenhuma pessoa cadastrada.</div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Cadastro;