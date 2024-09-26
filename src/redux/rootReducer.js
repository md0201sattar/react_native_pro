import {combineReducers} from 'redux';
import loginUserReducer from '../modules/loginUser';
import googleUserReducer from '../modules/googleLogin';
import getCountryReducer from '../modules/getCountry';
import getPopertiesReducer from '../modules/getPoperties';
import getFavoritePropertiesReducer from '../modules/getFavoriteProperties';
import getTrashReducer from '../modules/getTrash';
import getProfileReducer from '../modules/getProfile';
import postRatingReducer from '../modules/postRating';
import postUpdateRatingReducer from '../modules/postUpdateRating';
import getPopertiesDetailsReducer from '../modules/getPopertiesDetails';
import registerReducer from '../modules/register';
import emailCheckReducer from '../modules/emailCheck';
import forgotPasswordReducer from '../modules/forgotPassword';
import getSavedSearchReducer from '../modules/getSavedSearch';
import deleteSearchReducer from '../modules/deleteSearch';
import getAgentReducer from '../modules/getAgent';
import getFilterReducer from '../modules/getFilter';
import getNearByReducer from '../modules/getNearBy';

import makeOfferReducer from '../modules/makeOffer';
import addFavoriteReducer from '../modules/addToFavorite';
import addRemoveTrash from '../modules/addRemoveTrash';
import getMoreFilter from '../modules/getMoreFilter';
import schoolChatReducer from '../modules/schoolChat';
import filterSearch from '../modules/filterSearch';
import clearFilter from '../modules/clearFilter';
import loginPhoneUser from '../modules/phonelogin';
import verifyOTP from '../modules/verifyOTP';
import getRewardListing from '../modules/getRewardListing';
import likeDisLike from '../modules/likeDislike';
import getLeaderboard from '../modules/getLeaderboard';
import getUserScore from '../modules/getUserScore';
import propertyChatList from '../modules/propertyChats';
import sendMessage from '../modules/sendMessage';
import isRead from '../modules/isRead';
import logOut from '../modules/logOut';
import getNotifications from '../modules/getNotifications';
import sortingFavoritelist from '../modules/sortingFavoritelist';
import HandleNotification from '../modules/HandleNotification';

export default combineReducers({
  loginUserReducer,
  getCountryReducer,
  getPopertiesReducer,
  getFavoritePropertiesReducer,
  getTrashReducer,
  getProfileReducer,
  postRatingReducer,
  postUpdateRatingReducer,
  getPopertiesDetailsReducer,
  registerReducer,
  emailCheckReducer,
  forgotPasswordReducer,
  getSavedSearchReducer,
  deleteSearchReducer,
  getAgentReducer,
  getFilterReducer,
  getNearByReducer,
  googleUserReducer,
  schoolChatReducer,

  makeOfferReducer,
  addFavoriteReducer,
  addRemoveTrash,
  getMoreFilter,
  filterSearch,
  clearFilter,
  loginPhoneUser,
  verifyOTP,
  getRewardListing,
  likeDisLike,
  getLeaderboard,
  getUserScore,
  sendMessage,
  propertyChatList,
  isRead,
  logOut,
  getNotifications,
  sortingFavoritelist,
  HandleNotification,
});
