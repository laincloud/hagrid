import React, { Component } from "react";
import $ from "jquery";
import "select2";

export default class Select extends Component {

  componentDidMount() {
    $(`#${this.props.id}`).select2({
      theme: "bootstrap",
      width: "100%",
    })
  }

  render() {
    const width = this.props.width ? this.props.width : 6;
    return (
      <div className="form-group">
        <label className="col-sm-3 control-label" htmlFor={this.props.id}>{this.props.title}</label>
        <div className={`col-sm-${width}`}>
          <select id={this.props.id} name={this.props.name} className="form-control" defaultValue={this.props.defaultValue}>
            {
              this.props.options.map(function(row, i){
                return <option key={i} value={row.value}> {row.text} </option>
              })
            }
          </select>
        </div>
      </div>
    )
  }
}