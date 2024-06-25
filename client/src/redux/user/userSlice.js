import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    penggunaSekarang: null,
    error: null,
    loading: false
}

const penggunaSlice = createSlice({
    name: 'pengguna',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true
            state.error = false
        },
        signInSuccess: (state, action) => {
            state.penggunaSekarang = action.payload
            state.loading = false
            state.error = null
        },
        signInFailure: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        updateUserStart: (state) => {
            state.loading = true
        },
        updateUserSuccess: (state, action) => {
            state.penggunaSekarang = action.payload
            state.loading = false
            state.error = null
        },
        updateUserFailure: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        deleteUserStart: (state) => {
            state.loading = true
        },
        deleteUserSuccess: (state, action) => {
            state.penggunaSekarang = null
            state.loading = false
            state.error = null
        },
        deleteUserFailure: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        signOutStart: (state) => {
            state.loading = true
        },
        signOutSuccess: (state, action) => {
            state.penggunaSekarang = null
            state.loading = false
            state.error = null
        },
        signOutFailure: (state, action) => {
            state.error = action.payload
            state.loading = false
        }
    }
})

export const { signInStart, signInSuccess, signInFailure, updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutStart, signOutSuccess, signOutFailure } = penggunaSlice.actions
export default penggunaSlice.reducer