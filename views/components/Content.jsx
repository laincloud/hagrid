import React from 'react'
import ReactDOM from 'react-dom'


var Content = React.createClass({
    render: function(){
        return <div className="col-md-12 col-sm-12 col-xs-12">
                <div className="x_panel">
                    <div className="x_title" id="alert_title">

                    </div>
                    <div className="x_content">
                        <div className="" role="tabpanel" data-example-id="togglable-tabs">
                            <ul id="myTab" className="nav nav-tabs bar_tabs" role="tablist">
                                <li role="presentation" className="active"><a href="#tab_profile" role="tab" id="profile-tab" data-toggle="tab" aria-expanded="true">Profile</a>
                                </li>

                                <li role="presentation" className=""><a href="#tab_services" role="tab" id="services-tab" data-toggle="tab" aria-expanded="false">Services</a>
                                </li>
                                <li role="presentation" className=""><a href="#tab_templates" role="tab" id="templates-tab" data-toggle="tab" aria-expanded="false">Templates</a>
                                </li>
                                <li role="presentation" className=""><a href="#tab_admins" role="tab" id="admins-tab" data-toggle="tab" aria-expanded="false">Administrators</a>
                                </li>
                                <li role="presentation" className=""><a href="#tab_notifiers" role="tab" id="notifiers-tab" data-toggle="tab" aria-expanded="false">Notifiers</a>
                                </li>
                            </ul>
                            <div id="myTabContent" className="tab-content">
                                <div role="tabpanel" className="tab-pane fade active in" id="tab_profile" aria-labelledby="profile-tab">
                                    <div className="x_content">
                                        <br />
                                        <div id="profile_form_div">

                                        </div>
                                    </div>
                                </div>
                                <div role="tabpanel" className="tab-pane fade" id="tab_services" aria-labelledby="services-tab">
                                    <div className="x_panel">
                                        <div className="x_content" id="services_table_div">
                                        </div>
                                    </div>
                                </div>
                                <div role="tabpanel" className="tab-pane fade" id="tab_templates" aria-labelledby="templates-tab">
                                    <div className="x_panel">
                                        <div className="x_content" id="templates_table_div">
                                        </div>
                                    </div>
                                </div>
                                <div role="tabpanel" className="tab-pane fade" id="tab_notifiers" aria-labelledby="notifiers-tab">
                                    <div className="x_panel">
                                        <div className="x_content" id="notifiers_table_div">
                                        </div>
                                    </div>
                                </div>
                                <div role="tabpanel" className="tab-pane fade" id="tab_admins" aria-labelledby="admins-tab">
                                    <div className="x_panel">
                                        <div className="x_content" id="admins_table_div">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
    }
})

export default Content
