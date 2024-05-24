import "./App.css";
import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./api/firebase-config.js";
import { useAuth } from "./providers/AuthProviders.js";
import PostElement from "./components/Post.jsx";

function App() {
  let [post, setPost] = useState([]);
  let [postData, setPostData] = useState({ title: "", content: "" });
  const { user, signIn, signOut } = useAuth();

  useEffect(() => {
    getPosts().then((posts) => setPost(posts));
  }, []);

  async function getPosts() {
    try {
      const query = await getDocs(collection(db, "posts"));
      const posts = query.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return posts;
    } catch (err) {
      console.log(err);
    }
  }

  async function addPost(title, content) {
    try {
      await addDoc(collection(db, "posts"), {
        title: title,
        content: content,
        createdAt: new Date(),
        username: user.displayName,
        user: user.uid,
      });
      setPostData({ title: "", content: "" });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        {user ? (
          <div>
            <p>{user.username}</p>
            <button onClick={signOut}>Sign Out</button>
            <form
              style={{ display: "flex", flexDirection: "column" }}
              onSubmit={(e) => {
                e.preventDefault();
                addPost(postData.title, postData.content);
              }}
            >
              <input
                type="text"
                value={postData.title}
                onChange={(e) =>
                  setPostData({ ...postData, title: e.target.value })
                }
                placeholder="Add new post title here"
              />
              <input
                type="text"
                value={postData.content}
                onChange={(e) =>
                  setPostData({ ...postData, content: e.target.value })
                }
                placeholder="Add new post content here"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  addPost(postData.title, postData.content);
                }}
              >
                Add post
              </button>
            </form>
          </div>
        ) : (
          <button onClick={signIn}>Sign in </button>
        )}
        {user
          ? post.map((item) => <PostElement id={item.id} post={item} />)
          : ""}
      </header>
    </div>
  );
}

export default App;
