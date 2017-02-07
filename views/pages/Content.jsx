import React, { Component } from "react";
import { ADMIN_PAGE, ALERT_PAGE, TCP_PAGE, GRAPHITE_PAGE, TEMPLATE_PAGE, NOTIFIER_PAGE, HELP_PAGE } from "../common/Constants";
import GraphiteServiceListCard from "./graphite/GraphiteServiceListCard";
import TCPServiceListCard from "./tcp/TCPServiceListCard";
import AlertCard from "./alert/AlertCard";
import TemplateListCard from "./template/TemplateListCard";
import AdminListCard from "./admin/AdminListCard";
import NotifierListCard from "./notifier/NotifierListCard";
import HelpCard from "./help/HelpCard";
import store from "../common/Store";
import { connect, Provider } from 'react-redux';

class ContentComponent extends Component {

  getPage() {
    switch(this.props.pageMode){
      case ALERT_PAGE:
        return <AlertCard/>;
      case GRAPHITE_PAGE:
        return <GraphiteServiceListCard/>;
      case TCP_PAGE:
        return <TCPServiceListCard/>;
      case TEMPLATE_PAGE:
        return <TemplateListCard/>;
      case ADMIN_PAGE:
        return <AdminListCard/>;
      case NOTIFIER_PAGE:
        return <NotifierListCard/>;
      case HELP_PAGE:
        return <HelpCard/>;
      default:
        return <AlertCard/>;
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
