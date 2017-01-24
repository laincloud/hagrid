import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";
import TextInput from "../../components/TextInput";
import SimpleButton from "../../components/SimpleButton";
import CheckBox from "../../components/CheckBox";
import { STYLE_SUCCESS, STYLE_DEFAULT }from "../../common/Constants";
import { addAlert, closeAlertModal }from "../../actions/AlertAction";

class AlertModalComponent extends Component {
  render() {
    return (
      <Modal show={this.props.isOpen} onHide={this.props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add alert</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form id="addAlertForm" className="form form-horizontal">
            <TextInput id="addAlertName" name="name" title="Name"/>
            <CheckBox id="addAlertEnabled" name="enabled" title="Enabled" cbStyle={STYLE_SUCCESS} isChecked={false}/>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <SimpleButton btStyle={STYLE_SUCCESS} handleClick={this.props.handleAdd} text="Update"/>
          <SimpleButton btStyle={STYLE_DEFAULT} handleClick={this.props.handleClose} text="Close"/>
        </Modal.Footer>
      </Modal>
    )
  }
}

function mapStateToProps(state) {
  return {
    isOpen: state.alertReducer.isOpen,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    handleClose: () => dispatch(closeAlertModal()),
    handleAdd: () => dispatch(addAlert()),
  }
}

const AlertModal = connect(mapStateToProps, mapDispatchToProps)(AlertModalComponent);

export default AlertModal;



