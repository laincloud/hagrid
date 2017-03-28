import React, { Component } from "react";
import { connect } from "react-redux";

class HTTPServiceTestTextAreaComponent extends Component {
  render() {
    return <div className="form-group">
      <label className="col-sm-3 control-label" htmlFor="httpTestResult">Test Result</label>
      <div className={`col-sm-9`}>
        <textarea id="httpTestResult" name="httpTestResult" rows="10" className="form-control" value={this.props.output} readOnly={true}/>
      </div>
    </div>;
  }
}

function mapStateToProps(state) {
  return {
    output: state.httpTestReducer.output,
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

const HTTPServiceTestTextArea = connect(mapStateToProps, mapDispatchToProps)(HTTPServiceTestTextAreaComponent);

export default HTTPServiceTestTextArea;

