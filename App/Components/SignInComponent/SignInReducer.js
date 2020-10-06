import ACTION_TYPES from '../../Action/ActionTypes';


export default (state = {}, action) => {
	switch (action.type) {

		case ACTION_TYPES.VALIDATE_USER:
			return { ...state, signinRes: action.payload };

		case ACTION_TYPES.LOGOUT_USER:
			return { ...state, logoutRes: action.payload}

		case ACTION_TYPES.CLEAR_DATA:
			return INITIAL_STATE;

		default:
			return state;
	}

};
