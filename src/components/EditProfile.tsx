import "./EditProfile.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Profile {
  id: number;
  profile_photo: string | null;
  username: string;
  email: string;
}

export default function EditProfile() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      setError("Please login to view your profile.");
      setLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:8000/api/profile/${userId}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Could not load profile");
        }
        return response.json();
      })
      .then((data: { user: Profile }) => {
        setUsername(data.user.username);
        setEmail(data.user.email);
        setProfilePhoto(data.user.profile_photo);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (newPassword && newPassword !== confirmPassword) {
      setError("The password do not match.");
      return;
    }
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const body: {
      username: string;
      email: string;
      password?: string;
      password_confirmation?: string;
    } = {
      username,
      email,
    };

    if (newPassword) {
      body.password = newPassword;
      body.password_confirmation = confirmPassword;
    }
    if (!token || !userId) {
      setError("Please log in again.");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/profile/${userId}`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(body),
        },
      );
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Could not save profile.");
      }

      const data: { user?: Profile } = await response.json();
      const savedUsername = data.user?.username ?? username;
      setUsername(savedUsername);
      localStorage.setItem("username", savedUsername);
      if (data.user?.profile_photo !== undefined) {
        setProfilePhoto(data.user.profile_photo);
      }
      setNewPassword("");
      setConfirmPassword("");
      alert("Edit profile successfully!");
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="profile-page">
        <p className="profile-message">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <section className="profile-card">
        <div className="profile-card-heading">
          <p className="profile-eyebrow">YOUR ACCOUNT</p>
          <h2>Profile settings</h2>
          <p>Keep your account details up to date.</p>
        </div>

        <div className="profile-avatar-wrap">
          {profilePhoto ? (
            <img
              className="profile-avatar"
              src={
                profilePhoto.startsWith("http")
                  ? profilePhoto
                  : `http://127.0.0.1:8000/storage/${profilePhoto}`
              }
              alt="Your profile"
            />
          ) : (
            <div
              className="profile-avatar profile-avatar-placeholder"
              aria-label="No profile photo"
            >
              {username.charAt(0).toUpperCase() || "?"}
            </div>
          )}
          <div className="profile-photo-control">
            <span className="profile-username">{username}</span>
          </div>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <label className="profile-field">
            <span>Username</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label className="profile-field">
            <span>Email address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <div className="profile-section-title">
            <h3>Change password</h3>
            <p>Leave these blank if you want to keep your current password.</p>
          </div>
          <label className="profile-field">
            <span>New password</span>
            <input
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </label>
          <label className="profile-field">
            <span>Confirm new password</span>
            <input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>

          {error && (
            <p className="profile-error" role="alert">
              {error}
            </p>
          )}
            <button className="profile-submit" type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
          </button>
        </form>
      </section>
    </div>
  );
}
