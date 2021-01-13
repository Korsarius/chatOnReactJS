export function actionSaveUsersLogin(name, login) {
  return {
    type: "CHAT_FIND_USER",
    name,
    login,
  };
}

export function actionDeleteUsersLoginFromChat(name, login) {
  return {
    type: "CHAT_DELETE_USER",
    name,
    login,
  };
}

export function actionFoundUsersLogin(name, login) {
  return {
    type: "CHAT_FOUND_USER",
    name,
    login,
  };
}

export function actionAddUsersLogin(name, login) {
  return {
    type: "CHAT_USERS_BACK",
    name,
    login,
  };
}

export function actionDeleteUsersLogin(name, login) {
  return async function (dispatch) {
    dispatch(actionFoundUsersLogin("saveFoundUsersLogin", login));
    dispatch(actionDeleteUsersLoginFromChat(name, login));
  };
}

export function actionAddUsersLoginBackToChat(name, login) {
  return async function (dispatch) {
    dispatch(actionAddUsersLogin("addOrDeleteUserToChat", login));
    dispatch(actionDeleteUsersLoginFromChat(name, login));
  };
}
