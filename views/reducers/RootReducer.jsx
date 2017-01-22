import { combineReducers } from 'redux';
import sideMenuReducer from "./SideMenuReducer";
import alertReducer from "./AlertReducer";
import { graphiteServiceReducer, graphiteServiceListReducer } from "./GraphiteServiceReducer";
import { tcpServiceReducer, tcpServiceListReducer } from "./TCPServiceReducer";
import { templateReducer, templateListReducer } from "./TemplateReducer";

const RootReducer = combineReducers({
  alertReducer,
  sideMenuReducer,
  graphiteServiceReducer,
  graphiteServiceListReducer,
  tcpServiceReducer,
  tcpServiceListReducer,
  templateReducer,
  templateListReducer,
});

export default RootReducer;