import React from "react";
import ReactDOM from "react-dom";
import BodyPage from "./pages/Body";
import $ from "jquery";

$(document).ready(function(){
  $(".select2-container--bootstrap").height("inherit");
});

ReactDOM.render(<BodyPage />, document.getElementById("body_div"));