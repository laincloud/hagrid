import React from 'react'
import ReactDOM from 'react-dom'
import {popUpMessagePanel} from './Common'

var AddTemplateForm = React.createClass({

    handleSubmit: function(){
        var formData = {
            alertID: this.props.alertID,
            name: this.refs.name.value.trim(),
            values: this.refs.values.value.trim(),
        };

        $.ajax({
            url: "/api/templates/",
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
        $('#add_template_values').tagsInput({
            width: 'auto',
            defaultText: '',
        });
    },

    render: function() {
        return (
            <tr className="odd" >
                <td className="col-sm-2">
                    <input type="text" ref="name" id="add_template_name" placeholder="name(required)" required="required" className="form-control" />
                </td>
                <td className="col-sm-8">
                    <input type="text" ref="values" id="add_template_values" required="required" className="tags form-control" />
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

var TemplateRow = React.createClass({

    getInitialState: function() {
        return {editMode: false};
    },

    handleDelete: function() {
        $.ajax({
            url: "/api/templates/"+this.props.template.ID,
            method: "DELETE",
            cache: false,
            success: function(data) {
                popUpMessagePanel("Delete template successfully", true);
                this.props.afterChange();
            }.bind(this),
            error: function(xhr, status, err) {
                popUpMessagePanel(xhr.responseText, false)
            }.bind(this)
        });
    },

    initializeTagInput: function() {
        if (this.state.editMode) {
            $("#update_template_values_"+this.props.template.ID).tagsInput({
                width: 'auto',
                defaultText: '',
            });
        } else {
            $("#template_row_value_cell_" + this.props.templateID + " .tagsinput").remove();
        }

    },

    handleUpdate: function() {
        var formData = {
            name: this.refs.name.value.trim(),
            values: this.refs.values.value.trim(),
        };

        $.ajax({
            url: "/api/templates/"+this.props.template.ID,
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

    componentDidMount: function() {
        this.initializeTagInput();
    },

    componentDidUpdate: function() {
        this.initializeTagInput();
    },

    render: function() {
        var rowClass = "odd";
        var templateID = this.props.template.ID

        if (this.props.rowID % 2 == 0) {
            rowClass = "even";
        }

        if (!this.state.editMode) {
            var labels = this.props.template.Values.split(",");
            return (
                <tr className={rowClass}>
                    <td className="col-sm-2">{this.props.template.Name}</td>
                    <td className="col-sm-8 " id={"template_row_value_cell_" + this.props.templateID}>{
                        labels.map(function(label, i){
                            return <span key={i} className="label label-primary">{label}</span>
                        })
                    }</td>
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
                    <td className="col-sm-2">
                        <input type="text" ref="name" required="required" className="form-control " defaultValue={this.props.template.Name}/>
                    </td>
                    <td className="col-sm-8" id={"template_row_value_cell_" + this.props.templateID}>
                        <input type="text" ref="values" required="required" id={"update_template_values_" + templateID} className="form-control " defaultValue={this.props.template.Values}/>
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

var TemplatesTable = React.createClass({

    getInitialState: function() {
        this.loadTemplates();
        return {templates: []}
    },

    loadTemplates: function() {
        // Get templates
        $.ajax({
            url: "/api/templates/?alert_id="+this.props.alertID,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({templates: data});
            }.bind(this),
            error: function(xhr, status, err) {
                popUpMessagePanel(xhr.responseText, false)
            }.bind(this)
        });
    },

    handleChange: function() {
        this.loadTemplates();
    },

    render: function() {
        var handleChangeFunc = this.handleChange;
        var alertID = this.props.alertID
        return (
            <table id="templates_table" className="table table-striped responsive-utilities jambo_table">
                <thead>
                    <tr className="headings">
                        <th>Name </th>
                        <th>Values </th>
                        <th className=" no-link last"><span className="nobr">Action</span></th>
                    </tr>
                </thead>

                <tbody>
                    {
                        this.state.templates.map(function(template, i){
                            return <TemplateRow key={i} rowID={i} template={template} afterChange={handleChangeFunc} />
                        })
                    }
                    <AddTemplateForm alertID={alertID} afterAdd={handleChangeFunc}/>
                </tbody>

            </table>
        )
    }
})

module.exports = {
    TemplatesTable,
}
