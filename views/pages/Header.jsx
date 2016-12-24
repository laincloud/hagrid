import React from "react";
import NavigatorBar from "./navigator/NavigatorBar";

let HeaderPage = React.createClass({
    render() {
        return (
            <div className="layout-header">
                <NavigatorBar />
            </div>
        )
    },
});

export default HeaderPage;