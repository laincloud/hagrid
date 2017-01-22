import React, { Component } from "react";
import {ADMIN_PAGE, ALERT_PAGE, TCP_PAGE, GRAPHITE_PAGE, NOTIFIER_PAGE} from "../common/Constants";
import GraphiteServiceListCard from "./graphite/GraphiteServiceListCard";
import TCPServiceListCard from "./tcp/TCPServiceListCard";
import AlertListCard from "./AlertListCard";
import store from "../common/Store";
import { connect, Provider } from 'react-redux';

class ContentComponent extends Component {

  getPage() {
    switch(this.props.pageMode){
      case ALERT_PAGE:
        return <AlertListCard/>;
      case GRAPHITE_PAGE:
        return <GraphiteServiceListCard/>;
      case TCP_PAGE:
        return <TCPServiceListCard/>;
      default:
        return <AlertListCard/>;
    }
  }

  render() {
    return (
      <div className="layout-content">
          <div className="layout-content-body">
            <Provider store={store}>
            {
              this.getPage()
            }
            </Provider>
          </div>
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    pageMode: state.sideMenuReducer.pageMode,
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

const Content = connect(mapStateToProps, mapDispatchToProps)(ContentComponent);

export default Content;
