export default function chatMessagesReducer(state, action) {
  if (state === undefined) {
    return {};
  }
  if (action.type === "CHAT_MESSAGES") {
    const { messages, chatId, chatTitle } = action;
    return {
      // ...state,
      chatTitle,
      [chatId]: [...(state[chatId] || []), ...messages],
    };
  }
  return state;
}
