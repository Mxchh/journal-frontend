import "./Header.css";
import ProfilePhoto from "../pages/ProfilePhoto";

type HeaderProps = {
  title: string;
  userId?: string|number;
};

function Header({ title, userId }: HeaderProps) {
  return (
    <header>
      <div className="container">
        <h1>{title}</h1>
        <div className="profile-image">
          <ProfilePhoto userId={userId} size={40} />
        </div>
      </div>
    </header>
  );
}

export default Header;
