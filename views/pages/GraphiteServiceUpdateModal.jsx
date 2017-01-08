import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import SimpleButton from "../components/SimpleButton";
import { STYLE_PRIMARY, STYLE_SUCCESS, SIZE_DEFAULT } from "../common/Constants";

export default class GraphiteServiceUpdateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    }
  }

  close() {
    this.setState({ show: false });
  }

  open() {
    this.setState({ show: true });
  }

  render() {
    const closeModal = this.close.bind(this);
    const openModal = this.open.bind(this);
    return (
      <div>
        <SimpleButton btStyle={STYLE_PRIMARY} handleClick={openModal} text="Launch"/>

        <Modal show={this.state.show} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Text in a modal</h4>
            <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
            <hr />

            </Modal.Body>
          <Modal.Footer>
            <SimpleButton btStyle={STYLE_SUCCESS} handleClick={closeModal} text="close"/>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}