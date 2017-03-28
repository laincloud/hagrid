import React, { Component } from "react";
import LinkedButton from "./LinkedButton";
import $ from "jquery";
import "bootstrap";

export default class DropdownButton extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    $(`#${this.props.dropdownID}`).dropdown();
  }

  render() {
    let divClassName = `btn-group pull-right ${this.props.upOrDown}`;

    return (
      <div className={divClassName}>
        <button id={this.props.dropdownID} className="btn btn-link link-muted" data-toggle="dropdown" aria-haspopup="true">
          {this.props.buttonTitle}
        </button>
        {this.props.buttonList}
      </div>
    )
  }

}

export class DropdownButtonList extends Component {
  render() {
    return (
      <ul className="dropdown-menu dropdown-menu-right">
        {
          this.props.linkedButtons.map(function(linkedButton, i){
            return <LinkedButton key={i} url={linkedButton.url} clickParams={linkedButton.clickParams} handleClick={linkedButton.clickFunc} text={linkedButton.text}/>
          })
        }
      </ul>
    )
  }

}