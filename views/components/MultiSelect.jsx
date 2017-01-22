import React, { Component } from "react";
import $ from "jquery";
import "select2";

export default class MultiSelect extends Component {

  componentDidMount() {
    $(`#${this.props.id}`).select2({
      tags: true,
      theme: "bootstrap",
      width: "100%",
      tokenSeparators: [",", "\n"],
    })
  }

  render() {
    const width = this.props.width ? this.props.width : 6;
    return (
      <div className="form-group">
        <label className="col-sm-3 control-label" htmlFor={this.props.id}>{this.props.title}</label>
        <div className={`col-sm-${width}`}>
          <select
            id={this.props.id}
            name={this.props.name}
            className="form-control select2-hidden-accessible"
            multiple="multiple"
            type="text"
          >
            {
              this.props.defaultValue.map(function(value, i){
                return <option key={i} value={value} selected="selected">{value}</option>
              })
            }
          </select>
        </div>
      </div>
    )
  }
}