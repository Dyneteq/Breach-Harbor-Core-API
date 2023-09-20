import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../auth/AuthContext';
import config from '../config/config';
import Navbar from '../shared/Navbar';
import ProfileSettings from './ProfileSettings';
import SubscriptionSettings from './SubscriptionSettings';
import Sidebar from '../shared/Sidebar';

const UserProfile = () => {
    const { auth, fetchWithAuth } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');
    const [showSidebar, setShowSidebar] = useState(true);

    const fetchUserData = useCallback(async () => {
        if (!auth || !auth.email) {
            return;
        }

        try {
            const response = await fetchWithAuth(`${config.apiBaseUrl}/user`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const user = await response.json();
            setUserData(user);
        } catch (error) {
            console.error('Fetching user failed', error);
        }
    }, [auth, fetchWithAuth]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    return (
        <div className="d-flex flex-column vh-100">
            <div className="d-flex flex-grow-1">

                <Sidebar auth={auth} showSidebar={showSidebar} toggleSidebar={() => setShowSidebar(!showSidebar)} />

                <div className="d-flex flex-column flex-grow-1">
                    <Navbar />

                    <div className="flex-grow-1">
                        <div className="d-flex align-items-center justify-content-center px-5">
                            <div className="container-fluid text-start mt-5">
                                <h2 className="mb-4 fw-light">User Profile</h2>
                                <div className="d-flex flex-column flex-md-row border-bottom pb-0 justify-content-start">
                                    <button type="button" className={`me-lg-2 mb-lg-0 mb-2 btn btn-outline-primary border-primary ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Profile</button>
                                    <button type="button" className={`btn btn-outline-primary border-primary ${activeTab === 'subscription' ? 'active' : ''}`} onClick={() => setActiveTab('subscription')}>Subscription</button>
                                </div>
                                {activeTab === 'profile' && <ProfileSettings userData={userData} />}
                                {activeTab === 'subscription' && <SubscriptionSettings />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
