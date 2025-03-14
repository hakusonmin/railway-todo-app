import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import "./Layout.scss";

const Layout = () => {
  return (
    <>
      <Header />
      <main className="wrapper">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;