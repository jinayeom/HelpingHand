"use client";
import { useState, FormEvent } from "react";
import styles from "./send-message.module.css"; // Import the CSS module
import { db, auth } from "@/lib/firebase/clientApp";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import axios from "@/app/utils/axios_instance";
import { User } from "@/app/models/models";

const SendMessage = ({
  scroll,
  messagesId,
}: {
  scroll: React.RefObject<HTMLSpanElement | null>;
  messagesId: string;
}) => {
  const [message, setMessage] = useState("");
  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (message.trim() === "") {
      alert("Enter valid message");
      return;
    }
    // send

    const uid = auth.currentUser!.uid;
    const user = await axios.get<User>(`user/${uid}`);
    // .then((resp) => resp.data);


    if (!user) {
      throw Error("ooopppppsss");
    }

    await addDoc(collection(db, "message"), {
      content: message,
      name: user.data.name,
      timestamp: serverTimestamp(),
      senderId: user.data.uid,
      status: "delivered",
      messagesId,
    });

    setMessage("");
    scroll?.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={styles.sendMessageContainer}>
      <form onSubmit={(event) => sendMessage(event)} className="send-message">
        <label htmlFor="messageInput" hidden>
          Enter Message
        </label>
        <input
          id="messageInput"
          name="messageInput"
          type="text"
          className={styles.formInput}
          placeholder="type message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className={styles.sendMessageButton}>
          Send
        </button>
      </form>
    </div>
  );
};

export default SendMessage;
