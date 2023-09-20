import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import AlertContext from '../shared/AlertContext';
import config from '../config/config';

const RequestPasswordResetForm = () => {
    const { setAlert } = useContext(AlertContext);
    const { fetchWithAuth } = useContext(AuthContext);
    const [isLoading, setLoading] = useState(false);
    const [email, setEmail] = useState('');

    const handleResetPassword = async (event) => {
        event.preventDefault(); // Prevent form submission and page refresh

        if (email.trim() === '') {
            setAlert({ message: 'Email is required.', type: 'danger' });
            return;
        }

        try {
            setLoading(true);

            const response = await fetchWithAuth(`${config.apiBaseUrl}/user/sendResetEmail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setTimeout(() => {
                setLoading(false);
                setEmail(''); // Reset the email input
                setAlert({ message: 'Password reset email sent successfully!', type: 'success' }); // Set the alert message
                setTimeout(() => setAlert({ message: '', type: '' }), 3000); // Clear the alert after 3 seconds
            }, 3000);
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
            setAlert({ message: 'Error sending reset email.', type: 'danger' }); // Set the alert message
            setTimeout(() => setAlert({ message: '', type: '' }), 3000); // Clear the alert after 3 seconds
        }
    };


    return (
        <div className="d-flex justify-content-center align-items-center bg-dark" style={{ height: '100vh' }}>
            <div className="card shadow" style={{ width: '30rem' }}>
                <div className="card-body">
                    <form onSubmit={handleResetPassword}>
                        <h3 className="text-center w-100 py-3">
                            <Link className="navbar-brand align-items-center" to="/" >
                                <span className="fw-bold">BREACH :: HARBOR</span>
                            </Link>
                        </h3>
                        <h5 className="card-title text-center mb-4 mt-3">Reset Password</h5>
                        <hr />
                        <div className="py-3">
                            <div className="mb-4">
                                <label className="form-label">Email:</label>
                                <input
                                    type="email"
                                    className="form-control w-100"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Sending reset email...
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                        <div className="mt-3">
                            <small>
                                <Link to="/login">Back to Login</Link>
                            </small>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RequestPasswordResetForm;
