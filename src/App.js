// src/App.js

// 1. Importe os hooks 'useState' e 'useEffect' do React
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 2. Importe o cliente Supabase que criamos
import { supabase } from './supabaseClient';

// Seus componentes de página
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import SignUp from './components/Signup/Signup'; 
import Dashboard from './components/Dashboard/Dashboard';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';

import './App.css'; 

// Componente de página não encontrada (mantido como está)
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
  // 3. Estado para guardar a sessão do usuário. Se for 'null', ele não está logado.
  const [session, setSession] = useState(null);

  // 4. useEffect para verificar a sessão quando o app carrega e ouvir mudanças
  useEffect(() => {
    // Pega a sessão ativa na primeira vez que o app carrega
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Ouve em tempo real as mudanças na autenticação (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log(`EVENTO DO SUPABASE: ${Event}`, session);
        setSession(session);
      }
    );

    // Limpa a inscrição quando o componente App é "desmontado"
    return () => subscription.unsubscribe();
  }, []); // O array vazio [] garante que isso só rode uma vez na montagem do componente

  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* 5. LÓGICA DA ROTA PROTEGIDA 
          - Se 'session' existir (usuário logado), renderiza o <Dashboard />.
          - Se 'session' for nulo, redireciona o usuário para a página de login.
          - O "/*" no path permite que o Dashboard tenha suas próprias sub-rotas (ex: /dashboard/perfil).
        */}
        <Route 
          path="/dashboard/*" 
          element={session ? <Dashboard /> : <Navigate to="/login" />} 
        />
        
        {/* Suas outras rotas */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;