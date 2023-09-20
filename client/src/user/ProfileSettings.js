import React from 'react';
import ResetPassword from './ResetPassword';
import GeneralSettings from './GeneralSettings';

const ProfileSettings = ({ userData }) => {
    return (
        <div className="tab-content" id="profileTabContent">
            <div className="tab-content py-4" id="profileTabContent">
                <div className="row justify-content">
                    <div className="col-12 col-md-8">
                        <GeneralSettings userData={userData} />
                    </div>
                    <div className="col-12 col-md-4">
                        <ResetPassword />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;