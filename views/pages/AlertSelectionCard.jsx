import React, {Component} from "react";

export default class AlertSelectionCard extends Component {
  static get defaultProps() {
    return {
      alerts: [],
    }
  }

  render() {
    return (
      <div className="card">
        <div className="card-body">
          <form className="form form-horizontal">
            <div className="form-group form-group-lg">
              <label className="col-sm-3 control-label" htmlFor="alert_select">select an alert</label>
              <div className="col-sm-6">
                <select id="alert_select" className="custom-select-lg">
                  {
                    this.props.alerts.map(function(alert, i){
                      return <option key={i} value={alert.ID}>{alert.Name}</option>
                    })
                  }
                </select>
              </div>
              <button className="btn btn-success btn-lg btn-pill">New Alert</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}