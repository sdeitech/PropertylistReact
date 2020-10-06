import ACTION_TYPES from '../../Action/ActionTypes';


export default (state = {}, action) => {

	switch (action.type) {

		case ACTION_TYPES.GET_ALL_PROPERTY_LIST_DATA:
			return { ...state, propertyListRes: action.payload };

		case ACTION_TYPES.N_RESET_PROPERTY_LIST_RESPONSE:
			return { propertyListRes: "" };	

		case ACTION_TYPES.GET_FILTERED_PROPERTY_LIST_DATA:
			return { ...state, propertyFilteredRes: action.payload };

		case ACTION_TYPES.GET_FILTERED_PROPERTY_LIST_DATA:
			return { ...state, propertyFilteredRes: action.payload };
		
		case ACTION_TYPES.GET_ALL_SAVED_PROPERTY_LIST_DATA:
			return {...state, propertySavedListRes: action.payload };


		default:
			return state;
	}

};
