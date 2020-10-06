import ACTION_TYPES from '../../Action/ActionTypes';

export default (state = "", action) => {

	const INITIAL_STATE = {

		isloading: false,
	}

	switch (action.type) {

		case ACTION_TYPES.SIGNUP_USER_RES:
			return { ...state, isloading:false,signupRes: action.payload, isHomeScreenLoading: false }

		case ACTION_TYPES.SIGNUP_CLEAR_DATA:
			return { ...state, isloading: false, signupRes: "", isHomeScreenLoading: false }

		default:
			return state;
	}

};