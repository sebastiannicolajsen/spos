import React, { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { btn, input } from "../../components/styles";
import api from "../../spos-client";
import { Seller, SellerRole } from "../../spos-client/types";

export class UserPage extends React.Component<{}, { sellers: Seller[] }> {
  constructor() {
    super({});
    this.state = { sellers: [] };
  }

  componentDidMount() {
    api.seller.list().then((sellers) => {
      this.setState({ sellers });
    });
  }

  render() {
    const user = (user: Seller) => {
      return (
        <>
          <div className="grid grid-cols-3 gap-1 w-4/5 pb-2 text-left align-middle ">
            <div>{user.username}</div>
            <div>{user.role}</div>
            <div>
              {((user.role === SellerRole.ADMIN &&
                this.state.sellers.filter((e) => e.role === SellerRole.ADMIN)
                  .length > 1) ||
                user.role === SellerRole.DEFAULT) && (
                <button
                  onClick={() => {
                    api.seller.delete(user.id).then(() => {
                      this.setState({
                        sellers: this.state.sellers.filter(
                          (s) => s.id !== user.id
                        ),
                      });
                    });
                  }}
                  className={btn}
                >
                  <FaTrash />
                </button>
              )}
            </div>
          </div>
          <hr className="m-4" />
        </>
      );
    };

    const CreateUser = () => {
      const [username, setUsername] = useState("");
      const [password, setPassword] = useState("");
      const [role, setRole] = useState<SellerRole.DEFAULT | SellerRole.ADMIN>(
        SellerRole.DEFAULT
      );

      return (
        <div className="grid grid-cols-4 gap-6">
          <div>
            <input
              className={input}
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <input
              className={input}
              type="text"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button className={btn}>
              {role === SellerRole.DEFAULT ? (
                <span onClick={() => setRole(SellerRole.ADMIN)}>
                  make admin
                </span>
              ) : (
                <span onClick={() => setRole(SellerRole.DEFAULT)}>
                  make default
                </span>
              )}
            </button>
          </div>
          <div>
            <button
              disabled={username === "" || password === ""}
              className={btn}
              style={{ display: "flex", alignItems: "center" }}
              onClick={() => {
                api.seller.create(username, password, role).then(() => {
                  api.seller.list().then((sellers) => {
                    this.setState({ sellers });
                  });
                });
                setPassword("");
              }}
            >
              <FaPlus className="pr-2" /> Create user
            </button>
          </div>
        </div>
      );
    };

    return (
      <div className="grid grid-cols-1  w-4/5 m-auto">
        <CreateUser />
        <hr className="m-4" />
        <div className="grid grid-cols-1 content-center m-auto w-2/3">
          <div className="grid grid-cols-3 text-slate-500 font-semibold pb-5 text-left">
            <div>username</div>
            <div>role</div>
            <div>remove</div>
          </div>
        </div>

        <div className="grid grid-cols-1 content-center m-auto w-4/5">
          {this.state.sellers.map(user)}
        </div>
      </div>
    );
  }
}

export default UserPage;
