import React from 'react'
import ReactDOM from 'react-dom'
import {popUpMessagePanel} from './Common'

var AddAlertModal = React.createClass({

    handleSubmit: function(e) {
        e.preventDefault();
        var formData = {
            name: this.refs.name.value.trim(),
            enabled: this.refs.isEnabled.checked,
        };

        $.ajax({
            url: "/api/alerts/",
            type: "POST",
            cache: false,
            data: formData,
            success: function(data) {
                location.reload();
            }.bind(this),
            error: function(xhr, status, err) {
                $("#add_alert_close_btn").trigger("click");
                popUpMessagePanel(xhr.responseText, false);
            }.bind(this)
        })
    },

    componentDidMount: function() {
        new Switchery(document.querySelector("#new_alert_enabled"), {color: '#26B99A'});
    },

    render: function() {

        return (
            <div className="modal fade bs-example-modal-lg" id="add_alert_modal_form" tabIndex="-1" role="modal" aria-hidden="true">
                <div className="modal-backdrop fade"></div>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span>
                            </button>
                            <h4 className="modal-title">New alert</h4>
                        </div>
                        <form id="add_alert_form" data-parsley-validate className="form-horizontal form-label-left" onSubmit={this.handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="new_alert_name">Name <span className="required">*</span>
                                    </label>
                                    <div className="col-md-3 col-sm-3 col-xs-12">
                                        <input type="text" ref="name" id="new_alert_name" required="required" className="form-control col-md-7 col-xs-12" defaultValue=""/>
                                    </div>
                                </div>

                                <div className="form-group">

                                    <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="new_alert_enabled">Enabled <span className="required">*</span>
                                    </label>
                                    <div className="col-md-3 col-sm-3 col-xs-12">
                                            <input type="checkbox" ref="isEnabled" id="new_alert_enabled" className="js-switch" data-switchery="false"/>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <div className="form-group">
                                    <button type="submit" className="btn btn-success">Add</button>
                                    <button type="button" className="btn btn-default" id="add_alert_close_btn" data-dismiss="modal">Cancel</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
})

var UpdateUserProfileModal = React.createClass({

    handleSubmit: function(e) {
        e.preventDefault();
        var formData = {
            phone_number: this.refs.phoneNumber.value.trim(),
            email_address: this.refs.emailAddress.value.trim(),
            bearychat_team: this.refs.bearychatTeam.value.trim(),
            bearychat_token: this.refs.bearychatToken.value.trim(),
            bearychat_channel: this.refs.bearychatChannel.value.trim(),
            slack_team: this.refs.slackTeam.value.trim(),
            slack_token: this.refs.slackToken.value.trim(),
            slack_channel: this.refs.slackChannel.value.trim(),
            pushbullet_token: this.refs.pushbulletToken.value.trim(),
        };

        $.ajax({
            url: "/api/users/"+this.props.user.ID,
            type: "PUT",
            cache: false,
            data: formData,
            success: function(data) {
                $("#update_user_close_btn").trigger("click");
                popUpMessagePanel(data, true);
            }.bind(this),
            error: function(xhr, status, err) {
                $("#update_user_close_btn").trigger("click");
                popUpMessagePanel(xhr.responseText, false);
            }.bind(this)
        })
    },

    render: function() {
        return (
           <div className="modal fade bs-example-modal-lg" id="update_user_profile_modal_form" tabIndex="-1" role="modal" aria-hidden="true">
               <div className="modal-backdrop fade"></div>
               <div className="modal-dialog modal-lg">
                   <div className="modal-content">
                       <div className="modal-header">
                           <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span>
                           </button>
                           <h4 className="modal-title">Update Profile</h4>
                       </div>
                       <form id="update_user_profile_form" data-parsley-validate className="form-horizontal form-label-left" onSubmit={this.handleSubmit}>
                           <div className="modal-body">
                               <div className="form-group">
                                   <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="new_user_phone_number">Phone Number </label>
                                   <div className="col-md-3 col-sm-3 col-xs-12">
                                       <input type="text" ref="phoneNumber" id="new_user_phone_number" className="form-control col-md-7 col-xs-12" defaultValue={this.props.user.PhoneNumber}/>
                                   </div>
                               </div>
                               <div className="form-group">
                                   <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="new_user_email_address">Email Address </label>
                                   <div className="col-md-3 col-sm-3 col-xs-12">
                                       <input type="text" ref="emailAddress" id="new_user_email_address" className="form-control col-md-7 col-xs-12" defaultValue={this.props.user.EmailAddress}/>
                                   </div>
                               </div>
                               <div className="form-group">
                                   <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="new_user_bearychat_team">Bearychat Team </label>
                                   <div className="col-md-3 col-sm-3 col-xs-12">
                                       <input type="text" ref="bearychatTeam" id="new_user_bearychat_team" className="form-control col-md-7 col-xs-12" defaultValue={this.props.user.BearychatTeam}/>
                                   </div>
                               </div>
                               <div className="form-group">
                                   <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="new_user_bearychat_token">Bearychat Token </label>
                                   <div className="col-md-3 col-sm-3 col-xs-12">
                                       <input type="text" ref="bearychatToken" id="new_user_bearychat_token" className="form-control col-md-7 col-xs-12" defaultValue={this.props.user.BearychatToken}/>
                                   </div>
                               </div>
                               <div className="form-group">
                                   <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="new_user_bearychat_channel">Bearychat Channel </label>
                                   <div className="col-md-3 col-sm-3 col-xs-12">
                                       <input type="text" ref="bearychatChannel" id="new_user_bearychat_channel" className="form-control col-md-7 col-xs-12" defaultValue={this.props.user.BearychatChannel}/>
                                   </div>
                               </div>
                               <div className="form-group">
                                   <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="new_user_pushbullet_token">Pushbullet Token </label>
                                   <div className="col-md-3 col-sm-3 col-xs-12">
                                       <input type="text" ref="pushbulletToken" id="new_user_pushbullet_token" className="form-control col-md-7 col-xs-12" defaultValue={this.props.user.PushbulletToken}/>
                                   </div>
                               </div>
                               <div className="form-group">
                                   <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="new_user_slack_team">Slack Team </label>
                                   <div className="col-md-3 col-sm-3 col-xs-12">
                                       <input type="text" ref="slackTeam" id="new_user_slack_team" className="form-control col-md-7 col-xs-12" defaultValue={this.props.user.SlackTeam}/>
                                   </div>
                               </div>
                               <div className="form-group">
                                   <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="new_user_slack_token">Slack Token </label>
                                   <div className="col-md-3 col-sm-3 col-xs-12">
                                       <input type="text" ref="slackToken" id="new_user_slack_token" className="form-control col-md-7 col-xs-12" defaultValue={this.props.user.SlackToken}/>
                                   </div>
                               </div>
                               <div className="form-group">
                                   <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="new_user_slack_channel">Slack Channel </label>
                                   <div className="col-md-3 col-sm-3 col-xs-12">
                                       <input type="text" ref="slackChannel" id="new_user_slack_channel" className="form-control col-md-7 col-xs-12" defaultValue={this.props.user.SlackChannel}/>
                                   </div>
                               </div>

                           </div>
                           <div className="modal-footer">
                               <div className="form-group">
                                   <button type="submit" className="btn btn-success">Update</button>
                                   <button type="button" className="btn btn-default" id="update_user_close_btn" data-dismiss="modal">Cancel</button>
                               </div>
                           </div>
                       </form>
                   </div>
               </div>
           </div>
       )
    }
})

var UserProfileMenu = React.createClass({

    componentWillMount: function() {
        $.ajax({
            url: "/api/users/",
            type: "GET",
            cache: false,
            success: function(data) {
                var user = JSON.parse(data);
                ReactDOM.render(<AddAlertModal />, document.getElementById('add_alert_modal'));
                ReactDOM.render(<UpdateUserProfileModal user={user}/>, document.getElementById('update_user_profile_modal'));
            }.bind(this),
            error: function(xhr, status, err) {
                popUpMessagePanel(xhr.responseText, false);
            }.bind(this)
        })
    },

    handleLogout: function() {
        document.cookie = 'session-name=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        location.href="/logout";
    },

    render: function() {
        return (
            <ul className="nav navbar-nav navbar-right">
                <li className="">
                    <a href="#" className="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                        Setting Menu&nbsp;
                        <span className=" fa fa-angle-down"></span>
                    </a>
                    <ul className="dropdown-menu dropdown-usermenu animated fadeInDown pull-right">
                        <li><a href="#" data-toggle="modal" data-target="#update_user_profile_modal_form"><i className="fa fa-cog pull-right"></i>  Profile</a>
                        </li>
                        <li>
                            <a href="#" data-toggle="modal" data-target="#add_alert_modal_form"><i className="fa fa-plus pull-right"></i> Add an alert</a>
                        </li>
                        <li><a href="#" onClick={this.handleLogout}><i className="fa fa-sign-out pull-right"></i> Log Out</a></li>
                    </ul>
                </li>
            </ul>
        )
    }

})


module.exports = {
    UserProfileMenu,
}
