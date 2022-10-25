import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import api from "./spos-client";

function App() {
  const products = api.products.useProducts();

  return (
    <div className="App">
      {products.map((product) => (
        <>
          {product.id} | {product.name} | {product.price_points.values}kr <br/>
        </>
      ))}
    </div>
  );
}

export default App;
