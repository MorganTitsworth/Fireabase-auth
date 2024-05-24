import { useState } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../api/firebase-config";
import { useAuth } from "../providers/AuthProviders.js";

export default function PostElement(post) {
  const { user } = useAuth();
  let [isEditing, setIsEditing] = useState(false);
  let [updateData, setUpdateData] = useState({ title: "", content: "" });
  const postData = post.post;

  async function updatePosts(id) {
    try {
      await updateDoc(doc(db, "posts", id), {
        ...updateData,
      });
      setIsEditing(!isEditing);
    } catch (err) {
      console.log(err);
    }
  }

  async function deletePost(id) {
    try {
      await deleteDoc(doc(db, "posts", id));
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div key={postData.id}>
      {!isEditing ? (
        <>
          {postData.user === user.uid ? (
            <>
              <button onClick={() => setIsEditing(!isEditing)}>Edit</button>
              <button onClick={() => deletePost(postData.id)}>X</button>
            </>
          ) : null}
          <h3>{postData.content}</h3>
          <p>{postData.title}</p>
        </>
      ) : (
        <>
          <>
            <div>
              <button
                onClick={() => {
                  updatePosts(postData.id);
                }}
              >
                Update
              </button>
              <button onClick={() => setIsEditing(!isEditing)}>Cancel</button>
            </div>
            <div>
              <input
                type="text"
                placeholder="Enter updated title"
                value={updateData.title}
                onChange={(e) => {
                  setUpdateData({ ...updateData, title: e.target.value });
                }}
              ></input>
              <input
                type="text"
                placeholder="Enter updated content"
                value={updateData.content}
                onChange={(e) => {
                  setUpdateData({ ...updateData, content: e.target.value });
                }}
              ></input>
            </div>
          </>
        </>
      )}
    </div>
  );
}
