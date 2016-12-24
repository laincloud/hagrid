import React from "react";
import NavigatorHeader from "./NavigatorHeader";
import NavigatorToggleable from "./NavigatorToggleable";

let NavigatorBar = React.createClass({
    render() {
        return (
            <div className="navbar navbar-default">
                <NavigatorHeader />
                <NavigatorToggleable />
            </div>
        )
    }
});

export default NavigatorBar;