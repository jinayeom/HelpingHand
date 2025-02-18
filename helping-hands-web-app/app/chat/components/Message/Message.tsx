"use client";

import { useEffect, useState } from "react";
import { User, type Message } from "@/app/models/models";
import styles from "./message.module.css";
import axios from "@/app/utils/axios_instance";
import Image from "next/image";

export default function Message({
  message,
  uid,
}: {
  message: Message;
  uid: string;
}) {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    if (uid) {
      axios
        .get<User>(`user/${message.senderId}`, {
          headers: { skipAuth: true },
        })
        .then((resp) => setUser(resp.data));
    }
  }, [message.senderId, uid]);

  return (
    <div
      className={`${styles.message} ${
        message.senderId == uid ? `${styles.receiver}` : `${styles.sender}`
      }`}
    >
      <Image
        src={user ? user.profile_img : "https://placehold.co/100/100"}
        alt="temp"
        width={50}
        height={50}
      />
      <p className={styles.text}>{message.content}</p>
    </div>
  );
}
