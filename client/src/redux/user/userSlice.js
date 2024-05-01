import { createSlice } from "@reduxjs/toolkit";

const initialState={
    currentUser:null,
    error:null,
    loading:false
}

const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart:(state)=>{
            state.loading=true;
        },
        signInSuccess:(state,action)=>{
            state.currentUser=action.payload;
            state.error=null;
            state.loading=false
        },
        signInFailure:(state,action)=>{
            state.error=action.payload;
            state.loading=false;
            // state.currentUser=null;

        },
        updateUserStart:(state)=>{
            state.loading=true;
        },
        updateUserSuccess:(state,action)=>{
            state.currentUser=action.payload;
            state.error=null;
            state.loading=false
        },
        updateUserFailure:(state,action)=>{
            state.error=action.payload;
            state.loading=false;
            // state.currentUser=null;

        },
        deleteUserStart:(state)=>{
            state.loading=true;
        },
        deleteUserSuccess:(state,action)=>{
            state.currentUser=null;
            state.error=null;
            state.loading=false
        },
        deleteUserFailure:(state,action)=>{
            state.error=action.payload;
            state.loading=false;
            // state.currentUser=null;

        },
        signoutUserStart:(state)=>{
            state.loading=true;
        },
        signoutUserSuccess:(state,action)=>{
            state.currentUser=null;
            state.error=null;
            state.loading=false
        },
        signoutUserFailure:(state,action)=>{
            state.error=action.payload;
            state.loading=false;
            // state.currentUser=null;

        },

    }
});
export const{signInStart,signInFailure,signInSuccess,updateUserStart,updateUserSuccess,updateUserFailure,deleteUserStart,deleteUserSuccess,deleteUserFailure,signoutUserFailure,signoutUserStart,signoutUserSuccess} = userSlice.actions;
export default userSlice.reducer;