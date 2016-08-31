import React from 'react'
import ReactDOM from 'react-dom'
import {popUpMessagePanel} from './Common'
import METRIC_HINTS from './metricHints'

var AddServiceForm = React.createClass({

    handleSubmit: function(){
        var formData = {
            alertID: this.props.alertID,
            name: this.refs.name.value.trim(),
            metric: this.refs.metric.value.trim(),
            checkType: this.refs.checkType.value,
            warning: this.refs.warning.value.trim(),
            critical: this.refs.critical.value.trim(),
            checkAttempts: this.refs.checkAttempts.value.trim(),
            enabled: this.refs.enabled.checked
        };

        $.ajax({
            url: "/api/services/",
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
        });
    },

    componentDidMount: function() {
        new Switchery(document.querySelector("#add_service_enabled"), {color: '#26B99A', size: 'large'});
        $("#add_service_metric").autocomplete({
            lookup: METRIC_HINTS,
            onSelect: function(suggestion) {
                $("#add_service_metric").val(suggestion.data);
            }
        });
    },

    render: function() {
        return (
            <tr className="odd" >
                <td className=" ">
                    <input type="text" ref="name" id="add_service_name" placeholder="name" required="required" className="form-control col-md-7 col-xs-12" />
                </td>
                <td className=" ">
                    <input type="text" ref="metric" id="add_service_metric" placeholder="x.x.x.x" required="required" className="form-control col-md-7 col-xs-12" />
                </td>
                <td className=" ">
                    <select className="form-control" ref="checkType" id="add_service_check_type">
                        <option> &gt; </option>
                        <option> &lt; </option>
                        <option> &#61;&#61; </option>
                        <option> &#33;&#61; </option>
                    </select>
                </td>
                <td className=" ">
                    <input type="text" ref="warning" id="add_service_warning" placeholder="float" required="required" className="form-control col-md-7 col-xs-12" />
                </td>
                <td className=" ">
                    <input type="text" ref="critical" id="add_service_critical" placeholder="float" required="required" className="form-control col-md-7 col-xs-12" />
                </td>
                <td className=" ">
                    <input type="text" ref="checkAttempts" id="add_service_check_attempts" placeholder="integer" required="required" className="form-control col-md-7 col-xs-12" />
                </td>
                <td className=" ">
                    <input type="checkbox" ref="enabled" id="add_service_enabled" className="js-switch" data-switchery="true" />
                </td>
                <td className=" last">
                    <button type="button" className="btn btn-success btn-xs" aria-label="Left Align" onClick={this.handleSubmit}>
                      <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
                    </button>
                </td>
            </tr>
        )
    }
})

var ServiceRow = React.createClass({

    getInitialState: function() {
        return {editMode: false};
    },

    handleDelete: function() {
        $.ajax({
            url: "/api/services/"+this.props.service.ID,
            method: "DELETE",
            cache: false,
            success: function(data) {
                popUpMessagePanel("Delete service successfully", true);
                this.props.afterChange();
            }.bind(this),
            error: function(xhr, status, err) {
                popUpMessagePanel(xhr.responseText, false)
            }.bind(this)
        });
    },

    handleUpdate: function() {
        var formData = {
            name: this.refs.name.value.trim(),
            metric: this.refs.metric.value.trim(),
            checkType: this.refs.checkType.value,
            warning: this.refs.warning.value.trim(),
            critical: this.refs.critical.value.trim(),
            checkAttempts: this.refs.checkAttempts.value.trim(),
            enabled: this.refs.enabled.checked
        };

        $.ajax({
            url: "/api/services/"+this.props.service.ID,
            method: "PUT",
            cache: false,
            data: formData,
            success: function(data) {
                popUpMessagePanel(data, true);
                this.setState({editMode: false});
                this.props.afterChange();
            }.bind(this),
            error: function(xhr, status, err) {
                popUpMessagePanel(xhr.responseText, false)
            }.bind(this)
        });
    },

    changeMode: function() {
        this.setState({editMode: !this.state.editMode});
    },

    initializeMetricHints: function() {
        var metricID = "#update_service_metric_"+this.props.service.ID;
        if (this.state.editMode) {
            $(metricID).autocomplete({
                lookup: METRIC_HINTS,
                onSelect: function(suggestion) {
                    $(metricID).val(suggestion.data);
                }
            });
        }
    },

    initializeSwitchery: function() {
        var switcheryID = "#update_service_enabled_" + this.props.service.ID
        if (this.state.editMode) {
            new Switchery(document.querySelector(switcheryID), {color: '#26B99A', size: 'large'});
        }
    },

    componentDidUpdate: function() {
        this.initializeSwitchery();
        this.initializeMetricHints();
    },

    componentWillUpdate: function() {
        var switcheryID = "#update_service_enabled_" + this.props.service.ID
        $(switcheryID).siblings(".switchery").remove();
    },

    componentDidMount: function() {
        this.initializeSwitchery();
        this.initializeMetricHints();
    },

    render: function() {
        var rowClass = "odd";

        if (this.props.rowID % 2 == 0) {
            rowClass = "even";
        }
        var enabledClass = "glyphicon glyphicon-remove"
        var defaultChecked = ""
        if (this.props.service.Enabled) {
            enabledClass = "glyphicon glyphicon-ok"
            defaultChecked = "defaultChecked"
        }
        if (!this.state.editMode) {
            return (
                <tr className={rowClass}>
                    <td className=" ">{this.props.service.Name}</td>
                    <td className=" ">{this.props.service.Metric}</td>
                    <td className=" "><span className="label label-primary">{this.props.service.CheckType}</span></td>
                    <td className=" "><span className="label label-warning">{this.props.service.Warning}</span></td>
                    <td className=" "><span className="label label-danger">{this.props.service.Critical}</span></td>
                    <td className=" "><span className="label label-default">{this.props.service.CheckAttempts}</span></td>
                    <td className="a-right a-right "><span className={enabledClass} aria-hidden="true"></span></td>
                    <td className=" last">
                        <button type="button" className="btn btn-success btn-xs" aria-label="Left Align" onClick={this.changeMode}>
                          <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                        </button>
                        <button type="button" className="btn btn-danger btn-xs" aria-label="Left Align" onClick={this.handleDelete}>
                          <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
                        </button>

                    </td>
                </tr>
            )
        } else {
            return (
                <tr className={rowClass} >
                    <td className=" ">
                        <input type="text" ref="name" required="required" className="form-control col-md-7 col-xs-12" defaultValue={this.props.service.Name}/>
                    </td>
                    <td className=" ">
                        <input type="text"
                               id={"update_service_metric_"+this.props.service.ID}
                               ref="metric"
                               required="required"
                               className="form-control col-md-7 col-xs-12"
                               defaultValue={this.props.service.Metric}/>
                    </td>
                    <td className=" ">
                        <select className="form-control" ref="checkType" defaultValue={this.props.service.CheckType}>
                            <option value='>'> &gt; </option>
                            <option value='<'> &lt; </option>
                            <option value='=='> &#61;&#61; </option>
                            <option value='!='> &#33;&#61; </option>
                        </select>
                    </td>
                    <td className=" ">
                        <input type="text" ref="warning" placeholder="float" required="required" className="form-control col-md-7 col-xs-12" defaultValue={this.props.service.Warning}/>
                    </td>
                    <td className=" ">
                        <input type="text" ref="critical" placeholder="float" required="required" className="form-control col-md-7 col-xs-12" defaultValue={this.props.service.Critical}/>
                    </td>
                    <td className=" ">
                        <input type="text" ref="checkAttempts" placeholder="integer" required="required" className="form-control col-md-7 col-xs-12" defaultValue={this.props.service.CheckAttempts}/>
                    </td>
                    <td className=" ">
                        <input type="checkbox"
                               ref="enabled"
                               id={"update_service_enabled_"+this.props.service.ID}
                               className="js-switch" data-switchery="false" defaultChecked={defaultChecked}/>
                    </td>
                    <td className=" last">
                        <button type="button" className="btn btn-success btn-xs" aria-label="Left Align" onClick={this.handleUpdate}>
                          <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
                        </button>
                        <button type="button" className="btn btn-default btn-xs" aria-label="Left Align" onClick={this.changeMode}>
                          <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                        </button>
                    </td>
                </tr>
            )
        }

    },
})

var ServicesTable = React.createClass({

    getInitialState: function() {
        this.loadServices();
        return {services: []}
    },

    loadServices: function() {
        // Get services
        $.ajax({
            url: "/api/services/?alert_id="+this.props.alertID,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({services: data});
            }.bind(this),
            error: function(xhr, status, err) {
                popUpMessagePanel(xhr.responseText, false)
            }.bind(this)
        });
    },

    handleChange: function() {
        this.loadServices();
    },

    render: function() {
        var handleChangeFunc = this.handleChange;
        var alertID = this.props.alertID
        return (
            <table id="services_table" className="table table-striped responsive-utilities jambo_table">
                <thead>
                    <tr className="headings">
                        <th className="col-sm-2">Name </th>
                        <th>Metric </th>
                        <th className="col-sm-1">CheckType </th>
                        <th className="col-sm-1">Warning </th>
                        <th className="col-sm-1">Critical </th>
                        <th className="col-sm-1">CheckAttempts </th>
                        <th className="col-sm-1">Enabled </th>
                        <th className="col-sm-2 no-link last"><span className="nobr">Action</span></th>
                    </tr>
                </thead>

                <tbody>
                    {
                        this.state.services.map(function(service, i){
                            return <ServiceRow key={i} rowID={i} service={service} afterChange={handleChangeFunc} />
                        })
                    }
                    <AddServiceForm alertID={alertID} afterAdd={handleChangeFunc}/>
                </tbody>
            </table>
        )
    }
})

module.exports = {
    ServicesTable,
}
