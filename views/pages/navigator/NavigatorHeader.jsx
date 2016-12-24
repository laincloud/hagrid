import React from "react";

let NavigatorHeader = React.createClass({
    render() {
        return (<div className="navbar-header">
            <a className="navbar-brand navbar-brand-center" href="/">
                <img className="navbar-brand-logo" src="static/img/logo-inverse.svg" alt="Elephant Theme" />
            </a>
            <button className="navbar-toggler visible-xs-block collapsed" type="button" data-toggle="collapse" data-target="#sidenav">
                <span className="sr-only">Toggle navigation</span>
                <span className="bars">
                    <span className="bar-line bar-line-1 out"/>
                    <span className="bar-line bar-line-2 out"/>
                    <span className="bar-line bar-line-3 out"/>
                </span>
                <span className="bars bars-x">
                    <span className="bar-line bar-line-4"/>
                    <span className="bar-line bar-line-5"/>
            </span>
            </button>
            <button className="navbar-toggler visible-xs-block collapsed" type="button" data-toggle="collapse" data-target="#navbar">
                <span className="sr-only">Toggle navigation</span>
                <span className="arrow-up"/>
                <span className="ellipsis ellipsis-vertical">
              <img className="ellipsis-object" width="32" height="32" src="static/img/0180441436.jpg" alt="Teddy Wilson"/>
            </span>
            </button>
        </div>)
    },
});


export default NavigatorHeader;