import ACTION_TYPES from '../../Action/ActionTypes';


export default (state = {}, action) => {

	switch (action.type) {

		case ACTION_TYPES.GET_ALL_NOTIFICATION:
			return { ...state, getNotificationRes: action.payload };

		default:
			return state;
	}

};
