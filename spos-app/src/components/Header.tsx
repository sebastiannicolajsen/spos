import { Link } from "react-router-dom";
import api from "../spos-client/index";
import { SellerRole } from "../spos-client/types";

function compButton(
  role: SellerRole,
  compare: SellerRole,
  link: string,
  text: string
) {
  if (role !== compare) return <></>;
  return button(link, text);
}

function button(link: string, text: string) {
  return (
    <Link to={link}>
      <span className="pl-5 pr-5 text-slate-500 hover:text-slate-800">{text}</span>
    </Link>
  );
}

function Header() {
  const user_role = api.user.role();

  return (
    <div className="bg-white pb-5 mb-3 pt-5">
      {button("/", "prices")}
      {button("/dashboard", "graph")}
      {compButton(user_role, SellerRole.DEFAULT, "/pos", "pos")}
      {compButton(user_role, SellerRole.ADMIN, "/pos", "pos")}
      {compButton(user_role, SellerRole.DEFAULT, "/transactions", "transactions")}
      {compButton(user_role, SellerRole.ADMIN, "/transactions", "transactions")}
      {compButton(user_role, SellerRole.UNKNOWN, "/login", "login")}
      {compButton(user_role, SellerRole.ADMIN, "/admin", "settings")}
    </div>
  );
}

export default Header;
