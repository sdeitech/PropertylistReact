import ACTION_TYPES from '../../Action/ActionTypes';


export default (state = {}, action) => {

	switch (action.type) {

		case ACTION_TYPES.GET_PAYMENT_REPORT_LIST:
			return { ...state, getPaymentReportList: action.payload };

		default:
			return state;
	}

};
