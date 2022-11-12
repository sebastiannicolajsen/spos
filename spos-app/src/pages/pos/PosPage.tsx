import { useState } from "react";
import api from "../../spos-client";
import {
  ItemExpanded,
  PricePoint,
  Product,
  SellerRole,
} from "../../spos-client/types";

import * as _ from "lodash";
import { FaTrash } from "react-icons/fa";

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

  const toggleOrder = () => {
    if (!ordering) {
      setUsedProducts(_.cloneDeep(products));
    } else {
      setSelected([]);
    }
    setOrdering(!ordering);
  };

  const getQuantity = (product: Product) => {
    const item = selected.find((i) => i.product.id === product.id);
    return item ? item.quantity : 0;
  };

  const completeOrder = () => {
    api.transactions.create(selected);
    toggleOrder();
  }

  const modifyQuantity = (product: Product) => {
    return <>
              <button
                className="btn btn-slate"
                onClick={() =>
                  addOrUpdateProduct(product, getQuantity(product) + 1)
                }
              >
                +
              </button>
              <button
                className="btn btn-slate"
                onClick={() =>
                  addOrUpdateProduct(product, getQuantity(product) - 1)
                }
              >
                -
              </button>
            </>
  }


  const product = (product: Product) => {
    return (
      <div>
        <div>{product.name}</div>
        <div>{product.price_points[0].value}</div>

        <div>
          {ordering && (
            modifyQuantity(product)
          )}
          {editing && (
            <button
              onClick={() => {
                api.products.delete(product.id);
                setEditing(editing);
              }}
            >
              remove product <FaTrash />
            </button>
          )}
        </div>
      </div>
    );
  }

  const OrderingComponent = () => {
    return (
      <div>
        {ordering ? (
          <div>
            <button className="btn btn-slate" onClick={completeOrder}>Complete order</button>
            <button className="btn btn-slate" onClick={toggleOrder}>
              Cancel order
            </button>
          </div>
        ) : (
          <button className="btn btn-slate" onClick={toggleOrder}>
            Start order
          </button>
        )}
      </div>
    );
  };

  const Order = () => {
    const total = selected.reduce(
      (acc, item) => acc + item.price_point.value * item.quantity,
      0
    );

    return (
      <div>
        {user === SellerRole.ADMIN &&
          (editing ? (
            <button onClick={() => setEditing(false)}>Cancel editing</button>
          ) : (
            <button onClick={() => setEditing(true)}>Edit</button>
          ))}

        <div>
          {selected.map((i) => (
            <div className="grid grid-cols-4">
              <div>{i.product.name}</div>
              <div>{i.quantity}</div>
              <div>{i.price_point.value * i.quantity}</div>
              {modifyQuantity(i.product)}
            </div>
          ))}
          <div className="grid grid-cols-2">
            <div>total</div>
            <div>{total}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-5">
      <div>{ordering ? usedProducts.map(product) : products.map(product)}</div>
      <div>
        <Order /> <OrderingComponent />
      </div>
    </div>
  );
}

export default PosPage;
