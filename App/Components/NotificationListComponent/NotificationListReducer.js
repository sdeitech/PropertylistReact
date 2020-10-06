import ACTION_TYPES from '../../Action/ActionTypes';


export default (state = {}, action) => {

	switch (action.type) {
    case ACTION_TYPES.GET_NOTIFICATION_LIST:
      return { ...state, getNotificationList: action.payload };

    default:
      return state;
  }

};
