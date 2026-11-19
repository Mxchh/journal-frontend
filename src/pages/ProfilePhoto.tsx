import "./ProfilePhoto.css";
import { useEffect, useRef, useState } from "react";
import profileImage from "../assets/default-profile.jpg";
import { Link } from "react-router-dom";

type ProfilePhotoProps = {
  userId?: number | string;
  size?: number;
};

export default function ProfilePhoto({ userId, size = 40 }: ProfilePhotoProps) {
  const [photoUrl, setPhotoUrl] = useState<string>(profileImage);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const profileId = userId ?? localStorage.getItem("userId");

  useEffect(() => {
    if (!profileId) return;

    const token = localStorage.getItem("token");
    fetch(`http://127.0.0.1:8000/api/profile/${profileId}`, {
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Profile request failed");
        return response.json();
      })
      .then((user) => {
        const photo = user.user?.profile_photo;
        if (photo) {
          setPhotoUrl(
            photo.startsWith("http")
              ? photo
              : `http://127.0.0.1:8000/storage/${photo}`,
          );
        }
      })
      .catch(() => setPhotoUrl(profileImage));
  }, [profileId]);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  return (
    <div className="profile-menu" ref={menuRef}>
      <button
        className="profile-trigger"
        type="button"
        aria-label="Open profile menu"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <img
          src={photoUrl}
          alt="Profile Photo"
          width={size}
          height={size}
          className="profile-photo"
        />
      </button>
      {menuOpen && (
        <div className="profile-popup" role="menu">
          <Link
            to="/profile"
            role="menuitem"
            onClick={() => setMenuOpen(false)}
          >
            View profile
          </Link>
        </div>
      )}
    </div>
  );
}
