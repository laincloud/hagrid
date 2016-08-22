import React from 'react'
import ReactDOM from 'react-dom'
import {popUpMessagePanel} from './Common'

var AddNotifierForm = React.createClass({

    addNotifier: function() {
        var formData = {
            notifierID: this.refs.notifierSelector.value
        }
        $.ajax({
            url: "/api/notifiers/?alert_id="+this.props.alertID,
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
        $("#add_notifier_select").select2({
            placeholder: "Select a notifier",
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
                    <label className="col-sm-9 control-label">Add a new notifier </label>

                    <div className="col-sm-3">
                        <div className="input-group">
                                <select id="add_notifier_select" ref="notifierSelector" className="form-control" style={{"width":"100%", "height": "inherit"}} tabIndex="-1">
                                </select>
                                <span className="input-group-btn"></span>
                                <span className="input-group-btn">
                                    <button type="button" className="btn btn-success" onClick={this.addNotifier}>Add</button>
                                </span>
                        </div>
                    </div>
                 </div>
            </form>
        )
    }
})

var NotifierRow = React.createClass({


    handleDelete: function() {
        $.ajax({
            url: "/api/notifiers/" +this.props.notifier.ID + "?alert_id=" + this.props.alertID,
            method: "DELETE",
            cache: false,
            success: function(data) {
                popUpMessagePanel("Delete notifier successfully", true);
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

        return (
            <tr className={rowClass}>
                <td className=" ">{this.props.notifier.Name}</td>
                <td className=" ">{this.props.notifier.PhoneNumber}</td>
                <td className=" ">{this.props.notifier.EmailAddress}</td>
                <td className=" ">{this.props.notifier.BearychatTeam}</td>
                <td className=" ">{this.props.notifier.BearychatChannel}</td>
                <td className=" ">{this.props.notifier.SlackTeam}</td>
                <td className=" ">{this.props.notifier.SlackChannel}</td>
                <td className=" last">
                    <button type="button" className="btn btn-danger btn-xs" aria-label="Left Align" onClick={this.handleDelete}>
                      <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
                    </button>
                </td>
            </tr>
        )
    }

})

var NotifiersTable = React.createClass({

    getInitialState: function() {
        this.loadNotifiers();
        return {notifiers: []}
    },

    loadNotifiers: function() {
        $.ajax({
            url: "/api/notifiers/?alert_id="+this.props.alertID,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({notifiers: data});
            }.bind(this),
            error: function(xhr, status, err) {
                popUpMessagePanel(xhr.responseText, false);
            }.bind(this)
        });
    },

    handleChange: function() {
        this.loadNotifiers();
    },

    render: function(){
        var handleChangeFunc = this.handleChange;
        var alertID = this.props.alertID
        return (
            <div>
                <table id="notifiers_table" className="table table-striped responsive-utilities jambo_table">
                    <thead>
                        <tr className="headings">
                            <th>Name </th>
                            <th>Phone Number </th>
                            <th>Email Address </th>
                            <th>BearychatTeam </th>
                            <th>BearychatChannel </th>
                            <th>SlackTeam </th>
                            <th>SlackChannel </th>
                            <th className=" no-link last"><span className="nobr">Delete</span></th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            this.state.notifiers.map(function(notifier, i){
                                return <NotifierRow key={i} alertID={alertID} rowID={i} notifier={notifier} afterChange={handleChangeFunc} />
                            })
                        }
                    </tbody>
                </table>
                <AddNotifierForm alertID={alertID} afterAdd={handleChangeFunc}/>
            </div>
        )
    }
})

module.exports={
    NotifiersTable
}
