import React from "react"
import ReactDOM from "react-dom"

var MessagePanel = React.createClass({

    getInitialState: function() {
        return {isSuccess: true, msgText: "", panelVisible: false}
    },

    componentDidMount: function() {
        $("#poped_message_panel").fadeOut(3000, function(){ $("#poped_message_panel").remove(); });
    },

    render: function() {

        var styleClass = "alert alert-success alert-dismissible fade in";
        if (!this.props.isSuccess) {
            styleClass = "alert alert-danger alert-dismissible fade in";
        }
        return <div className={styleClass} role="alert" id="poped_message_panel">
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                    </button>
                    <strong>{this.props.msgText}</strong>
            </div>
    },
});


var ConfirmModal = React.createClass({

    render: function() {
        return <div className="modal fade bs-example-modal-lg" id={this.props.modalID} tabIndex="-1" role="modal" aria-hidden="true">
                    <div className="modal-backdrop fade"></div>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">

                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span>
                                </button>
                                <h4 className="modal-title">{this.props.modalTitle}</h4>
                            </div>
                            <div className="modal-body">
                                <h4>{this.props.modalMainText}</h4>
                                <p>{this.props.modalSubText}</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className={this.props.closeBtnClass} data-dismiss="modal">{this.props.closeBtnText}</button>
                                <button type="button" className={this.props.confirmBtnClass} onClick={this.props.handleConfirm}>{this.props.confirmBtnText}</button>
                            </div>

                        </div>
                    </div>
                </div>
    }
})


var popUpMessagePanel = function(msgText, isSuccess) {
    ReactDOM.render(<MessagePanel msgText={msgText} isSuccess={isSuccess} />, document.getElementById("message_panel"));
}

module.exports = {
    popUpMessagePanel,
    ConfirmModal,
}
