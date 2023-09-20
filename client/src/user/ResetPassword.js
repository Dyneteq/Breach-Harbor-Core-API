import React, { useContext, useState } from 'react';
import { AuthContext } from '../auth/AuthContext';
import AlertContext from '../shared/AlertContext';
import config from '../config/config';

const ResetPassword = () => {
  const { auth, fetchWithAuth } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const [isLoading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState(auth.email);

  const handleResetPassword = async () => {
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
        setModalOpen(false); // Close the modal here
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

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <div className="card rounded mb-4">
        <div className="card-header p-4 mt-2">
          <h5 className="m-0 fw-bold">Reset password</h5>
        </div>
        <div className="card-body pt-1 pb-4 px-4">
          <p className="py-2">Here you can reset your current password</p>
          <button className="btn btn-outline-dark w-100" onClick={handleModalOpen} disabled={isLoading}>
            Reset password
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-container">
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content shadow">
                <div className="modal-header">
                  <h5 className="modal-title" id="resetPasswordModalLabel">
                    Confirmation
                  </h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={handleModalClose}></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to reset your password?</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleModalClose}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleResetPassword}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Sending reset email...
                      </>
                    ) : (
                      'Reset'
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

export default ResetPassword;
