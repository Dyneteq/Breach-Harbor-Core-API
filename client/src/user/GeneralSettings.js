import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from '../auth/AuthContext';
import config from '../config/config';
import AlertContext from '../shared/AlertContext';

const GeneralSettings = ({ userData }) => {
  const { fetchWithAuth } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const [userDetails, setUserDetails] = useState({
    email: "",
    fullname: "",
  });

  useEffect(() => {
    if (userData) {
      setUserDetails((prevDetails) => ({
        email: userData.email || prevDetails.email,
        fullname: userData.fullname || prevDetails.fullname,
      }));
    }
  }, [userData]);

  const handleChange = (event) => {
    setUserDetails({
      ...userDetails,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetchWithAuth(`${config.apiBaseUrl}/user/update`, {
        method: 'PUT',
        body: JSON.stringify(userDetails),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setAlert({ message: 'User details updated successfully', type: 'success' });

    } catch (error) {
      console.error('Error:', error);
      // Display an error message to the user
      setAlert({ message: 'An error occurred while updating user details', type: 'error' });
    }
  };

  return (
    <div>
      <div className="card rounded mb-4">
        <div className="card-header p-4 mt-2 d-flex justify-content-between">
          <h5 className="m-0 fw-bold">General Settings</h5>
        </div>
        <div className="card-body p-4">
          {userData ? (
            <form onSubmit={handleSubmit}>
              <div className="mx-2">
                <div className="row mb-4">
                  <div className="col">
                    <label className="form-label">Name</label>
                    <input type="text" name="fullname" value={userDetails.fullname} onChange={handleChange} className="form-control py-3" />
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col">
                    <label className="form-label">Email</label>
                    <input type="email" name="email" value={userDetails.email} onChange={handleChange} className="form-control py-3" readOnly disabled />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary px-4 mt-3">Save</button>
              </div>
            </form>
          ) : (
            <div className="d-flex justify-content-center">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
