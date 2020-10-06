import ACTION_TYPES from '../../Action/ActionTypes';


export default (state = {}, action) => {

	switch (action.type) {

		case ACTION_TYPES.GET_PROFILE:
			return { ...state, profileRes: action.payload };
		case ACTION_TYPES.CLEAR_GET_PROFILE_RESPONSE:
			return { ...state, profileRes: "" };
		case ACTION_TYPES.UPDATE_PROFILE:
			return { ...state, profileUpdateRes: action.payload };	
		case ACTION_TYPES.CLEAR_UPDATE_PROFILE_RESPONSE:
			return { ...state, profileUpdateRes: "" };	
		default:
			return state;
	}

};
