import React, {Component} from "react";
import DataTable from "../../components/DataTable";
import Label from "../../components/Label";
import { STYLE_INFO, STYLE_PRIMARY, STYLE_DEFAULT, STYLE_DANGER, STYLE_SUCCESS, STYLE_WARN } from "../../common/Constants";
import { MODE_ADD, MODE_UPDATE, MODE_DELETE } from "../../common/Constants";
import $ from "jquery";
import "datatables.net-bs";
import DropdownButton, { DropdownButtonList } from "../../components/DropdownButton";
import hToastr from "../../components/HagridToastr";
import WordBreakText from "../../components/WordBreakText";
import GraphiteServiceModal from "./GraphiteServiceModal";
import { Provider } from "react-redux";
import store from "../../common/Store";
import { openGraphiteModal } from "../../actions/GraphiteServiceAction";


export default class GraphiteServiceListCard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      graphiteServices: [],
    };
  }

  componentWillMount() {
    this.fetchGraphiteServices();
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
      searching: false,
      destroy: true,
    });
  }

  fetchGraphiteServices() {
    $.ajax(
      `/api/alerts/${this.props.alertID}/graphiteservices/all`,
      {
        method: "GET",
        dataType: "json",
        success: function(data) {
          this.setState({graphiteServices: data})
        }.bind(this),
        error: function(xhr, status, err) {
          hToastr.error(JSON.parse(xhr.responseText)["error"]);
        }.bind(this)
      }
    )
  }

  updateService(serviceData) {
    store.dispatch(openGraphiteModal(serviceData, MODE_UPDATE));
  }

  deleteService(serviceData) {
    store.dispatch(openGraphiteModal(serviceData, MODE_DELETE));
    // $.ajax(
    //   `/api/alerts/${this.props.alertID}/graphiteservices/${id}`,
    //   {
    //     method: "DELETE",
    //     dataType: "json",
    //     success: function() {
    //       hToastr.warning("Graphite service has been deleted");
    //       this.fetchGraphiteServices();
    //     }.bind(this),
    //     error: function(xhr, status, err) {
    //       console.log(xhr.responseText)
    //     }.bind(this)
    //   }
    // )
  }

  render() {
    const tableHeader = ["ID", "Name", "Metric", "Check Type", "Warning", "Critical", "Check Attempts", "Resend Time", "Enabled", ""];
    const updateService = this.updateService.bind(this);
    const deleteService = this.deleteService.bind(this);
    const tableRows = [];
    this.state.graphiteServices.map(function(service, i) {
      let enabledLabel = <Label isOutline={false} labelStyle={STYLE_WARN} text="No"/>;
      if (service["Enabled"]) {
        enabledLabel = <Label isOutline={false} labelStyle={STYLE_SUCCESS} text="Yes"/>;
      }
      let buttonTitle = <span className="icon icon-ellipsis-h icon-lg icon-fw"/>;
      let actionButtons = [{
        url: "#",
        clickFunc: updateService,
        clickParams: [service],
        text: "Update",
      },{
        url: "#",
        clickFunc: deleteService,
        clickParams: [service],
        text: "Delete",
      }];
      let actionButtionList = <DropdownButtonList linkedButtons={actionButtons}/>;
      let actionDropDown = <DropdownButton key={i} dropdownID={`dropdownbutton_${i}`} buttonTitle={buttonTitle} upOrDown="dropdown" buttonList={actionButtionList}/>;
      tableRows.push([
        service["ID"],
        service["Name"],
        <WordBreakText text={service["Metric"]} breakWord="."/>,
        <Label isOutline={true} labelStyle={STYLE_INFO} text={service["CheckType"]}/>,
        <Label isOutline={true} labelStyle={STYLE_DANGER} text={service["Warning"]}/>,
        <Label isOutline={true} labelStyle={STYLE_PRIMARY} text={service["Critical"]}/>,
        <Label isOutline={true} labelStyle={STYLE_DEFAULT} text={service["CheckAttempts"]}/>,
        <Label isOutline={true} labelStyle={STYLE_DEFAULT} text={service["ResendTime"]}/>,
        enabledLabel,
        actionDropDown,
      ]);
    });
    return (
      <div className="card">
        <div className="card-header">
          <h2>Graphite Services</h2>
        </div>
        <div className="card-body">
          <DataTable tableID="graphite_table" headers={tableHeader} rows={tableRows}/>
        </div>
        <Provider store={store}>
          <GraphiteServiceModal />
        </Provider>
      </div>
    )
  }
}