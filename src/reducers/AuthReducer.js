import jwt_decode from "jwt-decode";

let authReducer = (state, action) => {
  if (state === undefined) {
    return { data: null };
  }
  if (action.type === "LOGIN") {
    var decoded = jwt_decode(action.token);
    localStorage.authToken = action.token;
    console.log({ data: decoded, token: action.token });
    return { data: decoded, token: action.token };
  }
  if (action.type === "LOGOUT") {
    localStorage.authToken = "";
    localStorage.authUser = "";
    return { data: null };
  }
  return state;
};

export default authReducer;
