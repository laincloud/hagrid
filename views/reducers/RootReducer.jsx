import { combineReducers } from 'redux';
import sideMenuReducer from "./SideMenuReducer";
import alertReducer from "./AlertReducer";
import { graphiteServiceReducer, graphiteServiceListReducer } from "./GraphiteServiceReducer";
import { tcpServiceReducer, tcpServiceListReducer } from "./TCPServiceReducer";
import { templateReducer, templateListReducer } from "./TemplateReducer";
import userReducer from "./UserReducer";

const RootReducer = combineReducers({
  alertReducer,
  sideMenuReducer,
  graphiteServiceReducer,
  graphiteServiceListReducer,
  tcpServiceReducer,
  tcpServiceListReducer,
  templateReducer,
  templateListReducer,
  userReducer,
});

export default RootReducer;