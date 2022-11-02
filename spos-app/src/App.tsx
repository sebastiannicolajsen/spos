import api from "./spos-client";

function App() {
  const products = api.products.useProducts();

  return (
    <div >
      {products.map((product) => (
        <>
          <span className="text-3xl font-bold underline">
            {product.id} | {product.name} | {product.price_points[0].value}kr{" "}
            <br />
          </span>
        </>
      ))}
    </div>
  );
}

export default App;
