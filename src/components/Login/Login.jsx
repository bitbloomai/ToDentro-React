// src/components/Login/Login.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import './Login.css';

// Importação do Logo
import logo from '../../assets/images/logo-cabeçalho.png';

function Login() {
    const [loading, setLoading] = useState(false); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage(''); 
        
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            setErrorMessage(error.message);
        } else {
            navigate('/dashboard');
        }
        setLoading(false);
    };
      
    return (
        <div className="background" id="login-background">
            <div className="frame-login">
                <Link to="/">
                            <button className="logo-login">
                                <img src={logo} alt="Logo ToDentro" className="logo-login" />
                            </button>
                          </Link>
                <hr className="linha-login" />

                {/* A exibição da mensagem de erro já estava correta. */}
                {errorMessage && <div className="error-message">{errorMessage}</div>}

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
                        disabled={loading}
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
                        disabled={loading}
                    />

                    <button
                        type="submit"
                        className={`botao-login ${loading ? 'loading' : ''}`}
                        disabled={loading}
                    >
                        {/* A lógica de texto do botão também estava ótima. */}
                        <span className="button-text">{loading ? 'Entrando...' : 'Login'}</span>
                    </button>
                </form>

                <div className="links-extras">
                    <Link to="/forgot-password" className="esqueceu-senha">
                        Esqueceu sua senha?
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;