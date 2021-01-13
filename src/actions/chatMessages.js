export function actionSaveMessages(messages, idChat, titleChat) {
  return {
    type: "CHAT_MESSAGES",
    messages: messages == null ? [] : messages,
    chatId: idChat,
    chatTitle: titleChat,
  };
}
