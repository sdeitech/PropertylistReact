import API_CONST from '../Constants/APIConstants';
import ACTION_TYPES from '../Action/ActionTypes';
//For user login
export const userSignup = (data) => {
  console.log(data)
  return {
    type: API_CONST.N_USER_SIGNUP,
    data
  };
};

export const userSignupwithFB = (data) => {
  console.log(data)
  return {
    type: API_CONST.N_USER_SIGNUP_FB,
    data
  };
};

export const loginUser = (data) => {
  return {
    type: API_CONST.LOGIN_USER,
    data
  };
};

export const loginUserwithFB = (data) => {
  return {
    type: API_CONST.LOGIN_USER_FB,
    data
  };
};

export const sendServicePreference = (data) => {
  console.log(data)
  return {
    type: API_CONST.N_SERVICE_PREF,
    data
  };
};

export const selectKids = (data) => {
  console.log(data)
  return {
    type: API_CONST.N_SELECT_KIDS,
    data
  };
};

export const getBrands = () => {

  return {
    type: API_CONST.N_GET_BRANDS_LIST,
  };
};

export const getNewBrandList = () => {

  return {
    type: API_CONST.N_NEW_GET_BRANDS_LIST,
  };
};

export const selectWhoWillDecide = (data) => {

  return {
    type: API_CONST.N_SELECT_WHO_WILL_DECIDE,
    data
  };
};

export const getSizes = () => {

  return {
    type: API_CONST.N_GET_SIZES,
  };
};

export const getNewSizes = () => {

  return {
    type: API_CONST.N_NEW_GET_SIZES,
  };
};

export const sendSizeAndProportion = (data) => {

  return {
    type: API_CONST.N_SELECT_SIZE_AND_PROPORTION,
    data
  };
};

export const sendBrandsData = (data) => {

  return {
    type: API_CONST.N_SEND_BRANDS_DATA,
    data
  };
};

export const userDOBSignUp = (data) => {
  return {
    type: API_CONST.N_DOB_SELECT,
    data
  };
};


export const pregnancyDOBSignUp = (data) => {
  return {
    type: API_CONST.N_DUEDATE_SELECT,
    data
  };
};
export const getStyleList = (data) => {
  return {
    type: API_CONST.N_GET_STYLE_LIST,
    data
  };
};



export const getStyleListNew = (data) => {
  return {
    type: API_CONST.N_GET_STYLE_LIST_NEW,
    data
  };
};

export const sendFeedback = (data) => {
  return {
    type: API_CONST.N_SEND_FEEDBACK,
    data
  };
};

export const getKidsBoxList = (data) => {
  return {
    type: API_CONST.N_GET_BOX_STYLE_LIST,
    data
  };
};
export const makePayment = (data) => {
  return {
    type: API_CONST.N_MAKE_PAYMENT,
    data
  };
};

export const getProfile = (id, token) => {
  return {
    type: API_CONST.GET_PROFILE_DATA,
    id,
    token
  };
};

export const getLastBox = (data) => {
  return {
    type: API_CONST.GET_LAST_BOX_DATA,
    data
  };
};

export const updateUserAvtar = (data) => {
  console.log(data)
  return {
    type: API_CONST.UPDATE_AVATAR,
    data
  };
};


//sourabh

export const billingSignup = (data) => {
  console.log(data)
  return {
    type: API_CONST.N_BILLING_INFO_SELECT,
    data
  };
};

export const billingshipmentSignup = (data) => {
  console.log(data)
  return {
    type: API_CONST.N_BILLING_SHIPPING_INFO_SELECT,
    data
  };
};


export const styleSignup = (data) => {
  console.log(data)
  return {
    type: API_CONST.N_STYLE_INFO_SELECT,
    data
  };
};



export const styleSignupNew = (data, token) => {
  console.log(data)
  return {
    type: API_CONST.N_STYLE_INFO_SELECT_NEW,
    token,
    data
  };
};



export const checkSignup = (data) => {
  console.log(data)
  return {
    type: API_CONST.N_CHECK_INFO_SELECT,
    data
  };
};

export const verifyEmailAddress = (data) => {
  console.log(data)
  return {
    type: API_CONST.N_VERIFY_EMAIL,
    data
  };
};

export const verifyEmailAddressGift = (data) => {
  console.log(data)
  return {
    type: API_CONST.N_VERIFY_EMAIL_GIFT,
    data
  };
};


export const addRefrel = (token, data) => {
  console.log(data)
  return {
    type: API_CONST.N_ADD_REFREL,
    token,
    data
  };
};



export const getReferralList = (token, data) => {
  console.log(data)
  return {
    type: API_CONST.N_GET_REFREL,
    token,
    data
  };
};


export const sendSocialInfo = (data) => {
  console.log(data)
  return {
    type: API_CONST.N_SOCIAL_INFO,
    data
  };
};


export const deleteKid = (data, token) => {
  console.log(data)
  return {
    type: API_CONST.N_DELETE_KID,
    token,
    data
  };
};

export const getListKid = (data, token) => {
  console.log(data)
  return {
    type: API_CONST.N_KID_LIST,
    token,
    data
  };
};

export const updateKidAvatar = (data, token) => {
  console.log(data)
  return {
    type: API_CONST.N_KID_AVATAR,
    token,
    data
  };
};

export const checkReferral = (data) => {
  console.log(data)
  return {
    type: API_CONST.N_CHECK_REFERRAL,
    data
  };
};


///change for UPadte
export const _getProfile = (data, token) => {
  console.log(data)
  return {
    type: API_CONST._GET_PROFILE_DATA,
    data,
    token
  };
}


export const updateAddress = (data) => {
  console.log(data)
  return {
    type: API_CONST.UPDATE_ADDRESS,
    data
  };
}


export const getOrderHistory = (data) => {
  return {
    type: API_CONST.N_ORDER_HISTORY,
    data
  };
};

export const checkout = (data) => {
  console.log(data)
  return {
    type: API_CONST.N_CHECK_OUT,
    data
  };
};

export const forgotPassword = (data) => {
  console.log(data)
  return {
    type: API_CONST.N_FORGOT_PASSWORD,
    data
  };
};


export const updateKid = (data, token) => {
  console.log("=== TOKEN ===", token)
  console.log("=== POST DATA ===", JSON.stringify(data))

  return {
    type: API_CONST.N_UPDATE_KID,
    data,
    token
  };
};


export const giftPayment = (data) => {
  return {
    type: API_CONST.N_GIFT_PAYMENT,
    data
  };
};

export const giftCustomerwhileLogin = (data, token) => {
  return {
    type: API_CONST.N_GIFT_AFTER_LOGIN,
    data,
    token
  };
};

export const activeUsersubscription = (data, token) => {
  return {
    type: API_CONST.N_ACTIVE_SUBSCRIPTION,
    data,
    token
  };
};


export const cancelUsersubscription = (data, token) => {
  return {
    type: API_CONST.N_CANCLE_SUBSCRIPTION,
    data,
    token
  };
};

export const changePassword = (data, token) => {
  return {
    type: API_CONST.N_CHANGE_PASSWORD,
    data,
    token
  };
};

export const getCreditList = (data, token) => {
  return {
    type: API_CONST.N_GET_CREDIT_LIST,
    data,
    token
  };
};


export const logOutUser = (data, token) => {
  return {
    type: API_CONST.N_LOGOUT,
    data,
    token
  };
};


export const getSizeSwapList = (data, token) => {
  return {
    type: API_CONST.N_SIZE_SWAP,
    data,
    token
  };
};


export const getRedeemAmount = (data, token) => {
  return {
    type: API_CONST.N_REDEEM_AMOUNT,
    data,
    token
  };
};


export const getUserRedeemPrice = (data, token) => {
  return {
    type: API_CONST.N_USER_REDEEM_POINTS,
    data,
    token
  };
};

export const resetProfilePic = () => {
  return {
    type: ACTION_TYPES.N_USER_RESET_PROFILE_PIC
  }
};

export const resetUserData = () => {
  return {
    type: ACTION_TYPES.CLEAR_DATA
  }
};


export const resetForgotPassword = () => {
  return {
    type: ACTION_TYPES.CLEAR_FORGOT_PASSWORD
  }
};

export const updateBoxFreq = (data, token) => {
  return {
    type: API_CONST.N_UPDATE_B0X_FREQ,
    data,
    token
  };
};


export const requestBox = (data, token) => {
  return {
    type: API_CONST.N_REQUEST_BOX,
    data,
    token
  };
};



export const updateUserProfile = (data, token) => {
  console.log("=== TOKEN ===", token)
  console.log("=== POST DATA ===", JSON.stringify(data))

  return {
    type: API_CONST.N_UPDATE_USER_PROFILE,
    data,
    token
  };
};

export const clearGetProfileResponse = () => {
  return {
    type: ACTION_TYPES.CLEAR_GET_PROFILE_RESPONSE
  }
};

export const clearUpdateProfileResponse = () => {
  return {
    type: ACTION_TYPES.CLEAR_UPDATE_PROFILE_RESPONSE
  }
};

export const resetSignUpData = () => {
  return {
    type: ACTION_TYPES.SIGNUP_CLEAR_DATA
  }
};


export const getAllPropertyList = (data, token) => {
  console.log(data)
  return {
    type: API_CONST.N_GET_ALL_PROPERTY_LIST,
    token,
    data
  };
};

export const getSavedPropertyList = (data, token) => {
  console.log(data)
  return { 
    type: API_CONST.N_GET_SAVED_PROPERTY_LIST,
     token,
      data 
  };
};


export const getFilteredPropertyList = (data, token) => {
  console.log(data)
  return {
    type: API_CONST.N_GET_FILTERED_PROPERTY_LIST,
    token,
    data
  };
};

export const getPropertyDetail = (propertyId, token) => {
  return {
    type: API_CONST.N_GET_PROPERTY_DETAIL,
    token,
    propertyId
  };
};

export const clearPropertyListResponse = () => {
  return {
    type: API_CONST.N_RESET_PROPERTY_LIST_RESPONSE,
  };
};


export const serachCriteria = (data) => {
  return {
    type: API_CONST.N_SEARCH_CRITERIA,
    data
  };
};

export const clearSearchCriteria = () => {
  return {
    type: API_CONST.N_CLEAR_SEARCH_CRITERIA,
  };
};


//Contacts

export const getAcceptedContactList = (data, token) => {
  console.log("Action Data >>> "+data)
  return {
    type: API_CONST.N_GET_ACCEEPTED_CONTACT_LIST,
    token,
    data
  };
};

export const getPendingContactList = (data, token) => {
  console.log("Action Data >>> " + data)
  return {
    type: API_CONST.N_GET_PENDING_CONTACT_LIST,
    token,
    data
  };
};

export const getRejectedContactList = (data, token) => {
  console.log("Action Data >>> " + data)
  return {
    type: API_CONST.N_GET_REJECTED_CONTACT_LIST,
    token,
    data
  };
};



//Inspection
export const sendInspectionRequest = (data, token) => {
  console.log("Action Data >>> " + data)
  return {
    type: API_CONST.N_POST_INSEPECTON_REQUEST,
    token,
    data
  };
};

export const bookInspectionTimeSlot = (data, token) => {
  console.log(" bookInspectionTimeSlot Action Data >>> " + JSON.stringify(data));
  return {
    type: API_CONST.N_POST_BOOK_INSEPECTON_TIME_SLOT_REQUEST,
    token,
    data
  };
};

export const getUpcomingInspection = (data, token) => {
  console.log("Action Data >>> " + data)
  return {
    type: API_CONST.N_GET_UPCOMING_INSPECTION_LIST,
    token,
    data
  };
};

export const getPendingInspections = (data, token) => {
  console.log("Action Data >>> " + data)
  return {
    type: API_CONST.N_GET_PENDING_INSPECTION_LIST,
    token,
    data
  };
};

export const getDeclinedInspections = (data, token) => {
  console.log("Action Data >>> " + data)
  return {
    type: API_CONST.N_GET_DECLINED_INSPECTION_LIST,
    token,
    data
  };
};


//Settings
export const getNotificationSetting = (data, token) => {
  console.log("Action Data >>> " + data)
  return {
    type: API_CONST.N_GET_NOTIFICATION_SETTING,
    token,
    data
  };
};



//Knowledge Base List
export const getKnowledgeBaseList = (data, token) => {
  console.log("Action Data >>> " + data)
  return {
    type: API_CONST.N_GET_KNOWLEDGE_BASE_LIST,
    token,
    data
  };
};

//Knowledge Details Page
export const getKnowledgeDetail = (data, token) => {
  console.log("Action Data >>> " + data)
  return {
    type: API_CONST.N_GET_KNOWLEDGE_DETAIL,
    token,
    data
  };
};



//Service Base List
export const getServiceList = (data, token) => {
  console.log("Action Data >>> " + data)
  return {
    type: API_CONST.N_GET_SERVICE_LIST,
    token,
    data
  };
};




//Get Notification List
export const getNotificationList = (data, token) => {
  console.log("Action Data >>> " + data)
  return {
    type: API_CONST.N_GET_NOTIFICATION_LIST,
    token,
    data
  };
};


//Get Payment Report List
export const getPaymentReportList = (data, token) => {
  console.log("Action Data >>> " + data)
  return {
    type: API_CONST.N_GET_PAYMENT_REPORT_LIST,
    token,
    data
  };
};

//Get Chat History
export const getChatHistory = (data, token) => {
  console.log("Action Data >>> " + data)
  return {
    type: API_CONST.N_GET_CHAT_HISTORY,
    token,
    data
  };
};

