import { useState } from "react";
import "./Registration.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(password !== confirmPassword) {
        console.error("Password do not match");
        return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          password_confirmation: confirmPassword,
        }),
      });
      const data = await response.json();

      console.log(data);
      if (response.ok) {
        alert("Registered successfully!");
        setEmail("");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error("Something went wrong: ", error);
    }
  };

  return (
    <>
    <div className="journal-image">
      <div className="container">
        <div className="box">

      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Username</label>
          <br />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)} required
          />
        </div>
        <div>
            <label>Email</label>
            <br />
            <input type="email" value={email} onChange = {(e)=> setEmail(e.target.value)} required />
        </div>
        <div>
            <label>Password</label>
            <br />
            <input type="password" value={password} onChange = {(e)=>setPassword(e.target.value)} required/>
        </div>

        <div>
            <label>Confirm Password</label>
            <br />
            <input type="password" value={confirmPassword} onChange = {(e)=>setConfirmPassword(e.target.value)} required/>
        </div>
        <br />
        <button type="submit">Register</button>
      </form>
        </div>
      </div>
      </div>
    </>
  );
}
