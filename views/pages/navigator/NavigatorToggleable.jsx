import React from "react";

let NavigatorToggleable = React.createClass({
    render() {
      return (
        <div className="navbar-toggleable">
          <nav id="navbar" className="navbar-collapse collapse">
            <button className="sidenav-toggler hidden-xs" title="Collapse sidenav ( [ )" aria-expanded="true" type="button">
              <span className="sr-only">Toggle navigation</span>
              <span className="bars">
                <span className="bar-line bar-line-1 out"/>
                <span className="bar-line bar-line-2 out"/>
                <span className="bar-line bar-line-3 out"/>
                <span className="bar-line bar-line-4 in"/>
                <span className="bar-line bar-line-5 in"/>
                <span className="bar-line bar-line-6 in"/>
              </span>
            </button>
            <ul className="nav navbar-nav navbar-right">
              <li className="visible-xs-block">
                <h4 className="navbar-text text-center">Hi, Teddy Wilson</h4>
              </li>
              <li className="hidden-xs hidden-sm">
                <form className="navbar-search" aria-expanded="true">
                  <div className="navbar-search-group">
                    <select className="navbar-search-input">
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                    </select>
                  </div>
                </form>
              </li>
              <li className="dropdown hidden-xs">
                <button className="navbar-account-btn" data-toggle="dropdown" aria-haspopup="true">
                  <img className="rounded" width="36" height="36" src="static/img/0180441436.jpg" alt="Teddy Wilson"/> Teddy Wilson
                    <span className="caret"/>
                </button>
                  <ul className="dropdown-menu dropdown-menu-right">
                    <li><a href="/logout">Sign out</a></li>
                  </ul>
              </li>
            </ul>
          </nav>
        </div>)

    },
});

export default NavigatorToggleable;