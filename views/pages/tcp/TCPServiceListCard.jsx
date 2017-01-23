import React, {Component} from "react";
import DataTable from "../../components/DataTable";
import Label from "../../components/Label";
import { STYLE_INFO, STYLE_PRIMARY, STYLE_DEFAULT, STYLE_SUCCESS, STYLE_WARN, SIZE_PILL } from "../../common/Constants";
import { MODE_ADD, MODE_UPDATE, MODE_DELETE } from "../../common/Constants";
import $ from "jquery";
import "datatables.net-bs";
import SimpleButton from "../../components/SimpleButton";
import WordBreakText from "../../components/WordBreakText";
import TCPServiceModal from "./TCPServiceModal";
import { Provider } from "react-redux";
import store from "../../common/Store";
import { connect } from "react-redux";
import { openTCPModal } from "../../actions/TCPServiceAction";


class TCPServiceListCardComponent extends Component {

  constructor(props) {
    super(props);
  }

  componentWillUpdate() {
    $("#tcp_table").DataTable({
      autoWidth: false,
      destroy: true,
    }).destroy();
  }

  componentDidUpdate() {

    $("#tcp_table").DataTable({
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
    const tableHeader = ["ID", "Name", "Host", "Port", "Check Attempts", "Resend Time", "Enabled", "Operations"];
    const updateService = this.props.updateService.bind(this);
    const deleteService = this.props.deleteService.bind(this);
    const tableRows = [];

    this.props.tcpServices.map(function(service, i) {
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
        <WordBreakText text={service["Host"]} breakWord="."/>,
        <Label isOutline={true} labelStyle={STYLE_INFO} text={service["Port"]}/>,
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
            <span className="d-ib">TCP Service</span>
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
                <DataTable tableID="tcp_table" headers={tableHeader} rows={tableRows}/>
              </div>
              <Provider store={store}>
                <TCPServiceModal />
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
    alertID: state.tcpServiceListReducer.alertID,
    tcpServices: state.tcpServiceListReducer.tcpServices,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addService: (alertID) => dispatch(openTCPModal({AlertID: alertID}, MODE_ADD)),
    updateService: (serviceData) => dispatch(openTCPModal(serviceData, MODE_UPDATE)),
    deleteService: (serviceData) => dispatch(openTCPModal(serviceData, MODE_DELETE)),
  }
}

const TCPServiceListCard = connect(mapStateToProps, mapDispatchToProps)(TCPServiceListCardComponent);

export default TCPServiceListCard;