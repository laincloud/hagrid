import React, { Component } from "react";
import DataTable from "../../components/DataTable";
import { connect } from "react-redux";
import metrics from "../../common/Metric";
import Label from "../../components/Label";
import AlertFont from "../../components/AlertFont";
import { STYLE_INFO } from "../../common/Constants";

class HelpCardComponent extends Component {
  render() {
    const tableHeader = ["Description", "Formula", "Range", "Unit", "Categories"];
    let tableRows = [];
    metrics.map(function(metric, i) {
      let labels = <div>
        {
          metric["categories"].map(function(category, j){
            let key = `label_${i}_${j}`;
            return <Label key={key} labelStyle={STYLE_INFO} isOutline={true} text={category}/>
          })
        }
      </div>;
      tableRows.push([
        metric["description"],
        metric["formula"],
        metric["range"],
        metric["unit"],
        labels,
      ])
    });
    return (
      <div>
        <div className="title-bar">
          <h1 className="title-bar-title">
            <span className="d-ib">Hagrid 2.0</span>
          </h1>
        </div>
        <div className="row gutter-xs">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title fw-l">
                  Frequently used metrics
                </h4>
                <DataTable tableID="help_table" headers={tableHeader} rows={tableRows}/>
              </div>
              <div className="card-footer">
                <small>
                  <p><i><AlertFont text="$node"/></i> stands for the hostname.</p>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
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