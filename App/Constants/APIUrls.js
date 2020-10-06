//Production URL
const BASE_URL = "http://13.238.107.123:5002/";
const FRONT_IMAGE_URL =
  "https://s3-ap-southeast-2.amazonaws.com/ptlocal/profile/";

//Local URL - Mahesh
//const BASE_URL = "http://172.10.20.180:5002/";

//Local URL - Dinesh
// const BASE_URL = "http://172.10.28.88:5002/";

// Local URL - Rahul
// const BASE_URL = "http://172.10.21.162:5002/";

//Local URL - Homewati
//const BASE_URL = "http://172.10.28.89:5002/";

//Local URL - Vaishnavi
//const BASE_URL = "http://172.10.65.65:5002/";

const API = {
  //User Authentication
  SIGNUP_USER: BASE_URL + "api/userRegister",
  FORGOT_PASSWORD: BASE_URL + "api/userforgotPassword",
  //LOGIN_USER: BASE_URL + "api/f/userLogin",
  LOGIN_USER: BASE_URL + "api/buyerLogin",
  BUYER_LOGIN: BASE_URL + "buyer-login",
  GET_USER_DETAIL: BASE_URL + "api/getUserDetail",
  GET_BUYER_USER_DETAIL: BASE_URL + "api/getBuyerUserDetail",
  UPDATE_USER_PROFILE: BASE_URL + "api/userUpdate",
  UPLOAD_USER_PROFILE_PIC: BASE_URL + "api/uploadProfilePicture",
  DELETE_USER_PROFILE_PIC: BASE_URL + "api/deleteProfilePicture",
  PROFILE_PIC_URL: "https://s3-ap-southeast-2.amazonaws.com/ptlocal/profile/",
  CHANGE_PASSWORD_REQUEST: BASE_URL + "api/updateSellerPassword",

  PIC_URL: "https://s3-ap-southeast-2.amazonaws.com/ptlocal",

  //AWS
  AWS_PATH: "https://s3-ap-southeast-2.amazonaws.com/",
  AWS_BUCKET: "ptlocal",
  DEFAULT_IMAGE_URL: "http://13.238.107.123:5001/",
  PDF_URL: "https://s3-ap-southeast-2.amazonaws.com/ptlocal",

  //Property
  //GET_ALL_PROPERTY_LIST: BASE_URL + "api/getAllPropertyList",
  GET_ALL_PROPERTY_LIST: BASE_URL + "api/getAllMobilePropertyList",
  GET_PROPERTY_BY_ID: BASE_URL + "api/getPropertyByIdForBuyer",
  POST_BUYER_PAYMENT: BASE_URL + "api/buyerPayment",

  //Save Property
  BOOKMARK_PROPERTY_BY_ID: BASE_URL + "api/bookmarkProperty",
  GET_BOOKMARK_PROPERTY_LIST: BASE_URL + "api/GetBookmarkProperty",

  //Contact
  SEND_CONTACT_REQUEST: BASE_URL + "api/sendContactRequest",
  GET_BUYER_CONTACT_LIST: BASE_URL + "api/getBuyerContactList",
  SEND_NOTIFICATION_SETTING_REQUEST: BASE_URL + "api/notificationSettings",
  REMOVE_CONTACT_BUYER: BASE_URL + "api/removeContactByBuyer",

  //Inspection
  SEND_INSPECTION_REQUEST: BASE_URL + "api/createInspectionFrom",
  GET_INSPECTION_TIME_SLOTS: BASE_URL + "api/getTimeSlots",
  BOOK_INSPECTION_TIME_SLOT: BASE_URL + "api/bookTimeSlotByBuyer",
  GET_INSPECTION_LIST: BASE_URL + "api/getBuyerInspectionList",
  CANCEL_BOOKING_SLOT: BASE_URL + "api/cancelBooking",

  //Suburb Report
  SEND_PAYMENT_REQUEST: BASE_URL + "api/purchaseSuburbReportForBuyer",
  SEND_SUBURB_PAYMENT_REQUEST:
    BASE_URL + "api/purchasePostalSuburbReportForBuyer",

  //Feedback
  SEND_FEEDBACK_TO_SERVER: BASE_URL + "api/feedback",

  //Setting
  SEND_NOTIFICATION_SETTING_REQUEST: BASE_URL + "api/notificationSettings",

  //Setting
  GET_SUBURB_REPORT: BASE_URL + "api/searchSuburbReportBuyer",

  GET_NOTIFICATION_SETTING_REQUEST:
    BASE_URL + "api/getNotificationSettingBuyerId",

  //Knowledge
  GET_KNOWLEDGE_LIST: BASE_URL + "api/getKnowledgeBaseList",
  GET_KNOWLEDGE_BASE_BY_ID: BASE_URL + "api/knowledgeBaseById",

  //Knowledge
  GET_SERVICE_LIST: BASE_URL + "api/getServiceProviderList",

  //Knowledge Detail
  GET_KNOWLEDGE_PAGE: "http://13.238.107.123:5001/knowledge-centre-detail",

  //BUYERLOGIN
  BUYER_LOGIN: "http://13.238.107.123:5001/buyer-login",

  //DIGITAL ID VERIFICATION URL
  DIGITAL_ID_VERIFICATION_URL: "http://13.238.107.123:5001/digital-id-verify/",

  //Notification List
  GET_NOTIFICATION_LIST: BASE_URL + "api/getNotificationListByBuyer",

  //GET_PAYMENT_REPORT
  GET_PAYMENT_REPORT_LIST: BASE_URL + "api/getPaymentReportList",

  //UPLOAD ATTACHMENT
  UPLOAD_ATTACHMENT: BASE_URL + "api/uploadChatAttachmentByBuyer",

  //UPLOAD DOCUMENT
  UPLOAD_ATTACHMENT: BASE_URL + "api/docUpload",

  //GET CHAT HISTORY
  GET_CHAT_HISTORY: BASE_URL + "api/oneToOneMobileChatHistory",

  SIGNUP_USER_FB: BASE_URL + "api/facebook_signup",
  BRANDS_LIST: BASE_URL + "api/getBrand",
  GET_SIZES: BASE_URL + "api/getSize",
  GET_STYLE_LIST: BASE_URL + "api/getStyle",
  GET_STYLE_BOX_LIST: BASE_URL + "api/getcustomerlastorder",
  IMAGE_BASE_USR: BASE_URL,

  LOGIN_USER_FB: BASE_URL + "api/loginViaFB",

  GET_PROFILE_PIC: FRONT_IMAGE_URL + "assets/images/",

  GET_PROFILE: BASE_URL + "api/getUserDetail",
  GET_LAST_BOX: BASE_URL + "api/getLastbox/",
  UPDATE_AVATAR: BASE_URL + "api/updateUserAvtar",
  CARD_CHECK: BASE_URL + "api/verifycard",
  VERIFY_EMAIL: BASE_URL + "api/userExist",
  ADD_REFREL: BASE_URL + "api/addReferral",
  GET_REFREL: BASE_URL + "api/getReferralList",
  CHECK_REFERRAL_CODE: BASE_URL + "api/checkReferralCode",

  ADD_CHILD: BASE_URL + "api/addKid",
  REMOVE_KID: BASE_URL + "api/removeKid",
  KID_LIST: BASE_URL + "api/listKid/",
  UPDATE_KID_AVATAR: BASE_URL + "api/updateKidsAvatar",
  UPDATE_SHIP_AND_BILLADDRESS: BASE_URL + "api/updateShipAndBillAddress",
  ORDER_HISTORY: BASE_URL + "api/getOrderhistory/",
  CHECKOUT: BASE_URL + "api/checkoutOrder",

  UPDATE_KID: BASE_URL + "api/updateKid",
  GIFT_API: BASE_URL + "api/giftCustomer",
  GIFT_API_AFTER_LOGIN: BASE_URL + "api/giftCustomerwhileLogin",

  ACTIVE_SUBSCRIPTION: BASE_URL + "api/activeUsersubscription/",
  CANCLE_SUBSCRIPTION: BASE_URL + "api/cancelUsersubscription/",
  CHANGE_PASSWORD: BASE_URL + "api/setPassword/",
  GET_CREDIT_LIST: BASE_URL + "api/getCreditList/",
  LOGOUT_USER: BASE_URL + "api/logout/",
  SIZE_SWAP: BASE_URL + "api/getsizeSwap",
  REDEEM_AMOUNT: BASE_URL + "api/getRedeemAmount/",
  UPDATE_PROFILE: BASE_URL + "api/updateprofile",
  REQUEST_BOX: BASE_URL + "api/request_Box"
};

export default API;
