import React, {Component} from "react";
import DataTable from "../../components/DataTable";
import { STYLE_PRIMARY, STYLE_SUCCESS, SIZE_PILL, STYLE_INFO } from "../../common/Constants";
import { MODE_ADD, MODE_UPDATE, MODE_DELETE } from "../../common/Constants";
import "datatables.net-bs";
import SimpleButton from "../../components/SimpleButton";
import Label from "../../components/Label";
import TemplateModal from "./TemplateModal";
import { Provider } from "react-redux";
import store from "../../common/Store";
import { connect } from "react-redux";
import { openTemplateModal } from "../../actions/TemplateAction";


class TemplateListCardComponent extends Component {

  constructor(props) {
    super(props);
  }

  componentWillUpdate() {
    $("#template_table").DataTable({
      autoWidth: false,
      destroy: true,
    }).destroy();
  }

  componentDidUpdate() {

    $("#template_table").DataTable({
      columnDefs: [{
        orderable: false,
        targets: [-1]
      }],
      dom: "<'row'<'col-sm-6'i><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-12'p>>",
      info: true,
      language: {
        paginate: {
          previous: '&laquo;',
          next: '&raquo;'
        }
      },
      order: [[0, "asc"]],
      searching: true,
      destroy: true,
      autoWidth: false,
    });

  }

  render() {
    const tableHeader = ["ID", "Name", "Values", "Operations"];
    const updateTemplate = this.props.updateTemplate.bind(this);
    const deleteTemplate = this.props.deleteTemplate.bind(this);
    const tableRows = [];

    this.props.templates.map(function(template, i) {
      let updateSpan = <span className="icon icon-edit"/>;
      let deleteSpan = <span className="icon icon-trash"/>;
      let actionGroup = <div className="btn-group btn-group-sm" role="group">
        <SimpleButton btStyle={STYLE_SUCCESS} text={updateSpan} isOutline={false} isIcon={true} handleClick={() => updateTemplate(template)}/>
        <SimpleButton btStyle={STYLE_PRIMARY} text={deleteSpan} isOutline={false} isIcon={true} handleClick={() => deleteTemplate(template)}/>
      </div>;
      let labelGroup = template["Values"].split(",").map(function(value, j){
        return <Label key={j} isOutline={true} labelStyle={STYLE_INFO} text={value}/>
      });
      tableRows.push([
        template["ID"],
        template["Name"],
        labelGroup,
        actionGroup,
      ]);
    });

    const isAuthed = this.props.alertID != 0;
    return (
      <div>
        <div className="title-bar">
          <div className="title-bar-actions">
            <SimpleButton text="New Template" btSize={SIZE_PILL} btStyle={STYLE_SUCCESS} handleClick={() => this.props.addTemplate(this.props.alertID)} isDisabled={!isAuthed}/>
          </div>
          <h1 className="title-bar-title">
            <span className="d-ib">Template</span>
          </h1>
          {
            function() {
              if (!isAuthed) {
                return <p className="title-bar-description">
                  <small>You must select an alert first.</small>
                </p>
              }
            }()
          }
        </div>
        <div className="row gutter-xs">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <DataTable tableID="template_table" headers={tableHeader} rows={tableRows}/>
              </div>
              <Provider store={store}>
                <TemplateModal />
              </Provider>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    alertID: state.templateListReducer.alertID,
    templates: state.templateListReducer.templates,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addTemplate: (alertID) => dispatch(openTemplateModal({AlertID: alertID}, MODE_ADD)),
    updateTemplate: (templateData) => dispatch(openTemplateModal(templateData, MODE_UPDATE)),
    deleteTemplate: (templateData) => dispatch(openTemplateModal(templateData, MODE_DELETE)),
  }
}

const TemplateListCard = connect(mapStateToProps, mapDispatchToProps)(TemplateListCardComponent);

export default TemplateListCard;