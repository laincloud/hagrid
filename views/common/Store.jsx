import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import createLogger from "redux-logger";
import promiseMiddleware from "redux-promise";
import RootReducer from "../reducers/RootReducer";

const loggerMiddleware = createLogger();

const store = createStore(
  RootReducer,
  applyMiddleware(
    thunkMiddleware,
    promiseMiddleware,
    loggerMiddleware,
  )
);

export default store;