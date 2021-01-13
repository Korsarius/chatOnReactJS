export function actionPending(name) {
  return {
    name,
    type: "PROMISE",
    status: "PENDING",
    payload: null,
    error: null,
  };
}

export function actionFulfilled(name, payload) {
  return {
    name,
    type: "PROMISE",
    status: "FULFILLED",
    payload: payload,
    error: null,
  };
}
export function actionRejected(name, error) {
  return {
    name,
    type: "PROMISE",
    status: "REJECTED",
    error: error,
    payload: null,
  };
}

export function actionPromise(name, promise) {
  return async function (dispatch) {
    dispatch(actionPending(name));
    try {
      let result = await promise;
      if (result.errors) {
        dispatch(actionRejected(name, result.errors));
        return result;
      } else {
        dispatch(actionFulfilled(name, result));
        return result;
      }
    } catch (e) {
      dispatch(actionRejected(name, e));
    }
  };
}
