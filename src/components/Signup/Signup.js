import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Signup.css';

// Importação do Logo
import logo from '../../assets/images/logo-cabeçalho.png';

function Signup() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async (event) => {
        event.preventDefault();
        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            alert(error.error_description || error.message);
        } else {
            // O Supabase envia um e-mail de confirmação por padrão.
            alert('Cadastro realizado! Verifique seu e-mail para confirmar a conta.');
        }
        setLoading(false);
    };

    return (
        <div className="signup-container">
            <h1>Crie sua conta</h1>
            <form onSubmit={handleSignup}>
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
                    {loading ? 'Cadastrando...' : 'Cadastrar'}
                </button>
            </form>
        </div>
    );
}

  return (
    <div className="background" id="signup-background">
      <div className="frame-signup">
        <img src={logo} alt="Logo ToDentro" className="logo-signup" />
        <hr className="linha-signup" />

        {/* Exibe a mensagem de erro ou sucesso */}
        {error && <div className="message error-message">{error}</div>}
        {successMessage && <div className="message success-message">{successMessage}</div>}

        <form onSubmit={handleSignUp} className="formulario-signup">
          <label htmlFor="email">Seu E-mail</label>
          <input
            type="email"
            id="email"
            placeholder="exemplo@email.com"
            className="input-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />

          <label htmlFor="password">Crie uma Senha</label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            className="input-senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />

          <label htmlFor="confirmPassword">Confirme sua Senha</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="••••••••"
            className="input-senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
          />

          <button
            type="submit"
            className={`botao-signup ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            <span className="button-text">Cadastrar</span>
          </button>
        </form>

        <div className="links-extras">
          <p>
            Já tem uma conta?{' '}
            <Link to="/login" className="link-login">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );


export default SignUp;