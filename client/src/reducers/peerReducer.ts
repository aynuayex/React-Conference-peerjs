import { User } from "../type/user";
import {
  ADD_PEER_NAME,
  ADD_PEER_STREAM,
  ADD_ALL_PEERS,
  REMOVE_PEER_STREAM,
} from "./peerActions";

export type PeerState = Record<
  string,
  { stream?: MediaStream; userName?: string }
>;

type PeerAction =
  | {
      type: typeof ADD_PEER_STREAM;
      payload: { peerId: string; stream: MediaStream };
    }
  | {
      type: typeof ADD_PEER_NAME;
      payload: { peerId: string; userName: string };
    }
  | {
      type: typeof REMOVE_PEER_STREAM;
      payload: { peerId: string };
    }
  | {
      type: typeof ADD_ALL_PEERS;
      payload: {
        peers: Record<string, User>;
      };
    };

export const peersReducer = (state: PeerState, action: PeerAction) => {
  switch (action.type) {
    case ADD_PEER_STREAM:
      return {
        ...state,
        [action.payload.peerId]: {
          ...state[action.payload.peerId],
          stream: action.payload.stream,
        },
      };
    case ADD_PEER_NAME:
      return {
        ...state,
        [action.payload.peerId]: {
          ...state[action.payload.peerId],
          userName: action.payload.userName,
        },
      };
      // please revise here in detail because peers is { peerId, userName} , no stream
    case ADD_ALL_PEERS:
      return {
        ...state,
        ...action.payload.peers,
      };
    case REMOVE_PEER_STREAM:
      // const { [action.payload.peerId]: deleted, ...rest } = state;
      return {
        ...state,
        [action.payload.peerId]: {
          ...state[action.payload.peerId],
          stream: undefined,
        },
      };
    default:
      return state;
  }
};
