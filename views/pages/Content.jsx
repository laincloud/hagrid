import React, { Component } from "react";
import {ADMIN_PAGE, ALERT_PAGE, TCP_PAGE, GRAPHITE_PAGE, NOTIFIER_PAGE} from "../common/Constants";
import GraphiteServiceListCard from "./graphite/GraphiteServiceListCard";
import TCPServiceListCard from "./TCPServiceListCard";
import AlertListCard from "./AlertListCard";
import { connect } from 'react-redux'


class ContentComponent extends Component {

  getPage() {
    switch(this.props.pageMode){
      case ALERT_PAGE:
        return <AlertListCard alertID={this.props.alertID}/>;
      case GRAPHITE_PAGE:
        return <GraphiteServiceListCard alertID={this.props.alertID}/>;
      default:
        return <AlertListCard alertID={this.props.alertID}/>;
    }
  }

  render() {
    return (
      <div className="layout-content">
          <div className="layout-content-body">
            <div className="row gutter-xs">
                <div className="col-md-12">
                  {
                    this.getPage()
                  }
                </div>
            </div>
          </div>
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    alertID: state.sideMenuReducer.alertID,
    pageMode: state.sideMenuReducer.pageMode,
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

const Content = connect(mapStateToProps, mapDispatchToProps)(ContentComponent);

export default Content;
