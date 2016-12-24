import React, {Component} from "react";

export default class AlertSelectionCard extends Component {

  render() {
    return (
      <div className="card">
        <div className="card-body">
          <form className="form form-horizontal">
            <div className="form-group form-group-lg">
              <label className="col-sm-3 control-label" htmlFor="alert_select">select an alert</label>
              <div className="col-sm-6">
                <select id="alert_select" className="custom-select-lg">
                  <option>1</option>
                  <option>2</option>
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