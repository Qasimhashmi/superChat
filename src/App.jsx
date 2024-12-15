import React, { useState, useEffect } from "react";
import { auth, db } from "./firebaseConfig";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  const handleSignOut = () => {
    signOut(auth);
    setUser(null);
  };

  useEffect(() => {
    if (user) {
      const messagesRef = collection(db, "messages");
      const q = query(messagesRef, orderBy("timestamp"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      });
      return () => unsubscribe();
    }
  }, [user]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      try {
        await addDoc(collection(db, "messages"), {
          text: newMessage,
          userId: user.uid,
          userName: user.displayName,
          userProfilePic: user.photoURL,
          timestamp: new Date(),
        });
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message: ", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="loader-div">
        <div className="content">
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {!user ? (
        <div className="login-card">
          <button className="sign-in-button" onClick={handleSignIn}>
            Sign in with Google
          </button>
        </div>
      ) : (
        <div className="chat-container">
          <div className="profile-info">
            <img src={user.photoURL} alt="Profile" className="profile-pic" />
            <button onClick={handleSignOut} className="logout-button">
              Logout
            </button>
          </div>
          <div className="messages">
            {messages.map((message) => (
              <div key={message.id} className="message">
                <img
                  src={message.userProfilePic}
                  alt="Profile"
                  className="message-pic"
                />
                <div className="message-text">
                  <strong>{message.userName}: </strong>
                  <span>{message.text}</span>
                </div>
              </div>
            ))}
          </div>
          <form className="message-form" onSubmit={sendMessage}>
            <input
              type="text"
              className="message-input"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <div>
              {newMessage.trim() ? (
                <button type="submit" className="send-button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 49 49"
                    fill="none"
                  >
                    <path
                      d="M47.8272 1.18024C47.2983 0.653734 46.6348 0.283605 45.9097 0.110527C45.1845 -0.0625513 44.4258 -0.0318785 43.717 0.199174L2.81015 13.878C2.05149 14.119 1.38108 14.5799 0.883604 15.2027C0.386128 15.8254 0.0838966 16.582 0.0150826 17.3768C-0.0537313 18.1716 0.113958 18.969 0.496973 19.6684C0.879987 20.3677 1.46115 20.9376 2.16705 21.306L19.1393 29.7151L27.5276 46.7856C27.8648 47.4538 28.3807 48.0147 29.0177 48.4058C29.6547 48.7969 30.3876 49.0026 31.1346 49H31.4142C32.2141 48.9409 32.9779 48.642 33.6061 48.1422C34.2344 47.6423 34.6982 46.9645 34.9372 46.1969L48.7779 5.30069C49.025 4.59414 49.0669 3.83174 48.8986 3.10227C48.7303 2.37279 48.3588 1.70625 47.8272 1.18024ZM4.54372 17.7462L40.2498 5.80524L20.4255 25.6787L4.54372 17.7462ZM31.3303 44.5712L23.3894 28.65L43.2137 8.77646L31.3303 44.5712Z"
                      fill="#4CB6AC"
                    />
                  </svg>
                </button>
              ) : (
                <button type="submit" className="send-button">
                  <svg
                    width="15"
                    height="20"
                    viewBox="0 0 14 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 12C6.16667 12 5.45833 11.7083 4.875 11.125C4.29167 10.5417 4 9.83333 4 9V3C4 2.16667 4.29167 1.45833 4.875 0.875C5.45833 0.291667 6.16667 0 7 0C7.83333 0 8.54167 0.291667 9.125 0.875C9.70833 1.45833 10 2.16667 10 3V9C10 9.83333 9.70833 10.5417 9.125 11.125C8.54167 11.7083 7.83333 12 7 12ZM6 19V15.925C4.26667 15.6917 2.83333 14.9167 1.7 13.6C0.566666 12.2833 0 10.75 0 9H2C2 10.3833 2.48767 11.5627 3.463 12.538C4.43833 13.5133 5.61733 14.0007 7 14C8.38267 13.9993 9.562 13.5117 10.538 12.537C11.514 11.5623 12.0013 10.3833 12 9H14C14 10.75 13.4333 12.2833 12.3 13.6C11.1667 14.9167 9.73333 15.6917 8 15.925V19H6Z"
                      fill="#4CB6AC"
                    />
                  </svg>
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
