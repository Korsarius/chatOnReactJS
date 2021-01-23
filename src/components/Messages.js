import React, { useState, useEffect, useRef } from "react";
import {
  emoji,
  emojiSend,
  youtube,
  messageText,
  messageLink,
  images,
  LINK_REGEXP,
  EMOJI_REGEXP,
  YOUTUBE_REGEXP,
  YOUTUBE_REGEXP_ID,
  IMAGE_REGEXP,
} from "./emojiList";
import "./styles/user-page.css";

const Messages = ({ message }) => {
  return (
    <p className="message">
      <span className="message-nick">{message.owner.nick}: </span>
      <span className="message-text">
        {IMAGE_REGEXP.test(message.text)
          ? images(message.text).map((item, index) => {
              return (
                <a
                  key={index.toString()}
                  href={item}
                  rel="noreferrer"
                  target="_blank"
                >
                  <img
                    className="message--img"
                    src={item}
                    alt={`img: ${index}`}
                  />
                </a>
              );
            })
          : LINK_REGEXP.test(message.text)
          ? messageLink(message.text).map((item, index) => {
              return (
                <a
                  key={index.toString()}
                  href={item}
                  rel="noreferrer"
                  target="_blank"
                >
                  {item}
                </a>
              );
            })
          : messageText(message.text)}
      </span>
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
        : YOUTUBE_REGEXP.test(message.text)
        ? youtube(message.text).map((item, index) => {
            return (
              <iframe
                title={`myFrame: ${index.toString()}`}
                key={index.toString()}
                className="youtube-frame"
                src={`https://www.youtube.com/embed/${item
                  .replace(YOUTUBE_REGEXP, item.match(YOUTUBE_REGEXP_ID))
                  .replace("=", "")}`}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
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
