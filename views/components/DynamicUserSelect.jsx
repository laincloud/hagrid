import React, { Component }from "react";
import $ from "jquery";
import "select2";

export default class DynamicUserSelect extends Component {

  componentDidUpdate() {
    $(`#${this.props.id}`).select2({
      theme: "bootstrap",
      width: "150px",
      placeholder: "Select a user",
      ajax: {
        url: "/api/users/all",
        dataType: 'json',
        delay: 100,
        cache: true,
        data: function (params) {
          return {
            name: params.term,
          };
        },
        processResults: function(data) {
          return {
            results: $.map(data,
              function(obj) {
                return { id: obj.ID, text: obj.Name };
              })
          }
        }
      }
    });
  }

  render() {
    return (
      <div className="form-group">
        <select id={this.props.id} name={this.props.name} className="form-control">
          <option/>
        </select>
      </div>
    )
  }
}