import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import Button from "./Button";
import { NavBar } from "./NavBar";

export default function Layout() {
  const { logout } = useAuth();
  const loc = useLocation();

  return (
    <div className="layout">
      <NavBar>
        <Link to="/products" className="header-logo">
          Game Shop
        </Link>
        <nav className="header-nav">
          <Link to="/products" className="nav-link">
            Products
          </Link>
          <Button variant="secondary" size="small" onClick={logout}>
            Logout
          </Button>
        </nav>
      </NavBar>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
