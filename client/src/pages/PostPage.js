import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";
import Comments from "../Comments";

export default function PostPage() {
  const [comment, setComment] = useState("");
  const [postInfo, setPostInfo] = useState(null);
  const [commentInfo, setCommentInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  const username = userInfo.username;

  useEffect(() => {
    const fetchPostInfo = async () => {
      try {
        const postResponse = await fetch(`http://localhost:4000/post/${id}`);
        const postInfo = await postResponse.json();
        setPostInfo(postInfo);

        const commentResponse = await fetch(
          `http://localhost:4000/post/${id}/comment`
        );
        const commentInfo = await commentResponse.json();
        setCommentInfo(commentInfo);
        console.log(commentInfo);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPostInfo();
  }, [id]);

  async function handleComment(ev) {
    ev.preventDefault();
    const response = await fetch(`http://localhost:4000/post/${id}/comment`, {
      method: "POST",
      body: JSON.stringify({ comment, username, id }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok === false) {
      alert("comment failed.");
    } else {
      alert("comment has been created.");
    }
  }

  if (!postInfo) return "";

  return (
    <>
      <div className="post-page">
        <h1>{postInfo.title}</h1>
        <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
        <div className="author">by @{postInfo.author.username}</div>
        {userInfo.id === postInfo.author._id && (
          <div className="edit-row">
            <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
              Edit this post
            </Link>
          </div>
        )}
        <div className="image">
          <img src={`http://localhost:4000/${postInfo.cover}`} alt="" />
        </div>
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: postInfo.content }}
        />
      </div>
      <div className="comment-section">
      <div>
      <h2>Comments:</h2>
      <ul>
        {commentInfo && commentInfo.map((comment) => (
          <li key={comment._id}>
            <p>
              <strong>{comment.username}: </strong>
              {comment.comment}
            </p>
            <p>Created at: {new Date(comment.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
        <form className="add-comment" onSubmit={handleComment}>
          <label>
            <span>Add new comment:</span>
            <textarea
              onChange={(ev) => setComment(ev.target.value)}
              value={comment}
            ></textarea>
          </label>
          <button className="btn">Add Comment</button>
        </form>
      </div>
    </>
  );
}
