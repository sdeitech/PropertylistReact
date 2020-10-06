import ACTION_TYPES from '../../Action/ActionTypes';

// Email Or Username TextField Value Change
export const loginUserNameChanged = (text) => {
  return {
    type: ACTION_TYPES.USER_NAME_CHANGED,
    payload: text
  };
};

// Password TextField Value Change
export const loginPasswordChanged = (text) => {
  return {
    type: ACTION_TYPES.PASSWORD_CHANGED,
    payload: text
  }
};




 