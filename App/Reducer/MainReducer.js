import { combineReducers } from 'redux';
import SignInReducer from "../Components/SignInComponent/SignInReducer";
import SignUpReducer from "../Components/SignInComponent/SignUpReducer";
import ForgotPasswordReducer from "../Components/SignInComponent/ForgotPasswordReducer";
import ProfileReducer from "../Components/ProfileComponent/ProfileReducer";
import PropertyListingReducer from "../Components/PropertyListingComponent/PropertyListingReducer";
import PropertyDetailReducer from "../Components/PropertyDetailsComponent/PropertyDetailReducer";

//Contacts
import ContactReducer from "../Components/ContactComponent/ContactReducer";

//Inspection

import InspectionReducer from "../Components/InspectionScreenComponent/InspectionReducer";

//Setting
import SettingReducer from "../Components/SettingComponent/SettingReducer";

//Knowledge
import KnowledgeReducer from "../Components/KnowledgeComponent/KnowledgeReducer";

//Knowledge
import ServiceReducer from "../Components/ServiceProviderComponent/ServiceReducer";

//Knowledge
import NotificationListReducer from "../Components/NotificationListComponent/NotificationListReducer";


//Knowledge
import PaymentListReducer from "../Components/PaymentReportListComponent/PaymentReportListReducer";


//Chat History Reducer
import ChatHistoryReducer from "../Components/ChatComponent/ChatReducer";

//Search Suburb Reducer 
import SearchSuburbReducer from "../Components/SearchSuburbReport/SearchSuburbReducer";






export default combineReducers({
  SignInReducer: SignInReducer,
  SignUpReducer: SignUpReducer,
  ForgotPasswordReducer: ForgotPasswordReducer,
  ProfileReducer: ProfileReducer,
  PropertyListingReducer: PropertyListingReducer,
  PropertyDetailReducer: PropertyDetailReducer,
  ContactReducer: ContactReducer,
  InspectionReducer: InspectionReducer,
  SettingReducer: SettingReducer,
  NotificationListReducer: NotificationListReducer,
  KnowledgeReducer: KnowledgeReducer,
  PaymentListReducer: PaymentListReducer,
  ChatHistoryReducer: ChatHistoryReducer,
  SearchSuburbReducer: SearchSuburbReducer,
  ServiceReducer: ServiceReducer
});