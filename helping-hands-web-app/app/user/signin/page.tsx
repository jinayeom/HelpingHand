"use client";

import { firebaseApp } from "@/lib/firebase/clientApp";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "./styles.css";
import Link from "next/link";
import Image from "next/image";

export default function Register() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const auth = getAuth(firebaseApp);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    signInWithEmailAndPassword(auth, email, password)
      .then(async (user) => {
        const uid = user.user.uid;
        const token = await user.user.getIdToken();

        localStorage.setItem("token", token);
        router.push(`${uid}`);
      })
      .catch((err) => setError(err.message));
  }

  return (
    <div className="background">
      <div className="signin-container">
        <Image
          src="/heartinhand.png"
          alt="Helping Hands"
          width={200}
          height={200}
        />
        <h1>Welcome back</h1>
        {error == "" ? null : <div>{error}</div>}
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="emailInput">Email</label>
            <input
              type="email"
              id="emailInput"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
          <div className="input-group">
            <label htmlFor="pwInput">Password</label>
            <input
              type="password"
              id="pwInput"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>
          <button type="submit" className="create-button">
            Sign-in
          </button>
          <div className="create-account">
            <Link href="/user/signup">Create an Account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
