import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { login, register } from './authSlice';
import '../../css/auth.css'

const AuthComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogin = () => {
        dispatch(login({ username, password }))
            .then(() => {
                if (auth.status === 'failed') {
                    navigate('/signup')
                } else {
                    navigate('/');
                }
            })
            .catch((error) => {
                console.error('Login failed:', error);
            });
    };

    const handleRegister = () => {
        dispatch(register({ username, password }))
            .then(() => {
                navigate('/');
            })
            .catch((error) => {
                console.error('Registration failed:', error);
            });
    };

    const isLoginPage = location.pathname === '/login';
    const isSignUpPage = location.pathname === '/signup';

    return (
        <main className="auth-container">
            <div className="auth-form">
                <h1 className="auth-title">{isLoginPage ? 'Login' : 'Signup'}</h1>
                <input
                    type="text"
                    id="username"
                    className="auth-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <input
                    type="password"
                    id="password"
                    className="auth-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                {isLoginPage && (
                    <button id="login-button" className="auth-button" onClick={handleLogin}>
                        Login
                    </button>
                )}
                {isSignUpPage && (
                    <button id="register-button" className="auth-button" onClick={handleRegister}>
                        Signup
                    </button>
                )}
                {auth.status === 'failed' && <p className="auth-error">{auth.error}</p>}
            </div>
        </main>
    );
};

export default AuthComponent;
