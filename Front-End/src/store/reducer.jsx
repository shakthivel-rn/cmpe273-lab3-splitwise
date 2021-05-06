/* eslint-disable no-underscore-dangle */
const initialState = {
  id: '',
  name: '',
  totalAmounts: {},
  settleUpUserNames: [],
  joinedGroups: [],
  invitedGroups: [],
  groupData: [],
  expenseDetails: [],
  comments: [],
  recentActivity: [],
  refreshBit: false,
  refreshBitYouOwe: false,
  refreshBitProfileImage: false,
};

const reducer = (state = initialState, action) => {
  if (action.type === 'REGISTER_USER') {
    return {
      ...state,
      id: action.value._id,
      name: action.value.name,
    };
  }
  if (action.type === 'RENDER') {
    return {
      ...state,
      refreshBit: action.value.modifiedRefreshBitLocal,
    };
  }
  if (action.type === 'RENDER_YOU_OWE') {
    return {
      ...state,
      refreshBitYouOwe: action.value.modifiedRefreshBitLocal,
    };
  }
  if (action.type === 'RENDER_PROFILE_IMAGE') {
    return {
      ...state,
      refreshBitProfileImage: action.value.modifiedRefreshBitLocal,
    };
  }
  if (action.type === 'GET_TOTAL_AMOUNT') {
    return {
      ...state,
      totalAmounts: action.value,
    };
  }
  if (action.type === 'GET_SETTLE_UP_USERNAMES') {
    return {
      ...state,
      settleUpUserNames: [...action.value],
    };
  }
  if (action.type === 'GET_JOINED_GROUPS') {
    return {
      ...state,
      joinedGroups: [...action.value],
    };
  }
  if (action.type === 'GET_INVITED_GROUPS') {
    return {
      ...state,
      invitedGroups: [...action.value],
    };
  }
  if (action.type === 'GET_GROUP_DATA') {
    return {
      ...state,
      groupData: [...action.value],
    };
  }
  if (action.type === 'GET_EXPENSE_DETAILS') {
    return {
      ...state,
      expenseDetails: [...action.value],
    };
  }
  if (action.type === 'GET_COMMENTS') {
    return {
      ...state,
      comments: [...action.value],
    };
  }
  if (action.type === 'GET_RECENT_ACTIVITY') {
    return {
      ...state,
      recentActivity: [...action.value],
    };
  }
  if (action.type === 'REMOVE_USER') {
    return {};
  }
  return state;
};

export default reducer;
