import { combineReducers } from 'redux';
import sideMenuReducer from "./SideMenuReducer";
import alertReducer from "./AlertReducer";
import { graphiteServiceReducer, graphiteServiceListReducer } from "./GraphiteServiceReducer";
import { tcpServiceReducer, tcpServiceListReducer } from "./TCPServiceReducer";
import { httpServiceReducer, httpServiceListReducer, httpTestReducer } from "./HTTPServiceReducer";
import { templateReducer, templateListReducer } from "./TemplateReducer";
import userReducer from "./UserReducer";
import adminReducer from "./AdminReducer";
import notifierReducer from "./NotifierReducer";

const RootReducer = combineReducers({
  alertReducer,
  sideMenuReducer,
  graphiteServiceReducer,
  graphiteServiceListReducer,
  tcpServiceReducer,
  tcpServiceListReducer,
  httpServiceReducer,
  httpServiceListReducer,
  httpTestReducer,
  templateReducer,
  templateListReducer,
  userReducer,
  adminReducer,
  notifierReducer,
});

export default RootReducer;