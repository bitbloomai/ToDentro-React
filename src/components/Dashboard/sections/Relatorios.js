import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faTable, faSpinner, faExclamationCircle, faDownload } from '@fortawesome/free-solid-svg-icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { supabase } from '../../../supabaseClient';
import './Relatorios.css'; // Vamos criar este arquivo de estilo

// --- Componentes de Exibição ---
// Componente para o estado de carregamento
const LoadingState = () => (
  <div className="report-state">
    <FontAwesomeIcon icon={faSpinner} spin size="2x" />
    <p>Carregando dados do relatório...</p>
  </div>
);

// Componente para estado de erro
const ErrorState = ({ message }) => (
  <div className="report-state error">
    <FontAwesomeIcon icon={faExclamationCircle} size="2x" />
    <p>Ocorreu um erro:</p>
    <span>{message}</span>
  </div>
);

// Componente para estado vazio (sem dados)
const EmptyState = ({ message }) => (
  <div className="report-state">
    <p>{message}</p>
  </div>
);

// --- Componentes dos Gráficos ---

const CheckinsChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="dia" tickFormatter={(dateStr) => format(new Date(dateStr), 'dd/MM')} />
      <YAxis allowDecimals={false} />
      <Tooltip
        labelFormatter={(label) => format(new Date(label), 'PPP', { locale: ptBR })}
        formatter={(value) => [value, 'Check-ins']}
      />
      <Legend formatter={() => "Nº de Check-ins"} />
      <Bar dataKey="checkins" fill="#82ca9d" name="Check-ins" />
    </BarChart>
  </ResponsiveContainer>
);

const FrequenciaChart = ({ data }) => {
    // Usar apenas os top 10 para o gráfico de pizza não ficar poluído
    const top10 = data.slice(0, 10);
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1943', '#19A2FF', '#FFD700', '#ADFF2F', '#FF6347'];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Tooltip formatter={(value, name) => [value, name]} />
                <Legend />
                <Pie
                    data={top10}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="total_visitas"
                    nameKey="nome"
                >
                    {top10.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
};


// --- Componente da Tabela Genérica ---

const ReportTable = ({ headers, data }) => (
  <div className="report-table-container">
    <table className="report-table">
      <thead>
        <tr>
          {headers.map(h => <th key={h.key}>{h.label}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {headers.map(h => {
                let value = row[h.key];
                if (h.formatter) {
                    value = h.formatter(value);
                }
                return <td key={`${index}-${h.key}`}>{value}</td>
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);


// --- Componente Principal ---

function Relatorios() {
  const [reportType, setReportType] = useState('');
  const [viewMode, setViewMode] = useState('chart');
  const [dateRange, setDateRange] = useState({
      start: format(new Date(new Date().setDate(new Date().getDate() - 29)), 'yyyy-MM-dd'),
      end: format(new Date(), 'yyyy-MM-dd')
  });

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reportConfig = useMemo(() => ({
    checkinsPorDia: {
        title: 'Check-ins por Dia',
        rpc: 'get_checkins_por_dia',
        chart: CheckinsChart,
        tableHeaders: [
            { key: 'dia', label: 'Data', formatter: (d) => format(new Date(d), 'dd/MM/yyyy') },
            { key: 'checkins', label: 'Nº de Check-ins' }
        ],
        requiresDateRange: true
    },
    frequencia: {
        title: 'Frequência de Usuários',
        rpc: 'get_frequencia_usuarios',
        chart: FrequenciaChart,
        tableHeaders: [
            { key: 'nome', label: 'Nome' },
            { key: 'total_visitas', label: 'Total de Visitas' },
            { key: 'ultima_visita', label: 'Última Visita', formatter: (d) => format(new Date(d), 'dd/MM/yy HH:mm') }
        ],
        requiresDateRange: true
    },
    presenca: {
        title: 'Presentes Agora',
        rpc: 'get_presentes_agora',
        chart: null, // Sem gráfico para este relatório
        tableHeaders: [
            { key: 'nome', label: 'Nome' },
            { key: 'email', label: 'Email' },
            { key: 'telefone', label: 'Telefone' }
        ],
        requiresDateRange: false
    },
    pessoasCadastradas: {
        title: 'Total de Pessoas Cadastradas',
        rpc: 'get_pessoas_cadastradas',
        chart: null, // Este relatório não tem gráfico
        tableHeaders: [
            { key: 'nome', label: 'Nome' },
            { key: 'email', label: 'Email' },
            { key: 'telefone', label: 'Telefone' },
            { key: 'created_at', label: 'Data de Cadastro', formatter: (d) => format(new Date(d), 'dd/MM/yyyy') }
        ],
        requiresDateRange: false // Não precisa de filtro de data
    }
  }), []);


  useEffect(() => {
    const fetchReportData = async () => {
        if (!reportType) {
            setReportData([]);
            return;
        }

        setLoading(true);
        setError(null);

        const config = reportConfig[reportType];
        if (!config) {
            setError({ message: 'Tipo de relatório inválido.' });
            setLoading(false);
            return;
        }
        
        // Se o relatório não tiver gráfico, o padrão é tabela
        if (!config.chart) {
            setViewMode('table');
        }

        const params = config.requiresDateRange ? { start_date: dateRange.start, end_date: dateRange.end } : {};

        const { data, error } = await supabase.rpc(config.rpc, params);

        if (error) {
            console.error(`Erro ao buscar relatório [${config.rpc}]:`, error);
            setError(error);
            setReportData([]);
        } else {
            setReportData(data);
        }

        setLoading(false);
    };

    fetchReportData();
  }, [reportType, dateRange, reportConfig]);


  const handleDateChange = (e) => {
    setDateRange(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleExportCSV = () => {
    if (reportData.length === 0) {
        alert("Não há dados para exportar.");
        return;
    }

    const config = reportConfig[reportType];
    const headers = config.tableHeaders.map(h => h.label);
    const keys = config.tableHeaders.map(h => h.key);
    
    const csvContent = [
        headers.join(','),
        ...reportData.map(row => 
            keys.map(key => {
                let value = row[key] || '';
                // Escapar vírgulas e aspas
                value = String(value).replace(/"/g, '""');
                if (String(value).includes(',')) {
                    value = `"${value}"`;
                }
                return value;
            }).join(',')
        )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${reportType}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  const CurrentChart = reportType ? reportConfig[reportType].chart : null;

  return (
    <section className="section active" id="relatorios">
      <div className="report-header">
        <h2>Relatórios</h2>
        <button className="btn-download" onClick={handleExportCSV} disabled={!reportType || reportData.length === 0}>
            <FontAwesomeIcon icon={faDownload} /> Baixar CSV
        </button>
      </div>
      
      <div className="report-controls">
        <div className="control-group">
            <label htmlFor="report-select">Tipo de Relatório</label>
            <select 
                id="report-select"
                className="select-report" 
                value={reportType} 
                onChange={(e) => setReportType(e.target.value)}
            >
            <option value="">Selecione...</option>
            <option value="checkinsPorDia">Check-ins por Dia</option>
            <option value="frequencia">Frequência de Usuários</option>
            <option value="presenca">Presentes Agora</option>
            <option value="pessoasCadastradas">Total de Cadastrados</option>
            </select>
        </div>

        {reportType && reportConfig[reportType].requiresDateRange && (
            <>
            <div className="control-group">
                <label htmlFor="start-date">Data de Início</label>
                <input type="date" id="start-date" name="start" value={dateRange.start} onChange={handleDateChange} />
            </div>
            <div className="control-group">
                <label htmlFor="end-date">Data de Fim</label>
                <input type="date" id="end-date" name="end" value={dateRange.end} onChange={handleDateChange} />
            </div>
            </>
        )}
        
        {reportType && CurrentChart && (
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
          <EmptyState message="Selecione um tipo de relatório para começar." />
        ) : loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error.message} />
        ) : reportData.length === 0 ? (
          <EmptyState message="Nenhum dado encontrado para os filtros selecionados." />
        ) : (
          <>
            {viewMode === 'chart' && CurrentChart && <CurrentChart data={reportData} />}
            {viewMode === 'table' && <ReportTable headers={reportConfig[reportType].tableHeaders} data={reportData} />}
          </>
        )}
      </div>
    </section>
  );
}

export default Relatorios;