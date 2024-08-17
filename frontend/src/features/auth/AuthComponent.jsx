import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser, login, register } from './authSlice';

const AuthComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);

    const handleLogin = () => {
        dispatch(login({ username, password }))
            .then(() => {
                dispatch(fetchCurrentUser());
            });
    };

    const handleRegister = () => {
        dispatch(register({ username, password }));
    };

    return (
        <div>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleRegister}>Register</button>
            {auth.status === 'failed' && <p>{auth.error}</p>}
        </div>
    );
};

export default AuthComponent;
