import React, {Component} from "react";
import DataTable from "../../components/DataTable";
import Label from "../../components/Label";
import { STYLE_INFO, STYLE_PRIMARY, STYLE_DEFAULT, STYLE_DANGER, STYLE_SUCCESS, STYLE_WARN, SIZE_PILL } from "../../common/Constants";
import { MODE_ADD, MODE_UPDATE, MODE_DELETE } from "../../common/Constants";
import "datatables.net-bs";
import SimpleButton from "../../components/SimpleButton";
import WordBreakText from "../../components/WordBreakText";
import GraphiteServiceModal from "./GraphiteServiceModal";
import { Provider } from "react-redux";
import store from "../../common/Store";
import { connect } from "react-redux";
import { openGraphiteModal } from "../../actions/GraphiteServiceAction";


class GraphiteServiceListCardComponent extends Component {

  constructor(props) {
    super(props);
  }

  componentWillUpdate() {
    $("#graphite_table").DataTable({
      autoWidth: false,
      destroy: true,
    }).destroy();
  }

  componentDidUpdate() {

    $("#graphite_table").DataTable({
      columnDefs: [{
        orderable: false,
        targets: [-1]
      }],
      dom: "<'row'<'col-sm-6'i><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-12'p>>",
      info: true,
      language: {
        paginate: {
          previous: '&laquo;',
          next: '&raquo;'
        }
      },
      order: [[0, "asc"]],
      searching: true,
      destroy: true,
      autoWidth: false,
    });

  }

  render() {
    const tableHeader = ["ID", "Name", "Metric", "Check Type", "Warning", "Critical", "Check Attempts", "Resend Time", "Enabled", "Operations"];
    const updateService = this.props.updateService.bind(this);
    const deleteService = this.props.deleteService.bind(this);
    const tableRows = [];

    this.props.graphiteServices.map(function(service, i) {
      let enabledLabel = <Label isOutline={true} labelStyle={STYLE_WARN} text="No"/>;
      if (service["Enabled"]) {
        enabledLabel = <Label isOutline={true} labelStyle={STYLE_SUCCESS} text="Yes"/>;
      }
      let updateSpan = <span className="icon icon-edit"/>;
      let deleteSpan = <span className="icon icon-trash"/>;
      let actionGroup = <div className="btn-group btn-group-sm" role="group">
        <SimpleButton btStyle={STYLE_SUCCESS} text={updateSpan} isOutline={false} isIcon={true} handleClick={() => updateService(service)}/>
        <SimpleButton btStyle={STYLE_PRIMARY} text={deleteSpan} isOutline={false} isIcon={true} handleClick={() => deleteService(service)}/>
      </div>;
      tableRows.push([
        service["ID"],
        service["Name"],
        <WordBreakText text={service["Metric"]} breakWord="."/>,
        <Label isOutline={true} labelStyle={STYLE_INFO} text={service["CheckType"]}/>,
        <Label isOutline={true} labelStyle={STYLE_DANGER} text={service["Warning"]}/>,
        <Label isOutline={true} labelStyle={STYLE_PRIMARY} text={service["Critical"]}/>,
        <Label isOutline={true} labelStyle={STYLE_DEFAULT} text={service["CheckAttempts"]}/>,
        <Label isOutline={true} labelStyle={STYLE_DEFAULT} text={service["ResendTime"] != 0 ? service["ResendTime"] : "Never"}/>,
        enabledLabel,
        actionGroup,
      ]);
    });

    const isAuthed = this.props.alertID != 0;
    return (
      <div>
        <div className="title-bar">
          <div className="title-bar-actions">
            <SimpleButton text="New Service" btSize={SIZE_PILL} btStyle={STYLE_SUCCESS} handleClick={() => this.props.addService(this.props.alertID)} isDisabled={!isAuthed}/>
          </div>
          <h1 className="title-bar-title">
            <span className="d-ib">Graphite Service</span>
          </h1>
          {
            function() {
              if (!isAuthed) {
                return <p className="title-bar-description">
                  <small>You must select an alert first.</small>
                </p>
              }
            }()
          }
        </div>
        <div className="row gutter-xs">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <DataTable tableID="graphite_table" headers={tableHeader} rows={tableRows}/>
              </div>
              <Provider store={store}>
                <GraphiteServiceModal />
              </Provider>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    alertID: state.graphiteServiceListReducer.alertID,
    graphiteServices: state.graphiteServiceListReducer.graphiteServices,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addService: (alertID) => dispatch(openGraphiteModal({AlertID: alertID}, MODE_ADD)),
    updateService: (serviceData) => dispatch(openGraphiteModal(serviceData, MODE_UPDATE)),
    deleteService: (serviceData) => dispatch(openGraphiteModal(serviceData, MODE_DELETE)),
  }
}

const GraphiteServiceListCard = connect(mapStateToProps, mapDispatchToProps)(GraphiteServiceListCardComponent);

export default GraphiteServiceListCard;