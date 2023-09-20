import React, { useContext, useState } from 'react';
import { AuthContext } from '../auth/AuthContext';
import AlertContext from '../shared/AlertContext';
import config from '../config/config';
import { useNavigate } from 'react-router-dom';

const DeleteAccount = () => {
    const { auth, fetchWithAuth, setAuth } = useContext(AuthContext);
    const { setAlert } = useContext(AlertContext);
    const [isLoading, setLoading] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isAcknowledged, setAcknowledged] = useState(false);
    const navigate = useNavigate();

    const handleDeleteAccount = async () => {
        try {
            setLoading(true);

            if (!auth) {
                throw new Error('User not authenticated');
            }

            if (!isAcknowledged) {
                setLoading(false);
                setAlert({ message: 'Please acknowledge the irreversibility of this action.', type: 'danger' });
                return;
            }

            setAlert({ message: '', type: '' }); // Clear any existing alert message

            setTimeout(async () => {
                navigate('/'); // Redirect to the main page

                await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second

                const response = await fetchWithAuth(`${config.apiBaseUrl}/user/delete`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${auth.token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                setAuth(null);
                localStorage.removeItem('auth');

                setAlert({ message: 'Account deleted successfully!', type: 'success' });

                setTimeout(() => {
                    setAlert({ message: '', type: '' });
                }, 3000);
            }, 3000);
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
            setAlert({ message: 'Error deleting account.', type: 'danger' });

            setTimeout(() => {
                setAlert({ message: '', type: '' });
            }, 3000);
        }
    };

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleCheckboxChange = (event) => {
        setAcknowledged(event.target.checked);
    };

    return (
        <div>
            <div className="card rounded mb-4">
                <div className="card-header p-4 mt-2">
                    <h5 className="m-0 fw-bold">Close account</h5>
                </div>
                <div className="card-body pt-1 pb-4 px-4">
                    <p className="py-2">Here you can permanently delete your account</p>
                    <button className="btn btn-danger w-100" onClick={handleModalOpen}>
                        Delete Account
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-container">
                    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content shadow">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="deleteAccountModalLabel">
                                        Confirmation
                                    </h5>
                                    <button type="button" className="btn-close" aria-label="Close" onClick={handleModalClose}></button>
                                </div>
                                <div className="modal-body">
                                    <p className="text-center">
                                        Are you sure you want to delete your account? <br />
                                        This action is irreversible. <br/><br/>
                                        <span className="fw-bold">YOUR DATA WILL BE PERMANENTLY DELETED</span>
                                    </p>
                                    <div className="form-check mb-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="acknowledgeCheckbox"
                                            checked={isAcknowledged}
                                            onChange={handleCheckboxChange}
                                            required
                                        />
                                        <label className="form-check-label" htmlFor="acknowledgeCheckbox">
                                            I acknowledge that I will not be able to recover my account and/or my data
                                        </label>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleModalClose}>
                                        Cancel
                                    </button>
                                    <button type="button" className="btn btn-danger" onClick={handleDeleteAccount} disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Deleting...
                                            </>
                                        ) : (
                                            'Yes, delete my account'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show" onClick={handleModalClose}></div>
                </div>
            )}
        </div>
    );
};

export default DeleteAccount;
