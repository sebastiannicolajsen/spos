import { Link } from 'react-router-dom';
import api from '../spos-client/index';
import { SellerRole } from '../spos-client/types';

function Header() {
  const user_role = api.user.role();

  return (<div>
    <Link to="/">overview</Link>
    <Link to="/dashboard">dashboard</Link>
    {user_role === SellerRole.UNKNOWN && <Link to="/login">login</Link>}
    {user_role === SellerRole.ADMIN && <Link to="/admin">admin</Link>}
    {user_role === SellerRole.DEFAULT && <Link to="/pos">pos</Link>}
  </div>)
}

export default Header;
