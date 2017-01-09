import React, {Component} from "react";
import DataTable from "../components/DataTable";

export default class TCPServiceListCard extends Component {

  get defaultProps() {
    return {
      id: 0,
      graphiteServices: [
        {
          id: 1,
          name: 2
        }
      ]
    }
  }

  componentWillMount() {

  }

  render() {
    const tableHeader = ["Name", "Metric", "Check Type", "Warning", "Critical", "Check Attempts", "Resend Time", "Enabled", ""];

    const tableRows = [];
    return (
      <div className="card">
        <div className="card-header">
          <h2>TCP Services</h2>
        </div>
        <div className="card-body">
        </div>
      </div>
    )
  }
}