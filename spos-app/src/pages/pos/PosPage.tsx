import { ReactElement, useState } from "react";
import api from "../../spos-client";
import {
  ItemExpanded,
  PricePoint,
  Product,
  SellerRole,
} from "../../spos-client/types";

import {btn, input} from "../../components/styles";

import * as _ from "lodash";
import { FaEject, FaMinus, FaPlus, FaTrash, FaUpload } from "react-icons/fa";

function PosPage() {
  const products = api.products.useProducts();
  const user = api.user.role();

  const [usedProducts, setUsedProducts] = useState<Product[]>([]);

  const [ordering, setOrdering] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState<ItemExpanded[]>([]);

  const addOrUpdateProduct = (product: Product, quantity: number) => {
    if (quantity <= 0) {
      removeProduct(product);
    } else {
      const item = selected.find((i) => i.product.id === product.id);
      if (item) {
        item.quantity = quantity;
        setSelected([...selected]);
      } else {
        const price_point = usedProducts.find((p) => p.id === product.id)!
          .price_points[0];
        if (price_point) {
          setSelected([...selected, { product, quantity, price_point }]);
        }
      }
    }
  };

  const removeProduct = (product: Product) => {
    setSelected(selected.filter((i) => i.product.id !== product.id));
  };

  const toggleOrder = (manual: boolean | null = null) => {
    if (!ordering) {
      setUsedProducts(_.cloneDeep(products));
      setEditing(false);
    } else {
      setSelected([]);
    }
    if (manual === null) setOrdering(!ordering);
    else setOrdering(manual);
  };

  const getQuantity = (product: Product) => {
    const item = selected.find((i) => i.product.id === product.id);
    return item ? item.quantity : 0;
  };

  const completeOrder = () => {
    api.transactions.create(selected);
    toggleOrder();
  };

  const modifyQuantity = (product: Product) => {
    return (
      <div className="grid grid-cols-2 gap-x-1 mb-0 pb-0  content-center ml-auto mr-auto gap-2">
        <button
          className={`${btn} text-m content-center`}
          onClick={() => addOrUpdateProduct(product, getQuantity(product) + 1)}
        >
          <FaPlus />
        </button>
        <button
          className={`${btn} text-m content-center`}
          onClick={() => addOrUpdateProduct(product, getQuantity(product) - 1)}
        >
          <FaMinus />
        </button>
      </div>
    );
  };

  const CreateProductCard = () => {
    let name: string;
    let minimumValue: number;
    let value: number;
    return (
      <>
        <hr className="m-4" />
        <div className="grid grid-cols-1 pb-1 w-1/2">
          <div className="grid grid-cols-2 pb-1">
            <div>name</div>
            <input
              className={input}
              onChange={(e) => (name = e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 pb-1">
            <div>min price</div>
            <input
              className={input}
              onChange={(e) => (minimumValue = parseInt(e.target.value))}
            />
          </div>
          <div className="grid grid-cols-2 pb-1">
            <div>initial price</div>
            <input
              className={input}
              onChange={(e) => (value = parseInt(e.target.value))}
            />
          </div>
          <div>
            <button
              className={`${btn} w-40`}
              onClick={() => {
                api.products
                  .create(name, value, minimumValue)
                  .then(() => api.products.invalidate());
              }}
            >
              <div
                className="grid grid-cols-2 gap-2"
                style={{ display: "flex", alignItems: "center" }}
              >
                <FaPlus /> Create product
              </div>
            </button>
          </div>
        </div>
      </>
    );
  };

  const EditProductCard = (product: Product) => {
    let name: String;
    let minimumValue: number;
    let value: number;

    const update = (obj: any) =>
      api.products
        .update(product.id, obj)
        .then(() => api.products.invalidate());
    return cardWrapper(
      <div>
        <div className="grid grid-cols-3 pb-1">
          <div>name</div>
          <input
            className={input}
            onChange={(e) => (name = e.target.value)}
            defaultValue={product.name}
          />
          <button className={btn} onClick={() => update({ name })}>
            <FaUpload />
          </button>
        </div>
        <div className="grid grid-cols-3 pb-1">
          <div>min price</div>
          <input
            className={input}
            onChange={(e) => (minimumValue = parseInt(e.target.value))}
            defaultValue={product.minimum_value}
          />
          <button className={btn} onClick={() => update({ minimumValue })}>
            <FaUpload />
          </button>
        </div>
        <div className="grid grid-cols-3 pb-1">
          <div>new price</div>
          <input
            className={input}
            onChange={(e) => (value = parseInt(e.target.value))}
            defaultValue={product.price_points[0].value}
          />
          <button
            className={btn}
            onClick={() =>
              api.price_points
                .create(product.id, value)
                .then(() => api.products.invalidate())
            }
          >
            <FaUpload />
          </button>
        </div>
        <div>
          <button
            className={btn}
            onClick={() => {
              api.products.delete(product.id);
              api.products.invalidate();
            }}
          >
            <FaTrash />
          </button>
        </div>
      </div>
    );
  };

  const ProductCard = (product: Product) => {
    return cardWrapper(
      <div className="grid grid-cols-1 w-50 m-4 h-auto">
        <div className="text-xl text-slate-600">{product.name}</div>
        <div className="font-mono pb-2">{product.price_points[0].value}</div>
        <div>{ordering && modifyQuantity(product)}</div>
      </div>
    );
  };

  const OrderingComponent = () => {
    return (
      <div className={ordering ? "" : "content-center flex"}>
        {ordering ? (
          <div className="grid grid-cols-2 gap-1">
            <button className={btn} onClick={completeOrder}>
              Complete order
            </button>
            <button className={btn} onClick={() => toggleOrder(null)}>
              Cancel order
            </button>
          </div>
        ) : (
          <button className={btn} onClick={() => toggleOrder(null)}>
            Start order
          </button>
        )}
      </div>
    );
  };

  const cardWrapper = (p: ReactElement) => {
    return (
      <div className="max-w-sm rounded overflow-hidden shadow-lg m-2 p-2">
        {p}
        <div className="px-6 py-4"></div>
      </div>
    );
  };

  const Order = () => {
    const total = selected.reduce(
      (acc, item) => acc + item.price_point.value * item.quantity,
      0
    );

    if (!ordering) return <></>;

    return (
      <div className="grid grid-cols-1">
        <div className="grid grid-cols-1">
          {selected.map((i) => (
            <>
              <hr className="m-4" />
              <div className="grid grid-cols-4 content-center">
                <div>{i.product.name}</div>
                <div>{i.quantity}</div>
                {modifyQuantity(i.product)}
                <div>{i.price_point.value * i.quantity}</div>
              </div>
            </>
          ))}
        </div>
        <hr className="m-4" />
        <div className="grid grid-cols-4">
          <div>Total</div>
          <div />
          <div />
          <div>{total}</div>
        </div>
        <hr className="m-4" />
      </div>
    );
  };

  const edit = () => {
    if (!editing) {
      toggleOrder(false);
    }
    setEditing(!editing);
  };

  return (
    <div>
      <div >
        {user === SellerRole.ADMIN &&
          (editing ? (
            <div className="grid grid-cols-2 pb-5 w-2/5">
              <div>
                <button className={btn} onClick={edit}>
                  Disable editing
                </button>
              </div>
              <button
                className={btn}
                onClick={() => {
                  api.price_points
                    .reset()
                    .then(() => api.products.invalidate());
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <FaEject /> <div className="ml-2">reset products</div>
                </div>
              </button>
            </div>
          ) : (
            <div className="pb-5">
              <button className={btn} onClick={edit}>
                Enable editing
              </button>
            </div>
          ))}
      </div>
      <div className={!editing ? "grid grid-cols-2 gap-5" : "grid"}>
        <div className="grid grid-cols-2">
          {ordering
            ? usedProducts.map(ProductCard)
            : products.map(editing ? EditProductCard : ProductCard)}
        </div>
        {editing && <CreateProductCard />}
        <div className="grid grid-cols-1 ">
          {!editing && (
            <>
              {cardWrapper(
                <>
                  <Order /> <OrderingComponent />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PosPage;
