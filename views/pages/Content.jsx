import React, {Component} from "react";
import AlertSelectionCard from "./AlertSelectionCard";
import GraphiteServiceListCard from "./GraphiteServiceListCard";

export default class Content extends Component {
  render() {
    return (
      <div className="layout-content">
          <div className="layout-content-body">
            <div className="row gutter-xs">
              <div className="col-md-12">
                <AlertSelectionCard />
              </div>
            </div>
            <div className="row gutter-xs">
              <div className="col-md-12">
                <GraphiteServiceListCard />
              </div>
            </div>
          </div>
      </div>

    )
  }
}