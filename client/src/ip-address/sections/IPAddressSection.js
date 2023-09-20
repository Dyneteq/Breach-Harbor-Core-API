const IPAddressSection = ({ ipAddress }) => {
  const { address, class: ipClass } = ipAddress;

  return (
    <div className="px-1 mt-5">
      <h5 className="mb-2 text-start">IP Address</h5>
      <div className="row mx-0 mt-3">
        <div className="col-md-12 mt-4">
          <div className="row">
            <div className="col-md-6">
              <table className="table table-basic">
                <tbody>
                  <tr>
                    <th className="text-end col-md-3">Address</th>
                    <td className="text-start">{address}</td>
                  </tr>
                  <tr>
                    <th className="text-end">Class</th>
                    <td className="text-start">{ipClass}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPAddressSection;
