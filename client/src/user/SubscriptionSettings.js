import React from 'react';

const SubscriptionSettings = () => {
    return (
        <div className="tab-content" id="subscriptionTabContent">
            <div className="tab-content py-4" id="subscriptionTabContent">
                <div className="row">
                    <div className="col-12 col-md-8">
                        <div className="card mb-4">
                            <div className="card-header p-4 mt-2">
                                <h5 className="m-0 fw-bold">Subscription Details</h5>
                            </div>
                            <div className="card-body p-4">
                                <h5><span className="badge bg-success mb-4">Active Subscription</span></h5>
                                <div className="row">
                                    <div className="col-3 fw-bold">Plan:</div>
                                    <div className="col-9">Free</div>
                                </div>
                                <div className="row">
                                    <div className="col-3 fw-bold">Billing Amount:</div>
                                    <div className="col-9">$0/month</div>
                                </div>
                                <div className="row">
                                    <div className="col-3 fw-bold">Next Bill Date:</div>
                                    <div className="col-9">January 1, 2024</div>
                                </div>
                                <div className="row">
                                    <div className="col-3 fw-bold">Plan Features:</div>
                                    <div className="col-9">Unlimited Access, Limited Support</div>
                                </div>
                                <div className="row mt-4">
                                    <div className="col-12 col-md-6 mb-3 mb-md-0">
                                        <button className="btn disabled btn-dark opacity-75 w-100">Cancel Subscription</button>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <button className="btn btn-light disabled opacity-50 w-100">Change Plan (coming soon..)</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="card mb-4">
                            <div className="card-header p-4 mt-2">
                                <h5 className="m-0 fw-bold">Payment Method</h5>
                            </div>
                            <div className="card-body pt-1 pb-4 px-2">
                                <p className="py-2 text-center text-secondary fst-italic">Free plan</p>
                                <div className="row mx-2">
                                    <div className="col-12 mb-2">
                                        <button className="btn btn-dark disabled opacity-50 w-100">Remove</button>
                                    </div>
                                    <div className="col-12">
                                        <button className="btn btn-light disabled opacity-50 w-100">Edit</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionSettings;
