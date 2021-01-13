export function actionToken(tokeN) {
  return {
    type: "LOGIN",
    token: tokeN,
  };
}

export function actionLogout() {
  return {
    type: "LOGOUT",
  };
}
