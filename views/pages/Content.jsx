import React, {Component} from "react";
import {ADMIN_PAGE, ALERT_PAGE, TCP_PAGE, GRAPHITE_PAGE, NOTIFIER_PAGE} from "../common/Constants";
import GraphiteServiceListCard from "./GraphiteServiceListCard";
import TCPServiceListCard from "./TCPServiceListCard";
import AlertListCard from "./AlertSelectionCard";

export default class Content extends Component {

  constructor(props) {
    super(props);
    this.state = {
      alertID: 3,
      pageMode: GRAPHITE_PAGE,
    }
  }

  // set state(newState) {
  //   this.state = newState
  // }

  getPage() {
    switch(this.state.pageMode){
      case ALERT_PAGE:
        return <AlertListCard alertID={this.state.alertID}/>;
      case GRAPHITE_PAGE:
        return <GraphiteServiceListCard alertID={this.state.alertID}/>;
      default:
        return <AlertListCard alertID={this.state.alertID}/>;
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