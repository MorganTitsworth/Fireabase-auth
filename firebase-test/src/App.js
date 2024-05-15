import logo from "./logo.svg";
import "./App.css";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./api/firebase-config";
import { useEffect, useState } from "react";
import { useAuth } from "./providers/AuthProvider.js";
function App() {
  const { user, signIn, signOut } = useAuth();
  const [posts, setPosts] = useState([]);
  const [postData, setPostData] = useState({ title: "", content: "" });
  async function getPosts() {
    try {
      const querySnapshot = await getDocs(collection(db, "posts"));
      const posts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return posts;
    } catch (e) {
      console.error("Error getting posts: ", e);
    }
  }

  async function addPost(title, content) {
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        title: title,
        content: content,
        createdAt: new Date(),
        photo: user.photoURL,
        uid: user.uid,
        name: user.displayName,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  async function deletePost(id) {
    try {
      await deleteDoc(doc(db, "posts", id));
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getPosts().then((posts) => setPosts(posts));
  }, []);

  return (
    <div className="App">
      {user ? (
        <header className="App-header">
          <h1>Welcome, {user.displayName}</h1>
          <button onClick={signOut}>Sign Out</button>
          {posts.map((post) => (
            <div key={post.id}>
              <div>
                {user.uid === post.uid && <button onClick={() => deletePost(post.id)}>Delete post</button>}
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <p>by: {post.name}</p>
                <p>postID: {post.id}</p>
              </div>
            </div>
          ))}
          <div>
            <form
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
              onSubmit={(e) => {
                e.preventDefault();
                addPost(postData.title, postData.content);
              }}
            >
              <input
                type="text"
                placeholder="Title"
                value={postData.title}
                onChange={(e) =>
                  setPostData({ ...postData, title: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Content"
                value={postData.content}
                onChange={(e) =>
                  setPostData({ ...postData, content: e.target.value })
                }
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  addPost(postData.title, postData.content);
                }}
              >
                Add Post
              </button>
            </form>
          </div>
        </header>
      ) : (
        <button onClick={signIn}>Sign In</button>
      )}
    </div>
  );
}

export default App;
