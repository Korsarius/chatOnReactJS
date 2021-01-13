export default function promiseReducer(state, action) {
  if (state === undefined) {
    return {
      data: null,
    };
  }
  if (action.type === "PROMISE") {
    let name = action.name;
    return {
      ...state,
      [name]: {
        status: action.status,
        payload: action.payload,
        error: action.error,
      },
    };
  }
  return state;
}
