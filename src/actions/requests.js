import { GQL } from "../App";
import { actionToken, actionAuthUserInfo } from "./authorization";
import { actionSaveMessages } from "./chatMessages";
import { actionRejected, actionPromise } from "./promiseActions";

export function actionLogin(login, password) {
  return async function (dispatch) {
    let data = await dispatch(
      actionPromise(
        "userLogin",
        GQL(
          `query login($login:String, $password:String){
    login(
      login:$login, password:$password)
  }`,
          {
            login,
            password,
          }
        )
      )
    );
    if (data.data.login == null) {
      await dispatch(
        actionRejected("userLogin", new SyntaxError("Данные некорректны"))
      );
      return;
    }
    console.log(data.data.login);
    await dispatch(actionToken(data.data.login));
    await dispatch(actionUserFindOne(login));
  };
}

export function actionUserFindOne(login) {
  return async function (dispatch) {
    let data = await dispatch(
      actionPromise(
        "userFindOne",
        GQL(
          `query UserInfo($query:String){
            UserFindOne(query: $query){
              _id
              createdAt
              login
              nick
              avatar{
                url
                originalFileName
              }
              chats{
                _id
                title
                members{
                  login
                }
              }
            }
          }`,
          { query: JSON.stringify([{ login: login }]) }
        )
      )
    );
    console.log("data: ", data);
    // await dispatch(actionAuthUserInfo(data.data.UserFindOne));
  };
}

export function actionRegistration(login, password, nick) {
  return async function (dispatch) {
    let data = await dispatch(
      actionPromise(
        "regitration",
        GQL(
          `mutation registration($user:UserInput){
            UserUpsert(user:$user){
              _id login nick
            }
          }`,
          { user: { login: login, password: password, nick: nick } }
        )
      )
    );
    console.log(data);
    if (data.errors) {
      await dispatch(
        actionRejected("regitration", new SyntaxError("Данные некорректны"))
      );
      return;
    } else {
      if (data.data.UserUpsert.login) {
        console.log("data.data.UserUpsert.login: ", data.data.UserUpsert.login);
        await dispatch(actionLogin(data.data.UserUpsert.login, password));
      }
    }
  };
}

export function actionUserFindOneOnLogin(login) {
  return async function (dispatch) {
    let data = await dispatch(
      actionPromise(
        "userFindOneOnLogin",
        GQL(
          `query UserInfo($query:String){
            UserFindOne(query: $query){
              _id
              createdAt
              login
              nick
              avatar{
                url
              }
              chats{
                title
                members{
                  login
                }
              }
            }
          }`,
          { query: JSON.stringify([{ login: login }]) }
        )
      )
    );
  };
}

export function actionUserFindOneOnLoginForCreatChat(login) {
  return async function (dispatch) {
    let data = await dispatch(
      actionPromise(
        "userFindOneOnLoginForCreatChat",
        GQL(
          `query UserInfo($query:String){
            UserFindOne(query: $query){
                _id
                createdAt
                login
                nick
                avatar{
                  url
                }
                chats{
                  title
                  members{
                    login
                  }
                }
              }
            }`,
          { query: JSON.stringify([{ login: login }]) }
        )
      )
    );
  };
}

export function actionCreateChat(title, id) {
  return async function (dispatch) {
    let data = await dispatch(
      actionPromise(
        "createChat",
        GQL(
          `mutation CreateChat($chat:ChatInput){
            ChatUpsert(chat:$chat){
              _id
              title
              owner{
                _id
                login
                nick
              }
            }
          }`,
          { chat: { title: title, members: { _id: id } } }
        )
      )
    );
    await dispatch(actionFindAllChats(id));
  };
}

export function actionChatWithSelectedUser(title, id, idSelectedUser) {
  return async function (dispatch) {
    let chatTitles = [];
    let resultCode = 0;
    let response = await dispatch(
      actionPromise(
        "findChatsPersonalConversation",
        GQL(
          `query chatFindMembers($query:String){
          ChatFind(query:$query){
            _id
            title
            owner{
              _id
              login
              nick
            }
            members{
              _id
              login
              nick
            }
          }
        }`,
          {
            query: JSON.stringify([{ ___owner: id }]),
          }
        )
      )
    );
    for (let chat of response.data.ChatFind) {
      chatTitles.push(chat.title);
    }
    if (!chatTitles.includes(title)) {
      let data = await dispatch(
        actionPromise(
          "createChat",
          GQL(
            `mutation CreateChat($chat:ChatInput){
            ChatUpsert(chat:$chat){
              _id
              title
              owner{
                _id
                login
                nick
              }
            }
          }`,
            {
              chat: {
                title: title,
                members: [{ _id: id }, { _id: idSelectedUser }],
              },
            }
          )
        )
      );
      await dispatch(actionFindAllChats(id));
      resultCode += 1;
      return resultCode;
    } else if (chatTitles.includes(title)) {
      resultCode += 2;
      return resultCode;
    }
  };
}

export function actionAddAvatar(userId, avatarId) {
  return async function (dispatch) {
    let data = await dispatch(
      actionPromise(
        "addAvatarToUser",
        GQL(
          `mutation addAvatarToUser($user:UserInput){
            UserUpsert(user:$user){
              login
              avatar{
                url
                originalFileName
              }
            }
          }`,
          { user: { _id: userId, avatar: { _id: avatarId } } }
        )
      )
    );
    console.log(data);
  };
}

// "[{\"_id\": \"5e04fbb9fcc6d159b36b3e2d\"}]"
export function actionFindAllChats(id) {
  return async function (dispatch) {
    let data = await dispatch(
      actionPromise(
        "findChats",
        GQL(
          `query usersChats($query: String) {
            UserFindOne(query: $query) {
              chats {
                _id
                title
                members {
                  login
                }
              }
            }
          }`,
          { query: JSON.stringify([{ _id: id }]) }
        )
      )
    );
  };
}

export function actionUpload(form, userId) {
  return async (dispatch) => {
    let data = await dispatch(
      actionPromise(
        "uploadFile",
        fetch("http://chat.fs.a-level.com.ua/upload", {
          method: "POST",
          headers: localStorage.authToken
            ? { Authorization: "Bearer " + localStorage.authToken }
            : {},
          body: new FormData(form),
        }).then((res) => {
          console.log("Res: ", res);
          return res.json();
        })
      )
    );
    console.log(data);
    await dispatch(actionAddAvatar(userId, data._id));
  };
}

export function actionGetMessages(id) {
  return async (dispatch) => {
    let data = await dispatch(
      actionPromise(
        "oneChatMessages",
        GQL(
          `query oneChatMessages($query: String) {
            ChatFindOne(query: $query) {
              _id
              title
              avatar{
                url
              } 
              members {
                nick
              }
              messages {
                _id
                owner {
                  nick
                }
                text
                createdAt
              }
            }
          }`,
          { query: JSON.stringify([{ _id: id }]) }
        )
      )
    );
    if (data.data.ChatFindOne !== null) {
      dispatch(
        actionSaveMessages(
          data.data.ChatFindOne.messages,
          data.data.ChatFindOne._id,
          data.data.ChatFindOne.title
        )
      );
    }
  };
}

export function actionSetMessage(idChat, text) {
  return async (dispatch) => {
    let data = await dispatch(
      actionPromise(
        "setMessage",
        GQL(
          `mutation addMessageToChat($message:MessageInput){
            MessageUpsert(message:$message){
              _id
              createdAt
              text
              owner{
                _id
                login
                nick
              }
              chat{
                _id
                title
              }
            }
          }`,
          { message: { chat: { _id: idChat }, text: text } }
        )
      )
    );
    // console.log(data);

    // dispatch(
    //   actionSaveMessages(
    //     [
    //       {
    //         _id: data.data.MessageUpsert._id,
    //         owner: data.data.MessageUpsert.owner,
    //         text: data.data.MessageUpsert.text,
    //         createdAt: data.data.MessageUpsert.createdAt,
    //       },
    //     ],
    //     data.data.MessageUpsert.chat._id,
    //     data.data.MessageUpsert.chat.title
    //   )
    // );

    // await dispatch(actionGetMessages(data.data.MessageUpsert.chat._id));
  };
}

// export function actionAddChatsToOwner(chats,id){
//   return async dispatch=>{
//       let data = await dispatch(
//           actionPromise(
//               "addChatsToOwner",
//               GQL(
//                   `mutation addChatToUser{
//                     UserUpsert(user:{_id:5f69ea01c3de58221910d292, chats:[...chats,{_id:5f7746eb44e0156febb2aaea}]}){
//                       _id
//                       login
//                       nick
//                       avatar{
//                         url
//                       }
//                       chats{
//                         title
//                       }
//                     }
//                   }`
//                  ,{query: JSON.stringify([user:{_id:id, chats: [...chats, newChat]}])}
//                  )
//           )
//       )
//       // data.data.UserFindOne.following.push(idFollowing)
//       // let newFollowing = JSON.stringify(data.data.UserFindOne.following)
//       // let newArr = await dispatch(
//       //     actionPromise(
//       //         name,
//       //         gql(`mutation following($id:String!,$newFollowing:[UserInput]!){
//       //             UserUpsert( user:{_id:$id,following:$newFollowing}){
//       //               _id
//       //             }
//       //           }`,{id,newFollowing})
//       //     )
//       // )
//       // console.log(newArr)
//   }
// }

// `mutation addChatToUser{
//   UserUpsert(user:{_id:5f69ea01c3de58221910d292, chats:[...chats,{_id:5f7746eb44e0156febb2aaea}]}){
//     _id
//     login
//     nick
//     avatar{
//       url
//     }
//     chats{
//       title
//     }
//   }
// }`
