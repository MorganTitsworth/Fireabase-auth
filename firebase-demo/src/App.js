import logo from "./logo.svg";
import "./App.css";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./api/firebase-config";
import { useState, useEffect } from "react";
import PostComponent from "./components/Post";
import { useAuth } from "./providers/AuthProvider";
function App() {
  const { user, signIn, signOut } = useAuth();
  const [post, setPosts] = useState([]);
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
        createAt: new Date(),
        photo: user.photoURL,
        username: user.displayName,
        user: user.uid
      });
      console.log("doc is written to DB: ", docRef.id, docRef);
    } catch (e) {
      console.error("Error adding post: ", e);
    }
  }

  useEffect(() => {
    getPosts().then((posts) => setPosts(posts));
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        {user ? (
          <div>
            <button onClick={signOut}>Sign OUT</button>
            {user.displayName}
            <div>
              <form
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
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
          </div>
        ) : (
          <div>
            <button onClick={signIn}>Sign IN</button>
            Sign In!
          </div>
        )}

        {post.length > 0
          ? post.map((post) => <PostComponent key={post.id} post={post} />)
          : null}
      </header>
    </div>
  );
}

export default App;
