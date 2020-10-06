import { put, call, takeEvery, takeLatest, select, cps } from 'redux-saga/effects';
import API from '../Constants/APIUrls';
import API_CONST from '../Constants/APIConstants';
import ACTION_TYPES from '../Action/ActionTypes';







//Call for fetching data from api
const _apiCall = (url, data) => {

	console.log('Api  >>> ', url);
	console.log('Api request >>>', data);
	return fetch(url, data)
		.then((res) => {
			console.log('Api response', res);
			return { res: res, res_json: res.json() };
		})
		.catch((e) => {
			throw e;
		});
};

//get response json
const _extJSON = (p) => {
	return p.then((res) => res);
};



function* userSignup(action) {
	var postData = action.data;
	console.log("Post data>>>>" + postData)
	try {
		let response = yield call(_apiCall, API.SIGNUP_USER, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
			 	'Content-Type': 'application/json'
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		console.log(responseJSON)
		yield put({
			type: ACTION_TYPES.SIGNUP_USER_RES,
			payload: responseJSON
		});
	} catch (e) {
		console.log('Error: ' + e);
		yield put({
			type: ACTION_TYPES.SIGNUP_USER_RES,
			payload: undefined
		});
	}
}



function* loginUser(action) {
	var postData = action.data;


	try {
		let response = yield call(_apiCall, API.LOGIN_USER, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(postData)

		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({
			type: ACTION_TYPES.VALIDATE_USER,
			payload: responseJSON
		});
	} catch (e) {
		console.log('Error: ' + e);
		yield put({
			type: ACTION_TYPES.VALIDATE_USER,
			payload: undefined
		});
	}
}


function* forgotPassword(action) {
  var postData = action.data;
  console.log("Post data>>>>" + postData);
  try {
    let response = yield call(_apiCall, API.FORGOT_PASSWORD, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(postData)
    });
    var responseJSON = yield call(_extJSON, response.res_json);
    console.log(responseJSON);
    yield put({
      type: ACTION_TYPES.FORGOT_PASSWORD_RES,
      payload: responseJSON
    });
  } catch (e) {
    console.log("Error: " + e);
    yield put({
      type: ACTION_TYPES.FORGOT_PASSWORD_RES,
      payload: undefined
    });
  }
}

function* getProfile(action) {
	var postData = action.id;
	var token = action.token;
	console.log("Profile Post data>>>>" + JSON.stringify(action))



	try {
		let response = yield call(_apiCall, API.GET_PROFILE, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: token
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({
			type: ACTION_TYPES.GET_PROFILE,
			payload: responseJSON
		});
	} catch (e) {
		console.log("Profile Error: " + e);
		yield put({
			type: ACTION_TYPES.GET_PROFILE,
			payload: undefined
		});

	}
}



function* updateUserProfile(action) {
  var postData = action.data;
  var token = action.token;

  console.log("Profile Post data>>>>" + postData);
  try {
    let response = yield call(_apiCall, API.UPDATE_USER_PROFILE, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify(postData)
    });
    var responseJSON = yield call(_extJSON, response.res_json);
    yield put({
      type: ACTION_TYPES.UPDATE_PROFILE,
      payload: responseJSON
    });
  } catch (e) {
    console.log("Error: " + e);
    yield put({
      type: ACTION_TYPES.UPDATE_PROFILE,
      payload: undefined
    });
  }
}



function* getAllPropertyList(action) {
  var postData = action.data;
  var token = action.token;

  console.log("Profile Post data>>>>" + postData);

  try {
	  let response = yield call(_apiCall, API.GET_ALL_PROPERTY_LIST, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify(postData)
    });
	var responseJSON = yield call(_extJSON, response.res_json);
    yield put({
      type: ACTION_TYPES.GET_ALL_PROPERTY_LIST_DATA,
      payload: responseJSON
    });
  } catch (e) {
	console.log("Error: " + e);
	  yield put({
		  type: ACTION_TYPES.GET_ALL_PROPERTY_LIST_DATA,
		  payload: undefined
	  });
  }
}

function* getSavedPropertyList(action) {
	var postData = action.data;
	var token = action.token;

	console.log("Profile Post data>>>>" + postData);
	try {
		let response = yield call(_apiCall, API.GET_BOOKMARK_PROPERTY_LIST, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: token
			},
			body:JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({
			type: ACTION_TYPES.GET_ALL_SAVED_PROPERTY_LIST_DATA,
			payload: responseJSON
		});
	} catch (e) {
		console.log("Error: " + e);
		yield put({
			type: ACTION_TYPES.GET_ALL_SAVED_PROPERTY_LIST_DATA,
			payload: undefined
		});
	}
}

function* getFilteredPropertyList(action) {
	var postData = action.data;
	var token = action.token;

	console.log("Profile Post data>>>>" + postData);
	try {
		let response = yield call(_apiCall, API.GET_ALL_PROPERTY_LIST, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: token
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({
			type: ACTION_TYPES.GET_FILTERED_PROPERTY_LIST_DATA,
			payload: responseJSON
		});
	} catch (e) {
		console.log("Error: " + e);
		yield put({
			type: ACTION_TYPES.GET_FILTERED_PROPERTY_LIST_DATA,
			payload: undefined
		});
	}
}

function* getPropertyDetail(action) {
	var postData = action.propertyId;
	var token = action.token;
	console.log("Propertydetail Post data>>>>" + JSON.stringify(postData.propertyId))



	try {
		let response = yield call(_apiCall, API.GET_PROPERTY_BY_ID + "?propertyId=" + postData.propertyId + "&buyerId="+ postData.buyerId, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: token
			},

		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({
			type: ACTION_TYPES.GET_PROPERTY_DETAIL,
			payload: responseJSON
		});
	} catch (e) {
		console.log("Profile Error: " + e);
		yield put({
			type: ACTION_TYPES.GET_PROPERTY_DETAIL,
			payload: undefined
		});

	}
}


//================================== Contact List======================================//

function* getAcceptedContactList(action) {
  var postData = action.data;
  var token = action.token;

	console.log("getAcceptedContactList Post data>>>>" + postData);
  try {
    let response = yield call(_apiCall, API.GET_BUYER_CONTACT_LIST, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify(postData)
    });
    var responseJSON = yield call(_extJSON, response.res_json);
    yield put({
      type: ACTION_TYPES.GET_ACCEEPTED_CONTACT_LIST,
      payload: responseJSON
    });
  } catch (e) {
    console.log("Error: " + e);
    yield put({
      type: ACTION_TYPES.GET_ACCEEPTED_CONTACT_LIST,
      payload: undefined
    });
  }
}


function* getPendingContactList(action) {
	var postData = action.data;
	var token = action.token;

	console.log("getAcceptedContactList Post data>>>>" + postData);
	try {
		let response = yield call(_apiCall, API.GET_BUYER_CONTACT_LIST, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: token
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({
			type: ACTION_TYPES.GET_PENDING_CONTACT_LIST,
			payload: responseJSON
		});
	} catch (e) {
		console.log("Error: " + e);
		yield put({
			type: ACTION_TYPES.GET_PENDING_CONTACT_LIST,
			payload: undefined
		});
	}
}

function* getRejectedContactList(action) {
	var postData = action.data;
	var token = action.token;

	console.log("getAcceptedContactList Post data>>>>" + postData);
	try {
		let response = yield call(_apiCall, API.GET_BUYER_CONTACT_LIST, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: token
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({
			type: ACTION_TYPES.GET_REJECTED_CONTACT_LIST,
			payload: responseJSON
		});
	} catch (e) {
		console.log("Error: " + e);
		yield put({
			type: ACTION_TYPES.GET_REJECTED_CONTACT_LIST,
			payload: undefined
		});
	}
}

//================================= Inspection===========================================//


function* sendInspectionRequest(action) {
  var postData = action.data;
  var token = action.token;

  console.log("getAcceptedContactList Post data>>>>" + postData);
  try {
    let response = yield call(_apiCall, API.SEND_INSPECTION_REQUEST, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify(postData)
    });
    var responseJSON = yield call(_extJSON, response.res_json);
    yield put({
      type: ACTION_TYPES.POST_INSPECTION_REQUEST,
      payload: responseJSON
    });
  } catch (e) {
    console.log("Error: " + e);
    yield put({
      type: ACTION_TYPES.POST_INSPECTION_REQUEST,
      payload: undefined
    });
  }
}

function* bookInspectionTimeSlot(action) {
  var postData = action.data;
  var token = action.token;

  console.log("getAcceptedContactList Post data>>>>" + postData);
  try {
    let response = yield call(_apiCall, API.BOOK_INSPECTION_TIME_SLOT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify(postData)
    });
    var responseJSON = yield call(_extJSON, response.res_json);
    yield put({
      type: ACTION_TYPES.POST_INSPECTION_BOOK_TIME_REQUEST,
      payload: responseJSON
    });
  } catch (e) {
    console.log("Error: " + e);
    yield put({
			type: ACTION_TYPES.POST_INSPECTION_BOOK_TIME_REQUEST,
      payload: undefined
    });
  }
}

function* getUpcomingInspection(action) {
	var postData = action.data;
	var token = action.token;

	console.log("getUpcomingInspection Post data>>>>" + postData);
	try {
		let response = yield call(_apiCall, API.GET_INSPECTION_LIST, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: token
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({
			type: ACTION_TYPES.GET_UPCOMING_INSPECTION_LIST,
			payload: responseJSON
		});
	} catch (e) {
		console.log("Error: " + e);
		yield put({
			type: ACTION_TYPES.GET_UPCOMING_INSPECTION_LIST,
			payload: undefined
		});
	}
}


function* getPendingInspection(action) {
	var postData = action.data;
	var token = action.token;

	console.log("getPendingInspection Post data>>>>" + postData);
	try {
		let response = yield call(_apiCall, API.GET_INSPECTION_LIST, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: token
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({
			type: ACTION_TYPES.GET_PENDING_INSPECTION_LIST,
			payload: responseJSON
		});
	} catch (e) {
		console.log("Error: " + e);
		yield put({
			type: ACTION_TYPES.GET_PENDING_INSPECTION_LIST,
			payload: undefined
		});
	}
}

function* getDeclinedInspection(action) {
	var postData = action.data;
	var token = action.token;

	console.log("getDeclinedInspection Post data>>>>" + postData);
	try {
		let response = yield call(_apiCall, API.GET_INSPECTION_LIST, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: token
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({
			type: ACTION_TYPES.GET_DECLINED_INSPECTION_LIST,
			payload: responseJSON
		});
	} catch (e) {
		console.log("Error: " + e);
		yield put({
			type: ACTION_TYPES.GET_DECLINED_INSPECTION_LIST,
			payload: undefined
		});
	}
}


//Settings

function* getNotificationSettings(action) {
	var postData = action.data;
	var token = action.token;

	console.log("Notification Post data>>>>" + postData);
	try {
		let response = yield call(_apiCall, API.GET_NOTIFICATION_SETTING_REQUEST + "?buyerId=" + postData.buyerId, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: token
			},
			//body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({
			type: ACTION_TYPES.GET_ALL_NOTIFICATION,
			payload: responseJSON
		});
	} catch (e) {
		console.log("Error: " + e);
		yield put({
			type: ACTION_TYPES.GET_ALL_NOTIFICATION,
			payload: undefined
		});
	}
}


function* getKnowlegdeList(action) {
  var postData = action.data;
  var token = action.token;

	console.log("getKnowlegdeList Post data>>>>" + JSON.stringify(postData));
  try {
    let response = yield call(_apiCall, API.GET_KNOWLEDGE_LIST, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify(postData)
    });
    var responseJSON = yield call(_extJSON, response.res_json);
    yield put({
			type: ACTION_TYPES.GET_KNOWLEDGE_LIST,
      payload: responseJSON
    });
  } catch (e) {
    console.log("Error: " + e);
    yield put({
			type: ACTION_TYPES.GET_KNOWLEDGE_LIST,
      payload: undefined
    });
  }
}

function* getServiceList(action) {
	var postData = action.data;
	var token = action.token;

	console.log("getServiceList Post data>>>>" + JSON.stringify(postData));
	try {
		let response = yield call(_apiCall, API.GET_SERVICE_LIST, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: token
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({
			type: ACTION_TYPES.GET_SERVICE_LIST,
			payload: responseJSON
		});
	} catch (e) {
		console.log("Error: " + e);
		yield put({
			type: ACTION_TYPES.GET_SERVICE_LIST,
			payload: undefined
		});
	}
}


function* getKnowlegdeDetail(action) {
	var postData = action.data;
	var token = action.token;

	console.log("getKnowlegdeDetail Post data>>>>" + postData);
	try {
		let response = yield call(_apiCall, API.GET_KNOWLEDGE_BASE_BY_ID, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: token
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({
			type: ACTION_TYPES.GET_KNOWLEDGE_DETAIL,
			payload: responseJSON
		});
	} catch (e) {
		console.log("Error: " + e);
		yield put({
			type: ACTION_TYPES.GET_KNOWLEDGE_DETAIL,
			payload: undefined
		});
	}
}


function* getNofificationList(action) {
	var postData = action.data;
	var token = action.token;

	console.log("getKnowlegdeList Post data>>>>" + JSON.stringify(postData));
	try {
		let response = yield call(_apiCall, API.GET_NOTIFICATION_LIST, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: token
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({
			type: ACTION_TYPES.GET_NOTIFICATION_LIST,
			payload: responseJSON
		});
	} catch (e) {
		console.log("Error: " + e);
		yield put({
			type: ACTION_TYPES.GET_NOTIFICATION_LIST,
			payload: undefined
		});
	}
}


function* getPaymentReportList(action) {
  var postData = action.data;
  var token = action.token;

	console.log("getPaymentReportList Post data>>>>" + JSON.stringify(postData));
  try {
    let response = yield call(_apiCall, API.GET_PAYMENT_REPORT_LIST, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify(postData)
    });
    var responseJSON = yield call(_extJSON, response.res_json);
    yield put({
      type: ACTION_TYPES.GET_PAYMENT_REPORT_LIST,
      payload: responseJSON
    });
  } catch (e) {
    console.log("Error: " + e);
    yield put({
			type: ACTION_TYPES.GET_PAYMENT_REPORT_LIST,
      payload: undefined
    });
  }
}

function* getChatHistory(action) {
	var postData = action.data;
	var token = action.token;

	console.log("getChatHistory Post data>>>>" + JSON.stringify(postData));
	try {
		let response = yield call(_apiCall, API.GET_CHAT_HISTORY, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: token
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({
			type: ACTION_TYPES.GET_CHAT_HISTORY,
			payload: responseJSON
		});
	} catch (e) {
		console.log("Error: " + e);
		yield put({
			type: ACTION_TYPES.GET_CHAT_HISTORY,
			payload: undefined
		});
	}
}



function* rootSaga() {

	// ********************** User Authentication **************************
	yield takeLatest(API_CONST.N_USER_SIGNUP, userSignup);
	yield takeLatest(API_CONST.LOGIN_USER, loginUser);
	yield takeLatest(API_CONST.N_FORGOT_PASSWORD, forgotPassword);
	yield takeLatest(API_CONST.GET_PROFILE_DATA, getProfile);
	yield takeLatest(API_CONST.N_UPDATE_USER_PROFILE, updateUserProfile);
	yield takeLatest(API_CONST.N_GET_ALL_PROPERTY_LIST, getAllPropertyList);
	yield takeLatest(API_CONST.N_GET_FILTERED_PROPERTY_LIST, getFilteredPropertyList);
	yield takeLatest(API_CONST.N_GET_PROPERTY_DETAIL, getPropertyDetail);
	yield takeLatest(API_CONST.N_GET_ACCEEPTED_CONTACT_LIST, getAcceptedContactList);
	yield takeLatest(API_CONST.N_GET_PENDING_CONTACT_LIST, getPendingContactList);
	yield takeLatest(API_CONST.N_GET_REJECTED_CONTACT_LIST, getRejectedContactList);
	yield takeLatest(API_CONST.N_POST_INSEPECTON_REQUEST, sendInspectionRequest);
	yield takeLatest(API_CONST.N_GET_SAVED_PROPERTY_LIST, getSavedPropertyList);
	yield takeLatest(API_CONST.N_POST_BOOK_INSEPECTON_TIME_SLOT_REQUEST, bookInspectionTimeSlot);
	yield takeLatest(API_CONST.N_GET_UPCOMING_INSPECTION_LIST, getUpcomingInspection);
	yield takeLatest(API_CONST.N_GET_PENDING_INSPECTION_LIST, getPendingInspection);
	yield takeLatest(API_CONST.N_GET_DECLINED_INSPECTION_LIST, getDeclinedInspection);
	yield takeLatest(API_CONST.N_GET_NOTIFICATION_SETTING, getNotificationSettings);
	yield takeLatest(API_CONST.N_GET_KNOWLEDGE_BASE_LIST, getKnowlegdeList);
	yield takeLatest(API_CONST.N_GET_KNOWLEDGE_DETAIL, getKnowlegdeDetail);
	yield takeLatest(API_CONST.N_GET_SERVICE_LIST, getServiceList);
	yield takeLatest(API_CONST.N_GET_NOTIFICATION_LIST, getNofificationList);
	yield takeLatest(API_CONST.N_GET_PAYMENT_REPORT_LIST, getPaymentReportList);
	yield takeLatest(API_CONST.N_GET_CHAT_HISTORY, getChatHistory);






}

export default rootSaga;
