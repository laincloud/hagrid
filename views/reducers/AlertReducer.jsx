import {createReducer} from "../common/Utils";

function getInitRequest(action) {
  return {
    apiType: action.asyncType,
    isFetching: false,
    statusCode: 0,
    error: '',
    opFlash: '',
    data: null,
  };
}

function alertHandlers() {
  let handlers = {};
  handlers['RESET_API_CALL'] = (state, action) => {
    const {apiType} = action;
    if (!state.hasOwnProperty(apiType)) {
      return state;
    }
    return _.assign({}, state, {
      [apiType]: getInitRequest({asyncType: apiType}),
    });
  };
  return handlers;
}


const AlertReducers = createReducer({}, alertHandlers());

export default AlertReducers;
