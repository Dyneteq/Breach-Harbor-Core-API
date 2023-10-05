import React, { useState } from 'react';

const CollectorAddNewModal = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [ipAddress, setIpAddress] = useState("");

  return (
    <div className={isOpen ? "modal-container" : ""}>
      <div className={`modal fade ${isOpen ? 'show d-block' : ''}`} id="collectorModal" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content shadow">
            <div className="modal-header">
              <h5 className="modal-title">Add a new Collector</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <form onSubmit={onSubmit}>
              <div className="modal-body">
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="form-control mb-3" required />
                <input type="text" value={ipAddress} onChange={e => setIpAddress(e.target.value)} placeholder="IP Address" className="form-control mb-3" required />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {isOpen && <div className="modal-backdrop fade show" onClick={onClose}></div>}
    </div>
  );
};

export default CollectorAddNewModal;
