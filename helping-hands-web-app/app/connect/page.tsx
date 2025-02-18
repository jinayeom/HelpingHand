"use client";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { User } from "../models/models";
import { useState, useEffect } from "react";
import { firebaseApp } from "@/lib/firebase/clientApp";
import axios from "@/app/utils/axios_instance";
import GalleryItem from "../components/GalleryItem/GalleryItem";
import "./styles.css";
import Navbar from "../components/Navbar/Navbar";

export default function ConnectPage() {
  const auth = getAuth(firebaseApp);
  const [mentors, setMentors] = useState<User[]>([]);
  const [mentees, setMentees] = useState<User[]>([]);
  const [uid, setUid] = useState<string>();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        return;
      } else {
        setUid(user.uid);
      }
    });
  });

  useEffect(() => {
    axios
      .get<User[]>("mentors", {
        headers: { skipAuth: true },
      })
      .then((resp) => setMentors(resp.data))
      .catch((err) => {
        console.log(err);
        alert(`Error obtaining mentors`);
      });

    axios
      .get<User[]>("mentees", {
        headers: { skipAuth: true },
      })
      .then((resp) => setMentees(resp.data))
      .catch((err) => {
        console.log(err);
        alert(`Error obtaining mentees`);
      });
  }, []);

  const mentorItems = mentors.map((mentor: User, idx) => (
    <GalleryItem key={`mentor-${idx}`} user={mentor}></GalleryItem>
  ));
  const menteeItems = mentees.map((mentee: User, idx) => (
    <GalleryItem key={`mentee-${idx}`} user={mentee}></GalleryItem>
  ));

  return (
    <div>
      <Navbar bgColor="#FFCE9DAD" uid={uid ?? ""}></Navbar>
      <div className="gallery-page">
        <div className="gallery-title">Profiles</div>
        <div className="gallery-section">Meet Our Mentors</div>
        <div className="gallery-container">{mentorItems}</div>
        <div className="gallery-section">Meet Our Mentees</div>
        <div className="gallery-container">{menteeItems}</div>
      </div>
    </div>
  );
}
