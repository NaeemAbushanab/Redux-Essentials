import { useSelector } from "react-redux"
import { selectUserById } from "../users/usersSlice"

const PostAuthor = ({ userId }) => {
    const author = useSelector(selectUserById(userId))

    return <span>by {author ? author.name : 'Unknown author'}</span>
}
export { PostAuthor }