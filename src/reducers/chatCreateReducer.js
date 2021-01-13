export default function chatCreateReducer(state, action) {
  if (state === undefined) {
    return {};
  }
  if (action.type === "CHAT_FIND_USER") {
    const { name, login } = action;
    // && state[name].users.includes(login)
    return {
      ...state,
      [name]: {
        users:
          state && state[name] && state[name].users
            ? [...state[name].users, login]
            : [login],
      },
    };
  }
  if (action.type === "CHAT_FOUND_USER") {
    const { name, login } = action;
    return {
      ...state,
      [name]: {
        users:
          state && state[name] && state[name].users
            ? [...state[name].users, login]
            : [login],
      },
    };
  }
  if (action.type === "CHAT_DELETE_USER") {
    const { name, login } = action;
    if (
      state &&
      state[name] &&
      state[name].users &&
      state[name].users.includes(login)
    ) {
      let arr = [...state[name].users];
      arr.splice(arr.indexOf(login), 1);
      return {
        ...state,
        [name]: {
          users: arr,
        },
      };
    } else {
      return {
        ...state,
        [name]: {
          users: [...state[name].users],
        },
      };
    }
  }
  if (action.type === "CHAT_USERS_BACK") {
    const { name, login } = action;
    return {
      ...state,
      [name]: {
        users:
          state && state[name] && state[name].users
            ? [...state[name].users, login]
            : [login],
      },
    };
  }
  return state;
}
