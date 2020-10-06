import ACTION_TYPES from '../../Action/ActionTypes';


export default (state = "", action) => {

	switch (action.type) {

		case ACTION_TYPES.FORGOT_PASSWORD_RES:
			return { ...state, forgotPass: action.payload }
		default:
			return state;
	}

};
