import ACTION_TYPES from "../../Action/ActionTypes";

export default (state = {}, action) => {
  switch (action.type) {
    case ACTION_TYPES.GET_ACCEEPTED_CONTACT_LIST:
      return { ...state, acceptContactList: action.payload };
    case ACTION_TYPES.GET_PENDING_CONTACT_LIST:
      return { ...state, pendingContactList: action.payload };
    case ACTION_TYPES.GET_REJECTED_CONTACT_LIST:
      return { ...state, rejectContactList: action.payload };
    default:
      return state;
  }
};
