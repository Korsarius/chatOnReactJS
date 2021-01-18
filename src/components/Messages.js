import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import {
  EmojiList,
  youtube,
  emojiSend,
  YOUTUBE_REGEXP,
  EMOJI_REGEXP,
  emoji,
  messageText,
} from "./emojiList";
import "./styles/user-page.css";

const Messages = ({ message }) => {
  return (
    <p className="message">
      <span className="message-nick">{message.owner.nick}: </span>
      <span className="message-text">{messageText(message.text)}</span>
      {EMOJI_REGEXP.test(message.text)
        ? emojiSend(message.text).map((item, index) => {
            return (
              <img
                className="emojis"
                src={`https://www.webfx.com/tools/emoji-cheat-sheet/${emoji[item]}`}
                alt="emoji"
                key={index.toString()}
              />
            );
          })
        : ""}
      <span className="message-data">
        {new RegExp(/(-+)|(:+)/gi).test(message.createdAt)
          ? new Date(message.createdAt).toLocaleString()
          : new Date(+message.createdAt).toLocaleString()}
      </span>
    </p>
  );
};

export default Messages;
