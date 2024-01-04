import { useDispatch, useSelector } from "react-redux"
import { Link } from 'react-router-dom'
import { PostAuthor } from "./PostAuthor"
import { TimeAgo } from "./TimeAgo"
import { ReactionButtons } from "./ReactionButtons"
import { fetchPosts, selectAllPosts } from "./postsSlice"
import { useEffect } from "react"
import { Spinner } from "../../components/Spinner"
import { serverStatus } from "../../consts"

const PostsList = () => {
    const dispatch = useDispatch()
    const posts = useSelector(selectAllPosts)
    const postStatus = useSelector(state => state.posts.status)
    const error = useSelector(state => state.posts.error)
    let content

    const PostExcerpt = ({ post }) => (
        <article className="post-excerpt" key={post.id}>
            <h3>{post.title}</h3>
            <PostAuthor userId={post.user} />
            <TimeAgo timestamp={post.date} />
            <p className="post-content">{post.content.substring(0, 100)}</p>
            <ReactionButtons post={post} />
            <Link to={`/posts/${post.id}`} className="button muted-button">
                View Post
            </Link>
        </article>
    )

    if (postStatus === serverStatus.loading) content = <Spinner text="Loading" />
    else if (postStatus === serverStatus.failed) content = <div>{error}</div>
    else if (postStatus === serverStatus.succeeded) {
        const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
        const renderPosts = orderedPosts.map(post => <PostExcerpt key={post.id} post={post} />)
        content = renderPosts
    }

    return (
        <section>
            <h2>Posts</h2>
            {content}
        </section>
    )
}

export default PostsList