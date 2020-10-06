import ACTION_TYPES from '../../Action/ActionTypes';


export default (state = {}, action) => {

	switch (action.type) {

		case ACTION_TYPES.GET_CHAT_HISTORY:
			return { ...state, getChatHistory: action.payload };

		default:
			return state;
	}

};
