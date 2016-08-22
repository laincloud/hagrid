import React from 'react'
import ReactDOM from 'react-dom'
import {popUpMessagePanel} from './Common'

var AddAdminForm = React.createClass({

    addAdmin: function() {
        var formData = {
            adminID: this.refs.adminSelector.value
        }
        $.ajax({
            url: "/api/admins/?alert_id="+this.props.alertID,
            method: "POST",
            cache: false,
            data: formData,
            success: function(data) {
                popUpMessagePanel(data, true);
                this.props.afterAdd();
            }.bind(this),
            error: function(xhr, status, err) {
                popUpMessagePanel(xhr.responseText, false)
            }.bind(this)
        })
    },

    componentDidMount: function() {
        $("#add_admin_select").select2({
            placeholder: "Select a administrator",
            ajax: {
                url: "/api/users/all",
                dataType: 'json',
                delay: 100,
                cache: true,
                data: function (params) {
                    return {
                        name: params.term,
                    };
                },
                processResults: function(data) {
                    return {
                        results: $.map(data,
                            function(obj) {
                                return { id: obj.ID, text: obj.Name };
                            })
                    }
                }
            }
        });
    },

    render: function() {
        return (
            <form className="form-horizontal form-label-left">

                <div className="form-group">
                    <label className="col-sm-6 control-label">Add a new administrator </label>

                    <div className="col-sm-3">
                        <div className="input-group">
                                <select id="add_admin_select" ref="adminSelector" className="form-control" style={{"width":"100%", "height": "inherit"}} tabIndex="-1">
                                </select>
                                <span className="input-group-btn"></span>
                                <span className="input-group-btn">
                                    <button type="button" className="btn btn-success" onClick={this.addAdmin}>Add</button>
                                </span>
                        </div>
                    </div>
                 </div>
            </form>
        )
    }
})

var AdminRow = React.createClass({


    handleDelete: function() {
        $.ajax({
            url: "/api/admins/" +this.props.admin.ID + "?alert_id=" + this.props.alertID,
            method: "DELETE",
            cache: false,
            success: function(data) {
                popUpMessagePanel("Delete administrator successfully", true);
                this.props.afterChange();
            }.bind(this),
            error: function(xhr, status, err) {
                popUpMessagePanel(xhr.responseText, false)
            }.bind(this)
        });
    },

    render: function() {
        var rowClass = "odd";

        if (this.props.rowID % 2 == 0) {
            rowClass = "even";
        }
        var btnClass = "btn btn-danger btn-xs";
        if (this.props.userName == this.props.admin.Name) {
            btnClass = "btn btn-danger btn-xs disabled";
        }

        return (
            <tr className={rowClass}>
                <td className=" ">{this.props.admin.ID}</td>
                <td className=" ">{this.props.admin.Name}</td>
                <td className=" last">
                    <button type="button" className={btnClass} aria-label="Left Align" onClick={this.handleDelete}>
                      <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
                    </button>
                </td>
            </tr>
        )
    }

})

var AdminsTable = React.createClass({

    getInitialState: function() {
        this.loadAdmins();
        return {admins: [], userName: ""}
    },

    loadAdmins: function() {
        $.ajax({
            url: "/api/admins/?alert_id="+this.props.alertID,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({admins: data});
            }.bind(this),
            error: function(xhr, status, err) {
                popUpMessagePanel(xhr.responseText, false);
            }.bind(this)
        });
    },

    componentWillMount: function() {
        $.ajax({
            url: "/api/users/",
            type: "GET",
            cache: false,
            success: function(data) {
                var user = JSON.parse(data);
                this.setState({userName: user.Name});
            }.bind(this),
            error: function(xhr, status, err) {
                popUpMessagePanel(xhr.responseText, false);
            }.bind(this)
        })
    },

    handleChange: function() {
        this.loadAdmins();
    },

    render: function(){
        var handleChangeFunc = this.handleChange;
        var alertID = this.props.alertID
        var userName = this.state.userName
        return (
            <div>
                <table id="admins_table" className="table table-striped responsive-utilities jambo_table">
                    <thead>
                        <tr className="headings">
                            <th>ID </th>
                            <th>Name </th>
                            <th className=" no-link last"><span className="nobr">Delete</span></th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            this.state.admins.map(function(admin, i){
                                return <AdminRow key={i} alertID={alertID} userName={userName} rowID={i} admin={admin} afterChange={handleChangeFunc} />
                            })
                        }
                    </tbody>
                </table>
                <AddAdminForm alertID={alertID} afterAdd={handleChangeFunc}/>
            </div>
        )
    }
})

module.exports={
    AdminsTable,
}
