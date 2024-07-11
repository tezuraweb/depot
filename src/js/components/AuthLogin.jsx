import React, { useState } from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    // const history = useNavigate();

    const isEmail = (login) => /\S+@\S+\.\S+/.test(login);
    const isTin = (login) => /^\d+$/.test(login);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!isEmail(login) && !isTin(login)) {
            setError('Please enter a valid email or TIN');
            return;
        }

        try {
            const response = await axios.post('/api/login', { login, password }, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.data.success) {
                // history.push('/screens');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('Failed to login. Please check your credentials.');
        }
    };

    return (
        <div className="page__login">
            <h1 className="page__login--title">Авторизация</h1>
            <form className="form form--login" onSubmit={handleSubmit}>
                <div className="form__group">
                    <label className="form__label">Email или ИНН</label>
                    <input
                        type="text"
                        name="login"
                        className="form__input"
                        placeholder="Email или ИНН"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        required
                    />
                </div>
                <div className="form__group">
                    <label className="form__label">Пароль</label>
                    <input
                        type="password"
                        name="password"
                        className="form__input"
                        placeholder="Введите пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="form__button button button--large">Войти</button>
            </form>
        </div>
    );
};

export default Login;
