import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Login.css';

// Importação do Logo
import logo from '../../assets/images/logo-cabeçalho.png';

function Login() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Hook para navegação

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            alert(error.error_description || error.message);
        } else {
            // Se o login for bem-sucedido, o onAuthStateChange (que vamos configurar no App.js)
            // vai detectar a sessão e o redirecionamento ocorrerá.
            navigate('/dashboard'); // Redireciona para o dashboard
        }
        setLoading(false);
    };
  }
    return (
        <div className="login-container">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    placeholder="Seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label htmlFor="password">Senha</label>
                <input
                    id="password"
                    type="password"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
        </div>
    );

  return (
    <div className="background" id="login-background">
      <div className="frame-login">
        <img src={logo} alt="Logo ToDentro" className="logo-login" />
        <hr className="linha-login" />

        {/* Exibe a mensagem de erro, se houver */}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin} className="formulario-login">
          <label htmlFor="email">Seu E-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="exemplo@email.com"
            className="input-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />

          <label htmlFor="password">Sua Senha</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="••••••••"
            className="input-senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />

          <button
            type="submit"
            className={`botao-login ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            <span className="button-text">Login</span>
          </button>
        </form>

        <div className="links-extras">
          <Link to="/forgot-password" className="esqueceu-senha">
            Esqueceu sua senha?
          </Link>
          <p>
            Não tem uma conta?{' '}
            <Link to="/signup" className="link-cadastro">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );


export default Login;