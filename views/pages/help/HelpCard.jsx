import React, { Component } from "react";
import { connect } from "react-redux";

class HelpCardComponent extends Component {
  render() {
    return (
      <div></div>
    )
  }
}

function mapStateToProps() {
  return {}
}

function mapDispatchToProps() {
  return {}
}

const HelpCard = connect(mapStateToProps, mapDispatchToProps)(HelpCardComponent);

export default HelpCard;