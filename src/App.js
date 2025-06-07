// src/App.js

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 1. Importe os componentes de página que você criou
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import SignUp from './components/Signup/Signup';
import Dashboard from './components/Dashboard/Dashboard';

// (Opcional) Importe um arquivo de CSS global, se tiver
import './App.css'; 

// Um componente simples para páginas não encontradas (404)
function NotFound() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>404 - Página Não Encontrada</h1>
      <p>A página que você está procurando não existe.</p>
      {/* O <Link> é melhor, mas Navigate funciona para um redirecionamento simples */}
      <a href="/">Voltar para a Home</a>
    </div>
  );
}


function App() {
  return (
    // 2. O BrowserRouter é o cérebro que gerencia o roteamento
    <BrowserRouter>
      {/* 3. O Routes funciona como um "switch" que exibe apenas uma rota por vez */}
      <Routes>
        {/* Rota para a Página Inicial */}
        <Route path="/" element={<Home />} />

        {/* Rota para a Página de Login */}
        <Route path="/login" element={<Login />} />

        {/* Rota para a Página de Cadastro */}
        <Route path="/signup" element={<SignUp />} />

        {/* Rota para o Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Rota para o link "Esqueceu sua senha?" da página de Login */}
        {/* Ela aponta para uma página de "Não encontrado" por enquanto */}
        <Route path="/forgot-password" element={<NotFound />} />

        {/* Rota "Coringa": Se nenhuma das rotas acima corresponder, exibe a página 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;