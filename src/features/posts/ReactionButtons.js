import React from 'react'
import { useDispatch } from 'react-redux'
import { postReactionCounter } from './postsSlice'

const reactionEmoji = {
    thumbsUp: '👍',
    hooray: '🎉',
    heart: '❤️',
    rocket: '🚀',
    eyes: '👀'
}

export const ReactionButtons = ({ post }) => {

    const dispatch = useDispatch()

    const ReactionButtonClicked = (e) => {
        dispatch(postReactionCounter(e.target.name, post.id))
    }

    const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
        return (
            <button key={name} name={name} type="button" className="muted-button reaction-button" onClick={ReactionButtonClicked}>
                {emoji} {post.reactions[name]}
            </button>
        )
    })

    return <div>{reactionButtons}</div>
}