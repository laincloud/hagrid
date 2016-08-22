import React from 'react'
import ReactDOM from 'react-dom'
import {AlertTitle, AlertForm} from './Profile'
import {popUpMessagePanel} from './Common'
import {ServicesTable} from './Service'
import {TemplatesTable} from './Template'
import {NotifiersTable} from './Notifier'
import {AdminsTable} from './Admin'

var AlertItem = React.createClass({

    onClick: function() {
        $("#alert_title").html("");
        $("#profile_form_div").html("");
        $("#services_table_div").html("");
        $("#notifiers_table_div").html("");
        $("#admins_table_div").html("");
        $("#templates_table_div").html("");
        ReactDOM.render(<AlertTitle id={this.props.id} name={this.props.name} createdAt={this.props.createdAt} />, document.getElementById("alert_title"));
        ReactDOM.render(<AlertForm id={this.props.id} name={this.props.name} source={this.props.source} enabled={this.props.enabled} />, document.getElementById("profile_form_div"));
        ReactDOM.render(<ServicesTable alertID={this.props.id} />, document.getElementById("services_table_div"));
        ReactDOM.render(<TemplatesTable alertID={this.props.id} />, document.getElementById("templates_table_div"));
        ReactDOM.render(<NotifiersTable alertID={this.props.id} />, document.getElementById("notifiers_table_div"));
        ReactDOM.render(<AdminsTable alertID={this.props.id} />, document.getElementById("admins_table_div"));
    },
    render: function() {
        return (
            <li><a href="#" onClick={this.onClick}>{this.props.name}</a></li>
        );
    }
})


var NavigateMenu = React.createClass({

    getInitialState: function() {
        return {data: [], user: {}};
    },

    componentDidMount: function() {
        // Get alerts
        $.ajax({
            url: "/api/alerts/",
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                popUpMessagePanel(xhr.responseText, false)
            }.bind(this)
        });
        // Get users
        $.ajax({
            url: "/api/users/",
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({user: data});
            }.bind(this),
            error: function(xhr, status, err) {
                popUpMessagePanel(xhr.responseText, false)
            }.bind(this)
        })

        $('#sidebar-menu li ul').slideUp();
        $('#sidebar-menu li').removeClass('active');

        $('#sidebar-menu li').click(function () {
            if ($(this).is('.active')) {
                $(this).removeClass('active');
                $('ul', this).slideUp();
                $(this).removeClass('nv');
                $(this).addClass('vn');
            } else {
                $('#sidebar-menu li ul').slideUp();
                $(this).removeClass('vn');
                $(this).addClass('nv');
                $('ul', this).slideDown();
                $('#sidebar-menu li').removeClass('active');
                $(this).addClass('active');
            }
        });

        $('#menu_toggle').click(function () {
            if ($('body').hasClass('nav-md')) {
                $('body').removeClass('nav-md');
                $('body').addClass('nav-sm');
                $('.left_col').removeClass('scroll-view');
                $('.left_col').removeAttr('style');
                $('.sidebar-footer').hide();

                if ($('#sidebar-menu li').hasClass('active')) {
                    $('#sidebar-menu li.active').addClass('active-sm');
                    $('#sidebar-menu li.active').removeClass('active');
                }
            } else {
                $('body').removeClass('nav-sm');
                $('body').addClass('nav-md');
                $('.sidebar-footer').show();

                if ($('#sidebar-menu li').hasClass('active-sm')) {
                    $('#sidebar-menu li.active-sm').addClass('active');
                    $('#sidebar-menu li.active-sm').removeClass('active-sm');
                }
            }
        });

        var url = window.location;
        $('#sidebar-menu a[href="' + url + '"]').parent('li').addClass('current-page');
        $('#sidebar-menu a').filter(function () {
            return this.href == url;
        }).parent('li').addClass('current-page').parent('ul').slideDown().parent().addClass('active');
    },

    render: function(){
        var alerts = this.state.data.map(function(alert){
            return <AlertItem key={alert.ID} id={alert.ID} name={alert.Name} source={alert.Source} createdAt={alert.CreatedAt} enabled={alert.Enabled}/>
        });
        return  <div className="left_col scroll-view">
                    <div className="navbar nav_title" style={{border: 0}}>
                        <a href="index.html" className="site_title"><i className="fa fa-paw"></i> <span>Hagrid</span></a>
                    </div>
                    <div className="clearfix"></div>
                    <div className="profile">
                        <div className="profile_pic">
                            <img src="static/images/img.jpg" alt="..." className="img-circle profile_img" />
                        </div>
                        <div className="profile_info">
                            <span>Welcome,</span>
                            <h2>{this.state.user.Name}</h2>
                        </div>
                    </div>
                    <br />
                    <div id="sidebar-menu" className="main_menu_side hidden-print main_menu">
                        <div className="menu_section">
                            <h3>&nbsp;&nbsp;</h3>
                            <ul className="nav side-menu">
                                <li><a><i className="fa fa-home"></i> Alerts <span className="fa fa-chevron-down"></span></a>
                                    <ul className="nav child_menu" style={{display: "block"}}>
                                        {alerts}
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
    },
})

export default NavigateMenu
