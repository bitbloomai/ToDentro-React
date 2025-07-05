// src/App.js

// 1. Importações do React e do Roteador
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 2. Importe o cliente Supabase e o nosso novo ProfileProvider
import { supabase } from './supabaseClient';
import { ProfileProvider } from './context/ProfileContext';

// 3. Seus componentes de página
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import SignUp from './components/Signup/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';

// --- NOVOS IMPORTS ---
import PublicRegister from './components/Public/PublicRegister'; // Página de cadastro pública
import Scanner from './components/Dashboard/sections/Scanner'; // O novo componente de scanner

import './App.css';

// Componente de página não encontrada
function NotFound() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>404 - Página Não Encontrada</h1>
      <p>A página que você está procurando não existe.</p>
      <a href="/">Voltar para a Home</a>
    </div>
  );
}

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* --- NOVA ROTA PÚBLICA PARA CADASTRO --- */}
        <Route path="/register-public/:ownerId" element={<PublicRegister />} />


        {/* ROTA PROTEGIDA COM O CONTEXTO */}
        <Route
          path="/dashboard/*"
          element={
            session ? (
              <ProfileProvider>
                <Dashboard />
              </ProfileProvider>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* --- ROTA PROTEGIDA PARA O SCANNER (EXEMPLO) --- */}
        {/* Esta rota pode ser movida para dentro do Dashboard se preferir */}
        <Route 
          path="/scanner"
          element={
            session ? <Scanner /> : <Navigate to="/login" />
          }
        />

        {/* Rota para página não encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
