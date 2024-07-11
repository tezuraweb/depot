import React, { useState } from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const AuthReset = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    // const history = useNavigate();
    const { token } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('/api/reset-password', { password, confirmPassword, token }, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.data.success) {
                setSuccess('Password reset successfully. Redirecting to login page...');
                // setTimeout(() => {
                //     history.push('/login');
                // }, 3000);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('Failed to reset password');
        }
    };

    return (
        <section className="section" id="auth-reset">
            <div className="container">
                <div className="page__login">
                    <h1 className="page__login--title">Set Password</h1>
                    <form className="form form--auth-reset" onSubmit={handleSubmit}>
                        <div className="form__group">
                            <label className="form__label">New Password</label>
                            <input 
                                type="password" 
                                name="password" 
                                className="form__input" 
                                placeholder="Enter New Password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="form__group">
                            <label className="form__label">Confirm Password</label>
                            <input 
                                type="password" 
                                name="confirmPassword" 
                                className="form__input" 
                                placeholder="Confirm Password" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        {error && <div className="error-message">{error}</div>}
                        {success && <div className="success-message">{success}</div>}
                        <button type="submit" className="form__button button button--large">Confirm</button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default AuthReset;