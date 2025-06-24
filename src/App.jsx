// src/App.js

// 1. Importações do React e do Roteador
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 2. Importe o cliente Supabase e o nosso novo ProfileProvider
import { supabase } from './supabaseClient';
import { ProfileProvider } from './context/ProfileContext'; // <<< ADICIONADO AQUI

// 3. Seus componentes de página
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import SignUp from './components/Signup/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';

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
  const [loading, setLoading] = useState(true); // Estado para saber se a sessão inicial já foi verificada

  useEffect(() => {
    // Pega a sessão ativa na primeira vez que o app carrega
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false); // Marca que a verificação inicial terminou
    });

    // Ouve em tempo real as mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    // Limpa a inscrição
    return () => subscription.unsubscribe();
  }, []);

  // Enquanto a sessão inicial estiver sendo verificada, pode-se mostrar um loader
  if (loading) {
      return <div>Carregando...</div>; // Ou um componente de spinner mais elaborado
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

        {/* ROTA PROTEGIDA COM O CONTEXTO */}
        <Route
          path="/dashboard/*"
          element={
            session ? (
              // Se o usuário está logado, envolvemos o Dashboard com o ProfileProvider
              <ProfileProvider>
                <Dashboard />
              </ProfileProvider>
            ) : (
              // Se não está logado, redireciona para o login
              <Navigate to="/login" />
            )
          }
        />

        {/* Rota para página não encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
