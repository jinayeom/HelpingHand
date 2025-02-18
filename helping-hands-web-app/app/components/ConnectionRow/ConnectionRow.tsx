"use client";

import { Connection, User } from "@/app/models/models";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "@/app/utils/axios_instance";
import Image from "next/image";
import "./styles.css";

export default function ConnectionRow(props: {
  uid: string;
  conn: Connection;
}) {
  const [user, setUser] = useState<User>();
  const [, setSeed] = useState<number>(0.5);

  useEffect(() => {
    if (props.conn.participants[0] == props.uid)
      axios
        .get(`user/${props.conn.participants[1]}`, {
          headers: { skipAuth: true },
        })
        .then((resp) => setUser(resp.data));
    else
      axios
        .get(`user/${props.conn.participants[0]}`, {
          headers: { skipAuth: true },
        })
        .then((resp) => setUser(resp.data));
  }, [props.conn.participants, props.uid]);

  const handleAccept = (other: string) => {
    const newConn: Connection = {
      id: props.conn.id,
      messagesId: props.conn.messagesId,
      participants: props.conn.participants,
      status: "accepted",
    };
    props.conn.status = "accepted";
    axios
      .put("/connections", newConn, {
        headers: { skipAuth: true },
      })
      .then(() => alert(`Accepted the connection with ${other}`));
    setSeed(Math.random());
  };

  const handleReject = (other: string) => {
    const newConn: Connection = {
      id: props.conn.id,
      messagesId: props.conn.messagesId,
      participants: props.conn.participants,
      status: "rejected",
    };
    props.conn.status = "rejected";
    axios
      .put("/connections", newConn, {
        headers: { skipAuth: true },
      })
      .then(() => alert(`Rejected the connection with ${other}`));
    setSeed(Math.random());
  };

  return user ? (
    <div className="conn">
      <div className="connection-row-profile">
        <Image alt={user.name} src={user.profile_img} width={50} height={50} />
        <div className="connection-row-profile-name">{user.name}</div>
      </div>
      {props.conn.status == "pending" ? (
        <div className="connection-row-actions">
          <div
            className="connection-row-action"
            onClick={() => handleAccept(user.name)}
          >
            ✅
          </div>
          <div
            className="connection-row-action"
            onClick={() => handleReject(user.name)}
          >
            ❌
          </div>
        </div>
      ) : props.conn.status == "accepted" ? (
        <Link href={`/chat/${props.conn.messagesId}`}>
          <button className="connection-row-chat-btn">CHAT</button>
        </Link>
      ) : (
        <div className="connection-row-rejected-text">REJECTED</div>
      )}
    </div>
  ) : null;
}
