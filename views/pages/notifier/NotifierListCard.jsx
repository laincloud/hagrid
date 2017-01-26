import React, { Component } from "react";
import $ from "jquery";
import { STYLE_PRIMARY, STYLE_SUCCESS } from "../../common/Constants";
import SimpleButton from "../../components/SimpleButton";
import DataTable from "../../components/DataTable";
import DynamicUserSelect from "../../components/DynamicUserSelect";
import NotifierModal from "./NotifierModal";
import store from "../../common/Store";
import { connect, Provider } from "react-redux";
import {addNotifier, openNotifierModal} from "../../actions/NotifierAction";

class NotifierListCardComponent extends Component {

  componentWillUpdate() {
    $("#notifier_table").DataTable({
      autoWidth: false,
      destroy: true,
    }).destroy();
  }

  componentDidUpdate() {

    $("#notifier_table").DataTable({
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
    const tableHeader = ["ID", "Name", "Email Address", "Phone number", "Operations"];
    const deleteNotifier = this.props.deleteNotifier.bind(this);
    const alertID = this.props.alertID;
    const tableRows = [];

    this.props.notifiers.map(function(notifier, i){
      let deleteSpan = <span className="icon icon-trash"/>;
      tableRows.push([
        notifier["ID"],
        notifier["Name"],
        notifier["EmailAddress"],
        notifier["PhoneNumber"],
        <div className="btn-group btn-group-sm" role="group">
          <SimpleButton btStyle={STYLE_PRIMARY} text={deleteSpan} isOutline={false} isIcon={true} handleClick={() => deleteNotifier(notifier, alertID)}/>
        </div>
      ])
    });
    const isAuthed = this.props.alertID != 0;
    return (
      <div>
        <div className="title-bar">
          <div className="title-bar-actions">
            <form className="form form-inline" id="notifierForm">
                <DynamicUserSelect id="notifier_select_id" name="notifier_id"/>
              <div className="form-group">
                <SimpleButton text="Add" btStyle={STYLE_SUCCESS} handleClick={() => this.props.addNotifier(this.props.alertID)} isDisabled={!isAuthed}/>
              </div>

            </form>

          </div>
          <h1 className="title-bar-title">
            <span className="d-ib">Notifiers</span>
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
                <DataTable tableID="notifier_table" headers={tableHeader} rows={tableRows}/>
                <Provider store={store}>
                  <NotifierModal />
                </Provider>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    alertID: state.notifierReducer.alertID,
    notifiers: state.notifierReducer.notifiers,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addNotifier: (alertID) => dispatch(addNotifier(alertID)),
    deleteNotifier: (notifierData, alertID) => dispatch(openNotifierModal(notifierData)),
  }
}
const NotifierListCard = connect(mapStateToProps, mapDispatchToProps)(NotifierListCardComponent);

export default NotifierListCard;