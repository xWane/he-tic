import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@redux/store";
import { UserState } from "@/api/type";

const initialState: UserState = {
  isLogged: false,
  email: null,
  username: null,
  userId: null,
  userRole: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SET_ACTIVE_USER: (state, action: PayloadAction<UserState>) => {
      state.isLogged = true;

      const { userId, username, email, userRole } = action.payload;
      state.email = email;
      state.username = username;
      state.userId = userId;
      state.userRole = userRole;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    RESET_ACTIVE_USER: (state, action: PayloadAction<UserState>) => {
      state.isLogged = false;
      state.email = null;
      state.username = null;
      state.userId = null;
      state.userRole = null;
    },
  },
});

export const { SET_ACTIVE_USER, RESET_ACTIVE_USER } = authSlice.actions;

export const selectUserState = (state: RootState) => state.auth.isLogged;
export const selectUserEmail = (state: RootState) => state.auth.email;
export const selectUserName = (state: RootState) => state.auth.username;
export const selectUserId = (state: RootState) => state.auth.userId;
export const selectUserRole = (state: RootState) => state.auth.userRole;

export default authSlice.reducer;
