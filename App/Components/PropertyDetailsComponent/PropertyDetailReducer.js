import ACTION_TYPES from '../../Action/ActionTypes';


export default (state = {}, action) => {

	switch (action.type) {

		case ACTION_TYPES.GET_PROPERTY_DETAIL:
			return { ...state, propertyDetailRes: action.payload };


		default:
			return state;
	}

};
