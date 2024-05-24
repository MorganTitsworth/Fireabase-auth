import { useState } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../api/firebase-config";
import { useAuth } from "../providers/AuthProvider";

export default function PostComponent(post) {
  const { user } = useAuth();
  const [newPostData, setNewPostData] = useState({ title: "", content: "" });
  const postData = post.post;

  async function updateDocument(title, content) {
    try {
      await updateDoc(doc(db, "posts", postData.id), "title", title);
      console.log("success!");
    } catch (error) {
      console.error("failure: ", error);
    }
  }

  async function deletePost(id) {
    try {
      await deleteDoc(doc(db, "posts", id));
    } catch (error) {
      console.error(error);
    }
  }

  if (!user) return null;

  return (
    <div style={{ backgroundColor: "black" }}>
      <div>
        {postData.user === user.uid ? (
          <button onClick={() => deletePost(postData.id)}>X</button>
        ) : null}
        <h3>{postData.title}</h3>
        <p>{postData.content}</p>
        <p>{postData.id}</p>
      </div>
      {postData.user === user.uid ? (
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
          onSubmit={(e) => {
            e.preventDefault();
            console.log("newPostData", newPostData);
            updateDocument(newPostData.title, newPostData.content);
          }}
        >
          <input
            type="text"
            placeholder="Title"
            value={newPostData.title}
            onChange={(e) =>
              setNewPostData({ ...newPostData, title: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Content"
            value={newPostData.content}
            onChange={(e) =>
              setNewPostData({ ...newPostData, content: e.target.value })
            }
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              console.log("newPostData", newPostData);
              updateDocument(newPostData.title, newPostData.content);
            }}
          >
            Edit post
          </button>
        </form>
      ) : null}
    </div>
  );
}
