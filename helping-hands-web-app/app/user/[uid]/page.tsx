"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, use, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { User, Wishlist, Connection } from "@/app/models/models";
import axios from "@/app/utils/axios_instance";
import "./styles.css";
import { v4 as uuidv4 } from "uuid";
import { firebaseApp } from "@/lib/firebase/clientApp";
import { AxiosError } from "axios";
import Navbar from "@/app/components/Navbar/Navbar";
import WishlistTable from "@/app/components/WishlistTable/WishlistTable";
import ConnectionsTable from "@/app/components/ConnectionsTable/ConnectionsTable";
import Image from "next/image";

export default function ProfilePage({
  params,
}: {
  params: Promise<{ uid: string }>;
}) {
  const uid = use(params).uid;
  const [user, setUser] = useState<User>();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [wishlist, setWishlist] = useState<Wishlist>();
  const [connections, setConnections] = useState<Connection[]>([]);
  const auth = getAuth(firebaseApp);
  const curUid = useRef<string>("");
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        curUid.current = user.uid;
      }
    });
  });

  useEffect(() => {
    axios
      .get<User>(`user/${uid}`, {
        headers: { skipAuth: true },
      })
      .then((resp) => setUser(resp.data))
      .catch((err) => setErrorMsg(err.message));
  }, [uid]);

  useEffect(() => {
    if (user && user.role == "mentee") {
      // fetch the wishlist for the user
      axios
        .get<Wishlist>(`wishlist/${uid}`, {
          headers: { skipAuth: true },
        })
        .then((resp) => setWishlist(resp.data))
        .catch((err) => setErrorMsg(err.message));
    }

    if (curUid.current == uid) {
      axios
        .get<Connection[]>(`connections/${uid}`, {
          headers: { skipAuth: true },
        })
        .then((resp) => setConnections(resp.data))
        .catch((err) => console.log(err));
    }
  }, [user, uid]);

  const handleConnect = () => {
    if (curUid.current != "" && user) {
      const connection: Connection = {
        id: uuidv4(),
        participants: [curUid.current, user.uid],
        status: "pending",
        messagesId: uuidv4(),
      };
      axios
        .post("connections", connection, {
          headers: { skipAuth: true },
        })
        .then((resp) => {
          if (resp.status == 400) {
            console.log(resp.data);
            setErrorMsg(resp.data.message);
          } else {
            alert(`You have sent a connection request to ${user.name}`);
          }
        })
        .catch((err: AxiosError) => {
          console.log(err);
          alert(
            `Connection request error: ${
              (err.response!.data as { message: string }).message as string
            }`
          );
        });
    } else {
      router.push("/user/signin");
    }
  };

  return (
    <div>
      <Navbar bgColor="#FFCE9DAD" uid={curUid ? curUid.current : ""}></Navbar>
      <div className="profile-container">
        {errorMsg == "" ? null : <div>{errorMsg}</div>}
        <div className="image-separator">
          <div style={{ paddingRight: "50px" }}>
            {user ? (
              <Image
                src={user.profile_img}
                alt={user.name}
                className="profile-img"
                width={310}
                height={310}
              ></Image>
            ) : null}
            <h1 className="name-tag">{user?.name}</h1>
          </div>
          <div className="bio">
            <h2>Bio</h2>
            <div>{user?.bio}</div>
          </div>
        </div>
        {user?.role == "mentee" ? (
          <div className="wishlist-container">
            <div className="wishlist-header">Wishlist</div>
            <WishlistTable
              wishlist={wishlist}
              canEdit={curUid.current == user?.uid}
              handler={setWishlist}
            ></WishlistTable>
          </div>
        ) : null}
        {curUid.current == user?.uid ? (
          <ConnectionsTable
            connections={connections}
            loggedUid={uid}
          ></ConnectionsTable>
        ) : (
          <button className="connect-button" onClick={handleConnect}>
            CONNECT WITH {user?.name}
          </button>
        )}
      </div>
    </div>
  );
}
