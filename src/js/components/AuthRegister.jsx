import React, { useState } from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

const AuthRegister = ({ mode = "signup" }) => {
    const [step, setStep] = useState(1);
    const [tin, setTin] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    // const history = useNavigate();

    const handleTinCheck = async () => {
        try {
            const response = await axios.post('api/signup/check', { tin });
            if (response.data.exists) {
                setStep(2);
            } else {
                setError('TIN does not exist');
            }
        } catch (err) {
            setError('Error checking TIN');
        }
    };

    const handleEmailVerification = async () => {
        try {
            if (mode === 'signup') {
                await axios.post('/api/signup/verify-email', { tin, email });
            } else {
                await axios.post('/api/password-reset/initiate', { tin, email });
            }
            setStep(3);
        } catch (err) {
            setError('Error sending verification code');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (mode === 'signup') {
            if (step === 1) {
                handleTinCheck();
            } else if (step === 2) {
                handleEmailVerification();
            }
        } else {
            handleEmailVerification();
        }
    };

    return (
        <div className="page__login">
            <h1 className="page__login--title">{mode === 'signup' ? 'Sign Up' : 'Reset Password'}</h1>
            <form className="form form--auth" onSubmit={handleSubmit}>
                {mode === 'signup' && step === 1 && (
                    <div className="form__group">
                        <label className="form__label">ИНН</label>
                        <input
                            type="text"
                            name="tin"
                            className="form__input"
                            placeholder="ИНН"
                            value={tin}
                            onChange={(e) => setTin(e.target.value)}
                            required
                        />
                    </div>
                )}
                {(step === 2 || mode === 'password-reset') && (
                    <>
                        <div className="form__group">
                            <label className="form__label">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form__input"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        {mode === 'password-reset' && (
                            <div className="form__group">
                                <label className="form__label">ИНН</label>
                                <input
                                    type="text"
                                    name="tin"
                                    className="form__input"
                                    placeholder="ИНН"
                                    value={tin}
                                    onChange={(e) => setTin(e.target.value)}
                                    required
                                />
                            </div>
                        )}
                    </>
                )}
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="form__button button button--large">
                    {step === 1 ? 'Next' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default AuthRegister;
