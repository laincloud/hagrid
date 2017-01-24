import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";
import TextInput from "../../components/TextInput";
import SimpleButton from "../../components/SimpleButton";
import Divider from "../../components/Divider";
import { STYLE_SUCCESS, STYLE_DEFAULT }from "../../common/Constants";
import { updateUserProfile, closeUserProfileModal }from "../../actions/UserAction";

class UserProfileModalComponent extends Component {
  render() {
    return (
      <Modal show={this.props.isOpen} onHide={this.props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update user profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form id="userProfileForm" className="form form-horizontal">
            <Divider content="Basic"/>
            <TextInput id="userEmailAddress" name="email_address" title="Email Address" defaultValue={this.props.userData["EmailAddress"]}/>
            <TextInput id="userPhoneNumber" name="phone_number" title="Phone Number" defaultValue={this.props.userData["PhoneNumber"]}/>
            <Divider content="Bearychat"/>
            <TextInput id="userBearychatTeam" name="bearychat_team" title="Team" defaultValue={this.props.userData["BearychatTeam"]}/>
            <TextInput id="userBearychatToken" name="bearychat_token" title="Token" defaultValue={this.props.userData["BearychatToken"]}/>
            <TextInput id="userBearychatChannel" name="bearychat_channel" title="Channel" defaultValue={this.props.userData["BearychatChannel"]}/>
            <Divider content="Slack"/>
            <TextInput id="userSlackTeam" name="slack_team" title="Team" defaultValue={this.props.userData["SlackTeam"]}/>
            <TextInput id="userSlackToken" name="slack_token" title="Token" defaultValue={this.props.userData["SlackToken"]}/>
            <TextInput id="userSlackChannel" name="slack_channel" title="Channel" defaultValue={this.props.userData["SlackChannel"]}/>
            <Divider content="Pushbullet"/>
            <TextInput id="userPushbulletToken" name="pushbullet_token" title="Token" defaultValue={this.props.userData["PushbulletToken"]}/>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <SimpleButton btStyle={STYLE_SUCCESS} handleClick={this.props.handleUpdate} text="Update"/>
          <SimpleButton btStyle={STYLE_DEFAULT} handleClick={this.props.handleClose} text="Close"/>
        </Modal.Footer>
      </Modal>
    )
  }
}

function mapStateToProps(state) {
  return {
    isOpen: state.userReducer.isOpen,
    userData: state.userReducer.userData,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    handleClose: () => dispatch(closeUserProfileModal()),
    handleUpdate: () => dispatch(updateUserProfile()),
  }
}

const UserProfileModal = connect(mapStateToProps, mapDispatchToProps)(UserProfileModalComponent);

export default UserProfileModal;