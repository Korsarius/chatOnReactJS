import { combineReducers } from "redux";
import AuthReducer from "./AuthReducer";
import promiseReducer from "./promiseReducer";
import chatMessagesReducer from "./chatMessagesReducer";
import chatCreateReducer from "./chatCreateReducer";

const reducers = combineReducers({
  AuthReducer,
  promiseReducer,
  chatMessagesReducer,
  chatCreateReducer,
});

export default reducers;
