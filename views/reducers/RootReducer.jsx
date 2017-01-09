import { combineReducers } from 'redux';
import sideMenuReducer from "./SideMenuReducer";
import graphiteServiceReducer from "./GraphiteServiceReducer";

const RootReducer = combineReducers({
  sideMenuReducer,
  graphiteServiceReducer
});

export default RootReducer;