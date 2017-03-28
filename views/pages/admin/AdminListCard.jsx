import React, { Component } from "react";
import $ from "jquery";
import { STYLE_PRIMARY, STYLE_SUCCESS } from "../../common/Constants";
import SimpleButton from "../../components/SimpleButton";
import DataTable from "../../components/DataTable";
import DynamicUserSelect from "../../components/DynamicUserSelect";
import AdminModal from "./AdminModal";
import store from "../../common/Store";
import { connect, Provider } from "react-redux";
import {addAdmin, openAdminModal} from "../../actions/AdminAction";

class AdminListCardComponent extends Component {

  componentWillUpdate() {
    $("#admin_table").DataTable({
      autoWidth: false,
      destroy: true,
    }).destroy();
  }

  componentDidUpdate() {

    $("#admin_table").DataTable({
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
    const deleteAdmin = this.props.deleteAdmin.bind(this);
    const alertID = this.props.alertID;
    const tableRows = [];

    this.props.admins.map(function(admin, i){
      let deleteSpan = <span className="icon icon-trash"/>;
      tableRows.push([
        admin["ID"],
        admin["Name"],
        admin["EmailAddress"],
        admin["PhoneNumber"],
        <div className="btn-group btn-group-sm" role="group">
          <SimpleButton btStyle={STYLE_PRIMARY} text={deleteSpan} isOutline={false} isIcon={true} handleClick={() => deleteAdmin(admin, alertID)}/>
        </div>
      ])
    });
    const isAuthed = this.props.alertID != 0;
    return (
      <div>
        <div className="title-bar">
          <div className="title-bar-actions">
            <form className="form form-inline" id="adminForm">
                <DynamicUserSelect id="admin_select_id" name="admin_id"/>
              <div className="form-group">
                <SimpleButton text="Add" btStyle={STYLE_SUCCESS} handleClick={() => this.props.addAdmin(this.props.alertID)} isDisabled={!isAuthed}/>
              </div>

            </form>

          </div>
          <h1 className="title-bar-title">
            <span className="d-ib">Administrators</span>
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
                <DataTable tableID="admin_table" headers={tableHeader} rows={tableRows}/>
                <Provider store={store}>
                  <AdminModal />
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
    alertID: state.adminReducer.alertID,
    admins: state.adminReducer.admins,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addAdmin: (alertID) => dispatch(addAdmin(alertID)),
    deleteAdmin: (adminData, alertID) => dispatch(openAdminModal(adminData)),
  }
}
const AdminListCard = connect(mapStateToProps, mapDispatchToProps)(AdminListCardComponent);

export default AdminListCard;