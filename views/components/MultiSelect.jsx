import React, { Component } from "react";
import $ from "jquery";
import "select2";

export default class MultiSelect extends Component {

  componentDidMount() {
    const id = this.props.id;
    const syncText = this.syncText;
    $(`#select_${id}`).select2({
      tags: true,
      theme: "bootstrap",
      width: "100%",
      tokenSeparators: [",", "\n"],
    }).on("select2:select", function(e){
      syncText(e.target.selectedOptions, id);
    }).on("select2:unselect", function(e){
      syncText(e.target.selectedOptions, id);
    });
    syncText($(`#select_${id}`)[0].selectedOptions, id);
  }

  syncText(options, id) {
    let values = [];
    for(let i = 0; i < options.length; i++) {
      values.push(options[i].value);
    }
    $(`#${id}`).val(values.join(","));
  }

  render() {
    const width = this.props.width ? this.props.width : 6;
    return (
      <div className="form-group">
        <label className="col-sm-3 control-label" htmlFor={this.props.id}>{this.props.title}</label>
        <div className={`col-sm-${width}`}>
          <select
            id={"select_" + this.props.id}
            name={"select_" + this.props.name}
            className="form-control select2-hidden-accessible"
            multiple="multiple"
            type="text"
            defaultValue={this.props.defaultValue}
          >
            {
              this.props.defaultValue.map(function(value, i){
                return <option key={i} value={value}>{value}</option>
              })
            }
          </select>
          <input id={this.props.id} name={this.props.name} type="hidden"/>
        </div>
      </div>
    )
  }
}