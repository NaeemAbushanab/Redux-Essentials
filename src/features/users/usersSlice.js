import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { client } from "../../api/client"
import { serverStatus } from "../../consts"
const initialState = {
    data: [],
    status: serverStatus.idle,
    error: null
}

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {

    },
    extraReducers(bulider) {
        bulider.addCase(fetchUsers.pending, (state, action) => {
            state.status = serverStatus.loading
        }).addCase(fetchUsers.fulfilled, (state, action) => {
            state.status = serverStatus.succeeded
            state.data = action.payload
        }).addCase(fetchUsers.rejected, (state, action) => {
            state.status = serverStatus.failed
            state.error = action.error.message
        })
    }
})

const selectAllUsers = state => state.users.data
const selectUserById = (userId) => state => state.users.data.find(user => user.id === userId)

const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
    const response = await client.get("/fakeApi/users")
    return response.data
})

export default usersSlice.reducer
export { selectAllUsers, selectUserById, fetchUsers }