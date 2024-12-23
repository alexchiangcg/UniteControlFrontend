import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from '../services/userListServices';

interface UserState {
    users: User[];
}

const initialState: UserState = {
    users: [],
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUsers: (state, action: PayloadAction<User[]>) => {
            state.users = action.payload;
        },
    },
});

export const { setUsers } = userSlice.actions;
export default userSlice.reducer;