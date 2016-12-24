import React, { Component } from "react";

export default class DataTable extends Component {

  static get defaultProps(){
    return {
      headers: [],
      rows: [],
    }
  }

  render() {
    return (
      <div className="table-responsive">
        <table id={this.props.tableID} className="table table-left nowrap no-footer">
          <thead>
            <tr>
              {
                this.props.headers.map(function(header, i){
                  return <th key={i}>{header}</th>
                })
              }
            </tr>
          </thead>
          <tbody>
          {
            this.props.rows.map(function(row, i){
              return (
                <tr key={i}>
                  {
                    row.map(function(cell, j){
                      return <td key={j}>{cell}</td>
                    })
                  }
                </tr>
              )
            })
          }
          </tbody>
        </table>
      </div>
    )
  }
}