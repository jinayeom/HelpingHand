"use client";
import { useEffect, useState } from "react";
import styles from "./chat.module.css";
import { firebaseApp } from "@/lib/firebase/clientApp";
import { Connection, User } from "../models/models";
import InboxItem from "./components/InboxItem/InboxItem";
import axios from "@/app/utils/axios_instance";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export interface UserWithMessagesId extends User {
  messagesId: string;
}
export default function ChatLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [uid, setUid] = useState<string | null>(null);
  const [users, setUsers] = useState<UserWithMessagesId[]>([]);
  const auth = getAuth(firebaseApp);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        setUid(null);
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function getConnections() {
      const connections = await axios.get<Connection[]>(`connections/${uid}`, {
        headers: { skipAuth: true },
      });

      const userIdsWithMessages = connections.data
        .filter((connection) => connection.status == "accepted")
        .flatMap((connection: Connection) =>
          connection.participants
            .filter((id) => id !== uid)
            .map((userId) => ({
              uid: userId,
              messagesId: connection.messagesId,
            }))
        );

      if (userIdsWithMessages.length > 0) {
        for (const { uid, messagesId } of userIdsWithMessages) {
          try {
            const userResponse = await axios.get<User>(`user/${uid}`, {
              headers: { skipAuth: true },
            });
            const userWithMessagesId: UserWithMessagesId = {
              ...userResponse.data,
              messagesId,
            };
            setUsers((prev) => [...prev, userWithMessagesId]);
          } catch (error) {
            console.error(`Failed to fetch user with ID: ${uid}`, error);
          }
        }
      }
    }
    if (uid) {
      getConnections();
    }
  }, [auth, uid]);

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.title}>
          <h3 className={styles.h3}>Chat Inbox</h3>
        </div>
        {users.map((user) => (
          <InboxItem key={user.uid} user={user} />
        ))}
      </nav>
      {children}
    </div>
  );
}
