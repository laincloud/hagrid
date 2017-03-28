import React, { Component } from "react";

export default class TextArea extends Component {
  render() {
    const width = this.props.width ? this.props.width : 6;
    return (
      <div className="form-group">
        <label className="col-sm-3 control-label" htmlFor={this.props.id}>{this.props.title}</label>
        <div className={`col-sm-${width}`}>
          <textarea id={this.props.id} name={this.props.name} rows={this.props.rows} className="form-control" defaultValue={this.props.defaultValue}/>
        </div>
      </div>
    )
  }
}