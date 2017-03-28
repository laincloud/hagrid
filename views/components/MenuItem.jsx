import React, { Component } from "react";

class MenuItem extends Component {

  render() {
    const icon = `sidenav-icon icon ${this.props.icon}`;
    const title = this.props.title;
    return (
      <li className="sidenav-item">
        <a onClick={this.props.handleClick}>
          <span className={icon}/>
          <span className="sidenav-label">{title}</span>
        </a>
      </li>
    )
  }
}

export default MenuItem;