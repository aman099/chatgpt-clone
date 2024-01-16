import { useEffect, useState } from "react";
import "./App.css";
import moment from "moment/moment";

import userImg from "./assets/user.png";
import assistantImg from "./assets/robot.png";

function App() {
  const [value, setValue] = useState(null);
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [clicked, setClicked] = useState({
    activeObject: null,
    objects: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
  });
  const [date, setDate] = useState("");

  const createNewChat = () => {
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
  };

  const clearChat = () => {
    alert("All your chatlog history will be cleared");
    setPreviousChats([]);
  };

  const handleClick = (uniqueTitle, idx) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue("");
    setClicked({ ...clicked, activeObject: clicked.objects[idx] });
  };

  function toggleActiveStyle(idx) {
    if (clicked.objects[idx] === clicked.activeObject) {
      return "box active";
    } else {
      return "box inactive";
    }
  }

  // INTL Date formatter
  // const f = new Intl.DateTimeFormat("en-uk", {
  //   dateStyle: "medium",
  //   timeStyle: "short",
  // });

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await fetch(
        "http://localhost:5502/completions",
        options
      );
      const data = await response.json();
      setMessage(data.choices[0].message);
      setDate(moment(Date.now()).format("hh:mm, Do MMMM"));
    } catch (error) {
      console.log(error);
    }
    // setValue("");
  };

  useEffect(() => {
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    } else if (currentTitle && value && message) {
      setPreviousChats((prevChats) => [
        ...prevChats,
        {
          title: currentTitle,
          role: "user",
          content: value,
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content,
        },
      ]);
    }
  }, [message, currentTitle]);

  const currentChat = previousChats.filter(
    (previousChat) => previousChat.title === currentTitle
  );

  const uniqueTitles = Array.from(
    new Set(previousChats.map((previousChat) => previousChat.title))
  );

  return (
    <div className="App">
      <section className="sidebar">
        <button className="new-chat" onClick={createNewChat}>
          + New Chat
        </button>
        <button className="clear-chat" onClick={clearChat}>
          <span className="logo-x">❌</span> Clear Conversation
        </button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, idx) => (
            <li key={idx} onClick={() => handleClick(uniqueTitle, idx)}>
              <div className={toggleActiveStyle(idx)}>{uniqueTitle}</div>
            </li>
          ))}
        </ul>
        <nav>
          <p>
            Made by <br />
            <a
              target="_blank"
              rel="noreferrer"
              href="https://portfoolio102.netlify.app/"
              className="devName"
            >
              Aman Pathak
            </a>
          </p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>AmanGPT</h1>}
        <ul className="feed">
          {currentChat?.map((chatMessage, idx) => (
            <li key={idx} className="feed-list">
              <span className="date">{date}</span> <br />
              <p className="role">
                {/* {chatMessage.role}&nbsp; */}
                <img
                  src={`${
                    chatMessage.role === "user" ? userImg : assistantImg
                  }`}
                  alt="profile"
                />
              </p>
              <p>{chatMessage.content}</p>
            </li>
          ))}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input
              placeholder="Ask anything..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <div id="submit" onClick={getMessages}>
              ➡️
            </div>
          </div>
          <p className="info">
            Chat GPT Mar 14 Version. Free Research Preview. Our goal is to make
            AI systems more natural and safe to interact with. Your feedback
            will help us improve.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
