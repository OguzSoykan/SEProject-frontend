import React from "react";
import MyRouter from "routers/index";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { CartProvider } from "context/CartContext";
import AdminPage from "containers/AdminPage/AdminPage";
import RestaurantAdminPage from "containers/RestaurantAdminPage/RestaurantAdminPage";

function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Food Ordering</title>
        <meta
          name="description"
          content="Food Ordering"
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
