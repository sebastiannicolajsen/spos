import { Link, useLocation } from "react-router-dom";
import api from "../spos-client/index";
import { SellerRole } from "../spos-client/types";

function Header() {
  const user_role = api.user.role();

  const location = useLocation();

  function button(link: string, text: string) {
    if (location.pathname === link)
      return <span className="pl-5 pr-5 text-slate-800">{text}</span>;
    return (
      <Link to={link}>
        <span className="pl-5 pr-5 text-slate-500 hover:text-slate-800 hover:cursor-pointer">
          {text}
        </span>
      </Link>
    );
  }

  function compButton(
    role: SellerRole,
    compare: SellerRole,
    link: string,
    text: string
  ) {
    if (role !== compare) return <></>;
    return button(link, text);
  }

  return (
      <div className="bg-white pb-5 mb-3 pt-5 fixed top-0 right-0 left-0">
        {button("/", "Prices")}
        {button("/dashboard", "Graph")}
        {compButton(user_role, SellerRole.DEFAULT, "/pos", "Sale")}
        {compButton(user_role, SellerRole.ADMIN, "/pos", "Sale")}
        {compButton(
          user_role,
          SellerRole.DEFAULT,
          "/transactions",
          "Transactions"
        )}
        {compButton(
          user_role,
          SellerRole.ADMIN,
          "/transactions",
          "Transactions"
        )}
        {compButton(user_role, SellerRole.ADMIN, "/users", "Users")}
        {compButton(user_role, SellerRole.ADMIN, "/cron", "Trigger jobs")}
        {compButton(
          user_role,
          SellerRole.ADMIN,
          "/subscribers",
          "Transformations"
        )}
        {compButton(user_role, SellerRole.UNKNOWN, "/login", "Login")}
        {user_role !== SellerRole.UNKNOWN && (
          <>
            <span
              onClick={() => api.auth.logout()}
              className="pl-5 pr-5 text-slate-500 hover:text-slate-800 hover:cursor-pointer"
            >
              Logout
            </span>
          </>
        )}
      </div>
  );
}

export default Header;
