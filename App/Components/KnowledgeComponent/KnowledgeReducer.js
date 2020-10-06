import ACTION_TYPES from '../../Action/ActionTypes';


export default (state = {}, action) => {

	switch (action.type) {

		case ACTION_TYPES.GET_KNOWLEDGE_LIST:
			return { ...state, getKnowledgeRes: action.payload };

		case ACTION_TYPES.GET_KNOWLEDGE_DETAIL:
			return { ...state, getKnowledgeDetail: action.payload };

		default:
			return state;
	}

};
