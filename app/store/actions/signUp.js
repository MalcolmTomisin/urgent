import {SIGN_UP, SIGN_IN} from '../types';

export const setSignUpName = (payload) => ({
  action: SIGN_UP,
  payload,
});

export const setSignInToken = (payload) => ({
  action: SIGN_IN,
  payload,
});
