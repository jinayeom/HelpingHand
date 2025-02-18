"use client";
import { useRef, useState, useEffect, use } from "react";
import { useSearchParams } from "next/navigation";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  where,
  limit,
} from "firebase/firestore";
import { type Message as MessageType } from "../../models/models";
import styles from "../chat.module.css";
import SendMessage from "../components/SendMessage/SendMessage";
import { auth, db } from "@/lib/firebase/clientApp";
import { useRouter } from "next/navigation";
import { User } from "../../models/models";
import axios from "@/app/utils/axios_instance";
import Image from "next/image";

import Message from "../components/Message/Message";
import { onAuthStateChanged } from "firebase/auth";
export default function ChatPage({
  params,
}: {
  params: Promise<{ messagesId: string }>;
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const messagesId = use(params).messagesId;
  const [messages, setMessages] = useState<MessageType[]>([]);
  const scroll = useRef<HTMLSpanElement>(null);
  const searchParams = useSearchParams();
  const otherUid = searchParams.get("userId");
  const [user, setUser] = useState<User>();
  const [otherUser, setOtherUser] = useState<User>();
  const [uid, setUid] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/user/signin");
        return <div>You need to be logged in to access this page.</div>;
      } else {
        setUid(user.uid);
      }
    });
  }, [router]);

  useEffect(() => {
    if (uid) {
      axios
        .get<User>(`user/${uid}`, {
          headers: { skipAuth: true },
        })
        .then((resp) => setUser(resp.data));
    }
  }, [uid]);

  useEffect(() => {
    if (otherUid) {
      axios
        .get<User>(`user/${otherUid}`, {
          headers: { skipAuth: true },
        })
        .then((resp) => setOtherUser(resp.data));
    }
  }, [otherUid]);

  useEffect(() => {
    const q = query(
      collection(db, "message"),
      where("messagesId", "==", messagesId),
      orderBy("timestamp", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const fetchedMessages: MessageType[] = [];

      QuerySnapshot.forEach((doc) => {
        const data = doc.data();
        // Type assertion or validation
        const message: MessageType = {
          id: doc.id,
          content: data.content,
          status: data.status,
          timestamp: data.timestamp,
          senderId: data.senderId,
          messagesId: data.messagesId,
        };
        fetchedMessages.push(message);
      });

      //   const sortedMessages = fetchedMessages.sort(
      //     (a, b) => a.timestamp - b.timestamp
      //   );
      setMessages(fetchedMessages.reverse());
    });

    return () => unsubscribe();
  }, [messagesId]);

  return (
    <div className={styles.chatbox}>
      <div className={styles.header}>
        {otherUser ? (
          <>
            {otherUser.name}
            <Image
              src={otherUser.profile_img}
              alt={otherUser?.name}
              width={50}
              height={50}
            />
          </>
        ) : null}
      </div>
      <div className={styles.messages}>
        {user
          ? messages.map((message) => (
              <Message key={message.id} message={message} uid={user?.uid} />
            ))
          : null}
      </div>
      {/* when a new message enters the chat, the screen scrolls down to the scroll div */}
      <span ref={scroll}></span>
      <SendMessage scroll={scroll} messagesId={messagesId} />
    </div>
  );
}
