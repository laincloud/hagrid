import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";
import SimpleButton from "../../components/SimpleButton";
import TextInput from "../../components/TextInput";
import MultiSelect from "../../components/MultiSelect";
import { STYLE_DEFAULT, STYLE_SUCCESS, STYLE_PRIMARY } from "../../common/Constants";
import { MODE_DELETE, MODE_UPDATE } from "../../common/Constants";
import { closeTemplateModal, deleteTemplate, addTemplate, updateTemplate } from "../../actions/TemplateAction";
import "bootstrap-touchspin";

class TemplateModalComponent extends Component {

  renderDataModal(isUpdate) {
    let templateID = this.props.templateData["ID"];
    let alertID = this.props.templateData["AlertID"];
    let valueArr = this.props.templateData["Values"] != undefined ? this.props.templateData["Values"].split(",") : [];
    let submitButton = isUpdate ?
      <SimpleButton btStyle={STYLE_SUCCESS} handleClick={() => {this.props.handleUpdate(templateID, alertID)}} text="Update"/>
      : <SimpleButton btStyle={STYLE_SUCCESS} handleClick={() => {this.props.handleAdd(alertID)}} text="Add"/>;
    return (
      <Modal show={this.props.isOpen} onHide={this.props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update template</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form id="templateForm" className="form form-horizontal">
            <TextInput id="templateName" name="name" title="Name" defaultValue={isUpdate ? this.props.templateData["Name"] : ""}/>
            <MultiSelect id="templateValues" name="values" title="Values" defaultValue={isUpdate ? valueArr : []}/>
          </form>
        </Modal.Body>
        <Modal.Footer>
          {submitButton}
          <SimpleButton btStyle={STYLE_DEFAULT} handleClick={this.props.handleClose} text="Close"/>

        </Modal.Footer>
      </Modal>
    )
  }

  renderConfirmModal() {
    let templateID = this.props.templateData["ID"];
    let alertID = this.props.templateData["AlertID"];
    return (
      <Modal show={this.props.isOpen} onHide={this.props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete template</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Do you really want to delete <font color="red"> {this.props.templateData["Name"]}</font> ?</h4>
          <p><font color="red">The operation can't be undo.</font></p>
        </Modal.Body>
        <Modal.Footer>
          <SimpleButton btStyle={STYLE_DEFAULT} handleClick={this.props.handleClose} text="Close"/>
          <SimpleButton btStyle={STYLE_PRIMARY} handleClick={() => {this.props.handleDelete(templateID, alertID)}} text="Delete"/>
        </Modal.Footer>
      </Modal>
    )
  }

  render() {

    const renderConfirmModal = this.renderConfirmModal.bind(this);
    const renderDataModal = this.renderDataModal.bind(this);
    switch (this.props.mode) {
      case MODE_DELETE:
        return <div>{renderConfirmModal()}</div>;
      case MODE_UPDATE:
        return <div>{renderDataModal(true)}</div>;
      default:
        return <div>{renderDataModal(false)}</div>;
    }
  }
}


function mapStateToProps(state) {
  return {
    isOpen: state.templateReducer.isOpen,
    mode: state.templateReducer.mode,
    templateData: state.templateReducer.templateData,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    handleClose: () => dispatch(closeTemplateModal()),
    handleDelete: (templateID, alertID) => dispatch(deleteTemplate(templateID, alertID)),
    handleAdd: (alertID) => dispatch(addTemplate(alertID)),
    handleUpdate: (templateID, alertID) => dispatch(updateTemplate(templateID, alertID)),
  }
}

const TemplateModal = connect(mapStateToProps, mapDispatchToProps)(TemplateModalComponent);

export default TemplateModal;