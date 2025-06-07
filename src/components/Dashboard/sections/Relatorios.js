import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faTable, faEraser, faDownload } from '@fortawesome/free-solid-svg-icons';

// --- Componentes de Placeholder para a Exibição ---

// No lugar deste, você usaria uma biblioteca como Recharts ou Chart.js
const ChartComponent = ({ type }) => (
  <div className="chart-container empty-state">
    <FontAwesomeIcon icon={faChartLine} size="3x" style={{ marginBottom: '1rem' }} />
    <p>Área do gráfico para o relatório de <strong>{type}</strong>.</p>
    <p><small>Aqui você integraria uma biblioteca de gráficos.</small></p>
  </div>
);

// Tabela simples para exibir os dados
const TableComponent = ({ type, data }) => (
  <div className="report-table">
    <table>
      <thead>
        <tr>
          <th>{data.headers[0]}</th>
          <th>{data.headers[1]}</th>
          <th>{data.headers[2]}</th>
        </tr>
      </thead>
      <tbody>
        {data.rows.map(row => (
          <tr key={row.id}>
            <td>{row.col1}</td>
            <td>{row.col2}</td>
            <td>{row.col3}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Dados de exemplo que viriam da sua API
const mockData = {
  presenca: {
    headers: ['Nome', 'Status', 'Horário do Check-in'],
    rows: [
      { id: 1, col1: 'Ana Silva', col2: 'Presente', col3: '09:02' },
      { id: 2, col1: 'Bruno Costa', col2: 'Presente', col3: '09:05' },
    ]
  },
  horarios: {
    headers: ['Horário', 'Nº de Check-ins', 'Nº de Check-outs'],
    rows: [
      { id: 1, col1: '09:00 - 10:00', col2: 15, col3: 2 },
      { id: 2, col1: '10:00 - 11:00', col2: 8, col3: 5 },
    ]
  },
  frequencia: {
    headers: ['Nome', 'Nº de Eventos', 'Última Visita'],
    rows: [
       { id: 1, col1: 'Carla Dias', col2: '5', col3: '20/05/2025' },
       { id: 2, col1: 'Daniel Martins', col2: '3', col3: '18/05/2025' },
    ]
  }
};


function Relatorios() {
  const [reportType, setReportType] = useState('');
  const [viewMode, setViewMode] = useState('chart'); // 'chart' ou 'table'

  const handleClear = () => {
    setReportType('');
    console.log('Relatório limpo.');
  };

  const handleDownload = () => {
    if (!reportType) {
      alert('Por favor, selecione um tipo de relatório para baixar.');
      return;
    }
    console.log(`Iniciando download do relatório de ${reportType}...`);
    // Aqui iria a lógica para converter os dados para CSV e fazer o download
  };

  return (
    <section className="section active" id="relatorios">
      <h2>Relatórios</h2>
      
      <div className="report-controls">
        <select 
          className="select-report" 
          value={reportType} 
          onChange={(e) => setReportType(e.target.value)}
        >
          <option value="">Selecione o tipo de relatório</option>
          <option value="presenca">Relatório de Presença</option>
          <option value="horarios">Relatório de Horários</option>
          <option value="frequencia">Relatório de Frequência</option>
        </select>
        
        {reportType && (
          <div className="view-options">
            <button 
              className={`btn-view ${viewMode === 'chart' ? 'active' : ''}`}
              onClick={() => setViewMode('chart')}
            >
              <FontAwesomeIcon icon={faChartLine} /> Gráfico
            </button>
            <button 
              className={`btn-view ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              <FontAwesomeIcon icon={faTable} /> Tabela
            </button>
          </div>
        )}
      </div>

      <div className="report-display">
        {!reportType ? (
          <div className="empty-state">Selecione um tipo de relatório para visualizar os dados.</div>
        ) : (
          viewMode === 'chart' 
            ? <ChartComponent type={reportType} /> 
            : <TableComponent type={reportType} data={mockData[reportType]} />
        )}
      </div>

      <div className="report-actions">
        <button className="btn-clear" onClick={handleClear}>
          <FontAwesomeIcon icon={faEraser} /> Limpar
        </button>
        <button className="btn-download" onClick={handleDownload} disabled={!reportType}>
          <FontAwesomeIcon icon={faDownload} /> Baixar CSV
        </button>
      </div>
    </section>
  );
}

export default Relatorios;