import "./Header.css";

type HeaderProps = {
  title: string;
};

function Header({ title }: HeaderProps) {
  return (
    <header>
      <div className="container">
        <h1>{title}</h1>
      </div>
    </header>
  );
}

export default Header;
