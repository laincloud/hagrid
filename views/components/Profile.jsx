import React from "react"
import ReactDOM from "react-dom"
import {popUpMessagePanel, ConfirmModal} from './Common'

var AlertForm = React.createClass({

    handleConfirm: function(e) {
        $.ajax({
            url: "/api/alerts/"+this.props.id,
            type: "DELETE",
            cache: false,
            success: function() {
                location.reload();
            }.bind(this),
            error: function(xhr, status, err) {
                popUpMessagePanel(xhr.responseText, false);
            }.bind(this)
        })
    },

    handleSubmit: function(e) {

        e.preventDefault();
        var formData = {
            enabled: this.refs.isEnabled.checked,
        };
        $.ajax({
            url: "/api/alerts/"+this.props.id,
            type: "PUT",
            cache: false,
            data: formData,
            success: function(data) {
                popUpMessagePanel(data, true);
            }.bind(this),
            error: function(xhr, status, err) {
                popUpMessagePanel(xhr.responseText, false);
            }.bind(this)
        });

    },

    handleSync: function(e) {
        $.ajax({
            url: "/api/alerts/"+this.props.id,
            type: "PATCH",
            cache: false,
            success: function(data) {
                popUpMessagePanel(data, true);
            }.bind(this),
            error: function(xhr, status, err) {
                popUpMessagePanel(xhr.responseText, false);
            }.bind(this),
        })
    },

    componentWillMount: function() {
        ReactDOM.render(
            <ConfirmModal
                modalID="delete_alert_modal_window"
                modalTitle="Delete Alert"
                modalMainText='Are you sure to delete this alert?'
                modalSubText='All the services and templates of this alert will be deleted as well.'
                closeBtnClass="btn btn-primary"
                confirmBtnClass="btn btn-danger"
                closeBtnText="No"
                confirmBtnText="Yes, I'm sure"
                handleConfirm={this.handleConfirm}
            />,
        document.getElementById("delete_alert_confirm_modal")
        );
    },

    componentDidMount: function() {
        new Switchery(document.querySelector("#update_alert_enabled"), {color: '#26B99A'});
    },

    render: function() {
        var isChecked = '';
        if (this.props.enabled) {
            isChecked = 'defaultChecked';
        }

        return <form id="alert_form" data-parsley-validate className="form-horizontal form-label-left" onSubmit={this.handleSubmit}>
            <div className="form-group">

                <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="update_alert_enabled">Enabled <span className="required">*</span>
                </label>
                <div className="col-md-3 col-sm-3 col-xs-12">
                        <input type="checkbox" ref="isEnabled" id="update_alert_enabled" className="js-switch" data-switchery="true" defaultChecked={isChecked}/>
                </div>
            </div>

            <div className="form-group">
                <div className="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">
                    <button type="submit" className="btn btn-success">Save</button>
                    <button type="button" className="btn btn-warning" onClick={this.handleSync}>Sync</button>
                    <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#delete_alert_modal_window">Delete</button>
                </div>
            </div>
        </form>
    }
})

var AlertTitle = React.createClass({
    render: function() {
        return (<div><h2><i className="fa fa-bars"></i> {this.props.name} <small>Created at: {this.props.createdAt}</small></h2><div className="clearfix"></div></div>)
    }
})

module.exports = {
    AlertTitle,
    AlertForm
}
