import ACTION_TYPES from '../../Action/ActionTypes';


export default (state = {}, action) => {

	switch (action.type) {

		case ACTION_TYPES.GET_SERVICE_LIST:
			return { ...state, getServiceList: action.payload };

		default:
			return state;
	}

};
