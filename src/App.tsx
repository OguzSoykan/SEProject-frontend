import React from "react";
import MyRouter from "routers/index";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { CartProvider } from "context/CartContext";

function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Ciseco || Shop - eCommerce React template</title>
        <meta
          name="description"
          content="Ciseco || Shop - eCommerce React template"
        />
      </Helmet>

      {/* MAIN APP */}
      <div className="bg-white text-base dark:bg-slate-900 text-slate-900 dark:text-slate-200">
        <CartProvider>
          <MyRouter />
        </CartProvider>
      </div>
    </HelmetProvider>
  );
}

export default App;
