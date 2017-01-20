import { combineReducers } from 'redux';
import sideMenuReducer from "./SideMenuReducer";
import { graphiteServiceReducer, graphiteServiceListReducer } from "./GraphiteServiceReducer";

const RootReducer = combineReducers({
  sideMenuReducer,
  graphiteServiceReducer,
  graphiteServiceListReducer,
});

export default RootReducer;