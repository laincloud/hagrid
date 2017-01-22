import React, { Component } from "react";

export default class TagInput extends Component {

  componentDidMount() {
  }

  render() {
    const width = this.props.width ? this.props.width : 6;
    return (
      <div className="form-group">
        <label className="col-sm-3 control-label" htmlFor={this.props.id}>{this.props.title}</label>
        <div className={`col-sm-${width}`}>
          <input
            id={this.props.id}
            name={this.props.name}
            className="form-control"
            type="text"
            defaultValue={this.props.defaultValue}
            />
        </div>
      </div>
    )
  }
}