import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addNewPost, postAdded } from './postsSlice'
import { selectAllUsers } from '../users/usersSlice'
import { serverStatus } from '../../consts'

export const AddPostForm = () => {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [userId, setUserId] = useState("")
    const [addRequestStatus, setAddRequestStatus] = useState(serverStatus.idle)

    const dispatch = useDispatch()
    const users = useSelector(selectAllUsers)

    const canSave = [title, content, userId].every(Boolean) && addRequestStatus === serverStatus.idle

    const onTitleChanged = e => setTitle(e.target.value)
    const onContentChanged = e => setContent(e.target.value)
    const onSavePostSubmit = async (e) => {
        e.preventDefault()
        if (canSave) {
            try {
                setAddRequestStatus(serverStatus.loading)
                await dispatch(addNewPost({ title, content, user: userId })).unwrap()
                setTitle("")
                setContent("")
                setUserId("")
            }
            catch (err) {
                console.log('Failed to save the post: ', err)
            }
            finally {
                setAddRequestStatus('idle')
            }
        }

    }
    const onAuthorChanged = (e) => setUserId(e.target.value)

    const usersOptions = users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)

    return (
        <section>
            <h2>Add a New Post</h2>
            <form onSubmit={onSavePostSubmit}>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChanged}
                />
                <label htmlFor="postAuthor">Author:</label>
                <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
                    <option value="" hidden></option>
                    {usersOptions}
                </select>
                <label htmlFor="postContent">Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                />
                <button type="submit" disabled={!canSave}>Save Post</button>
            </form>
        </section>
    )
}