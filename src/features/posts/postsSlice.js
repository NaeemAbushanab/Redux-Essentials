import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit"
import { client } from "../../api/client"
import { serverStatus } from "../../consts"

const initialState = {
    data: [],
    status: serverStatus.idle,
    error: null
}

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        postAdded: {
            reducer(state, action) {
                state.data.push(action.payload)
                localStorage.setItem("posts", JSON.stringify(state))
            },
            prepare(title, content, userId) {
                return {
                    payload: {
                        id: nanoid(),
                        title,
                        content,
                        user: userId,
                        date: new Date().toISOString(),
                        reaction: {
                            thumbsUp: 0,
                            hooray: 0,
                            heart: 0,
                            rocket: 0,
                            eyes: 0

                        }
                    }
                }
            }
        },
        postUpdated(state, action) {
            const { id, title, content } = action.payload;
            const existingPost = state.data.find(post => post.id === id)
            if (existingPost) {
                existingPost.title = title
                existingPost.content = content
            }
        },
        postReactionCounter: {
            reducer(state, action) {
                const { emojiName, postId } = action.payload
                const post = state.data.find(_post => _post.id === postId)
                post.reactions[emojiName]++
                localStorage.setItem("posts", JSON.stringify(state))
            },
            prepare(emojiName, postId) {
                return {
                    payload: {
                        emojiName,
                        postId
                    }
                }
            }
        }
    },
    extraReducers(builder) {
        builder.addCase(fetchPosts.pending, (state, action) => {
            state.status = serverStatus.loading
        }).addCase(fetchPosts.fulfilled, (state, action) => {
            state.status = serverStatus.succeeded
            state.data = state.data.concat(action.payload)
        }).addCase(fetchPosts.rejected, (state, action) => {
            state.status = serverStatus.failed
            state.error = action.error.message
        }).addCase(addNewPost.fulfilled, (state, action) => {
            state.data.push(action.payload)
        })
    }
})

const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await client.get('/fakeApi/posts')
    return response.data
})
const addNewPost = createAsyncThunk(
    'posts/addNewPost',
    // The payload creator receives the partial `{title, content, user}` object
    async initialPost => {
        // We send the initial data to the fake API server
        const response = await client.post('/fakeApi/posts', initialPost)
        // The response includes the complete post object, including unique ID
        return response.data
    }
)

const selectAllPosts = state => state.posts.data
const selctPostById = postId => state => state.posts.data.find(post => post.id == postId)

export default postsSlice.reducer
export const { postAdded, postUpdated, postReactionCounter } = postsSlice.actions
export { selectAllPosts, selctPostById, fetchPosts, addNewPost }

