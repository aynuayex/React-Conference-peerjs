import { IMessage } from "../type/chat";
import { ADD_MESSAGE, ADD_HISTORY, TOGGLE_CHAT } from "./chatActions";

export type ChatState = {
    messages: IMessage[],
    // you can remove this b/c only used in Room
    isChatOpen: boolean,
};

type ChatAction =
  | {
      type: typeof ADD_MESSAGE;
      payload: { message: IMessage };
    }
  | {
      type: typeof ADD_HISTORY;
      payload: { history: IMessage[] };
    }
  | {
      type: typeof TOGGLE_CHAT;
      payload: { isOpen: boolean };
    };

export const chatsReducer = (state: ChatState, action: ChatAction) => {
  switch (action.type) {
    case ADD_MESSAGE:
      return {
        ...state,
        messages: [...state?.messages, action.payload.message],
      };
    case ADD_HISTORY:
      return {
        ...state,
        messages: action.payload.history,
      };
    case TOGGLE_CHAT:
        return {
            ...state,
            isChatOpen: !action.payload.isOpen};
    default:
      return state;
  }
};
