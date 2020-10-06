import ACTION_TYPES from '../../Action/ActionTypes';


export default (state = {}, action) => {

	switch (action.type) {

		case ACTION_TYPES.POST_INSPECTION_REQUEST:
			return { ...state, inspectionRes: action.payload };

		case ACTION_TYPES.POST_INSPECTION_BOOK_TIME_REQUEST:
			return { ...state, inspectionBookRes: action.payload };

		case ACTION_TYPES.GET_UPCOMING_INSPECTION_LIST:
			return { ...state, upcomingInspectionList: action.payload };
		case ACTION_TYPES.GET_PENDING_INSPECTION_LIST:
			return { ...state, pendingInspectionList: action.payload };
		case ACTION_TYPES.GET_DECLINED_INSPECTION_LIST:
			return { ...state, declinedInspectionList: action.payload };  

		default:
			return state;
	}

};
