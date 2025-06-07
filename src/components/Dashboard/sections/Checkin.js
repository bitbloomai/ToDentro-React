import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserPlus } from '@fortawesome/free-solid-svg-icons';

// Dados de exemplo - no seu app, viriam do Supabase
const initialPeople = [
    { id: 1, name: 'Ana Silva', email: 'ana.silva@example.com' },
    { id: 2, name: 'Bruno Costa', email: 'bruno.costa@example.com' },
    { id: 3, name: 'Carla Dias', email: 'carla.dias@example.com' },
];

function Checkin({ onAddVisitor }) {
  const [peopleToScan, setPeopleToScan] = useState(initialPeople);
  const [checkedInPeople, setCheckedInPeople] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCheckIn = (person) => {
    setPeopleToScan(peopleToScan.filter(p => p.id !== person.id));
    setCheckedInPeople([...checkedInPeople, person]);
  };
  
  const handleCheckOut = (person) => {
    setCheckedInPeople(checkedInPeople.filter(p => p.id !== person.id));
    setPeopleToScan([...peopleToScan, person]);
  };

  const filteredPeople = peopleToScan.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="section active" id="checkin">
      <h2>Check-in</h2>
      <div className="search-box">
        <input 
          type="text" 
          placeholder="Pesquisar pessoa..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn-search"><FontAwesomeIcon icon={faSearch} /></button>
      </div>
      <div className="checkin-area">
        <div className="checkin-list">
          <h3>Pessoas para Check-in</h3>
          <div className="people-list">
            {filteredPeople.map(person => (
              <div key={person.id} className="person-item">
                <div className="person-info">
                  <div className="person-name">{person.name}</div>
                  <div className="person-email">{person.email}</div>
                </div>
                <button className="btn-checkin" onClick={() => handleCheckIn(person)}>Check-in</button>
              </div>
            ))}
          </div>
        </div>
        <div className="checked-in-list">
          <h3>Pessoas em Check-in</h3>
          <div className="people-list">
             {checkedInPeople.map(person => (
              <div key={person.id} className="person-item">
                <div className="person-info">
                  <div className="person-name">{person.name}</div>
                  <div className="person-email">{person.email}</div>
                </div>
                <button className="btn-checkout" onClick={() => handleCheckOut(person)}>Check-out</button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button className="btn-add-visitor" onClick={onAddVisitor}>
        <FontAwesomeIcon icon={faUserPlus} /> Adicionar Visitante
      </button>
    </section>
  );
}

export default Checkin;