import api from "../../spos-client/index";
import { PricePoint, Product } from "../../spos-client/types";
import { FaCaretUp } from "react-icons/fa";
import { FaCaretDown } from "react-icons/fa";

function getRelation(p1: PricePoint, p2: PricePoint) {
  let diff = p1.value - p2.value;
  let content = <span className="text-slate-600">0%</span>;
  if (diff !== 0) {
    let disp =   diff / p2.value * 100; 
    disp = Math.abs(Math.round(disp * 100) / 100) ;
    content = (
      <span
        className={diff > 0 ? "text-green-600" : "text-red-600"}
        style={{ display: "flex", alignItems: "center" }}
      >
        {diff > 0 ? <FaCaretUp /> : <FaCaretDown />}
        {disp}%
      </span>
    );
  }
  return content;
}

function displayProduct(product: Product) {
  const def = <span className="text-slate-600">0%</span>;
  const rel1 = product.price_points.length > 1 ? getRelation(product.price_points[0], product.price_points[1]) : def;
  const rel2 = product.price_points.length > 1 ? getRelation(product.price_points[0], product.price_points[product.price_points.length - 1]) : def;

  return (
    <div className="grid grid-cols-4 gap-10 items-center bg-slate-50">
      <div className="">{product.name}</div>
      <div className="font-mono">{product.price_points[0].value}kr</div>
      <div className="font-mono">{rel1}</div>
      <div className="font-mono">{rel2}</div>
    </div>
  );
}

function MobilePage() {
  const products = api.products.useProducts();

  return (
    <>
      <div className="grid grid-cols-4 text-slate-500 font-semibold pb-5 text-left">
        <div>Name</div>
        <div>Current price</div>
        <div>Last change</div>
        <div>Overall change</div>
      </div>
      <div className="grid gap-y-1">{products.map(displayProduct)}</div>
    </>
  );
}

export default MobilePage;
