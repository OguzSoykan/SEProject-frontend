import React from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Page } from "./types";
import ScrollToTop from "./ScrollToTop";
import PageHome from "containers/PageHome/PageHome";
import Page404 from "containers/Page404/Page404";
import AccountPage from "containers/AccountPage/AccountPage";
import PageContact from "containers/PageContact/PageContact";
import PageAbout from "containers/PageAbout/PageAbout";
import PageSignUp from "containers/PageSignUp/PageSignUp";
import PageLogin from "containers/PageLogin/PageLogin";
import PageSubcription from "containers/PageSubcription/PageSubcription";
import BlogPage from "containers/BlogPage/BlogPage";
import BlogSingle from "containers/BlogPage/BlogSingle";
import SiteHeader from "containers/SiteHeader";
import PageCollection from "containers/PageCollection";
import PageSearch from "containers/PageSearch";
import ProductDetailPage from "containers/ProductDetailPage/ProductDetailPage";
import ProductDetailPage2 from "containers/ProductDetailPage/ProductDetailPage2";
import AccountSavelists from "containers/AccountPage/AccountSavelists";
import AccountPass from "containers/AccountPage/AccountPass";
import AccountBilling from "containers/AccountPage/AccountBilling";
import AccountOrder from "containers/AccountPage/AccountOrder";
import CartPage from "containers/ProductDetailPage/CartPage";
import CheckoutPage from "containers/PageCheckout/CheckoutPage";
import PageCollection2 from "containers/PageCollection2";
import { Toaster } from "react-hot-toast";
import { authService } from "utils/authService";
import ProtectedRoute from "components/ProtectedRoute";
import AdminPage from "containers/AdminPage/AdminPage";
import UnauthorizedPage from "components/UnauthorizedPage";
import DeliveryPage from "containers/DeliveryPage/DeliveryPage";
import RestaurantAdminPage from "containers/RestaurantAdminPage/RestaurantAdminPage";
import RestaurantOrders from "containers/RestaurantAdminPage/RestaurantOrders";

export const pages: Page[] = [
  { path: "/", component: PageHome },
  { path: "/home-header-2", component: PageHome },
  { path: "/product-detail", component: ProductDetailPage },
  { path: "/product-detail-2", component: ProductDetailPage2 },
  { path: "/page-collection-2", component: PageCollection2 },
  { path: "/page-collection", component: PageCollection },
  { path: "/page-search", component: PageSearch },
  { path: "/account", component: AccountPage },
  { path: "/account-savelists", component: AccountSavelists },
  { path: "/account-change-password", component: AccountPass },
  { path: "/account-billing", component: AccountBilling },
  { path: "/account-my-order", component: AccountOrder },
  { path: "/cart", component: CartPage },
  { path: "/checkout", component: CheckoutPage },
  { path: "/blog", component: BlogPage },
  { path: "/blog-single", component: BlogSingle },
  { path: "/contact", component: PageContact },
  { path: "/about", component: PageAbout },
  { path: "/signup", component: PageSignUp },
  { path: "/login", component: PageLogin },
  { path: "/subscription", component: PageSubcription },
];

// Public routes that don't require authentication
const publicRoutes = ["/login", "/signup"];

const AppContent = () => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();
  const isDeliveryPerson = authService.isDeliveryPerson();
  const hideHeaderPaths = ["/login", "/signup"];
  const shouldShowHeader = !hideHeaderPaths.includes(location.pathname);

  // If user is not authenticated and tries to access protected route, redirect to login
  if (!isAuthenticated && !publicRoutes.includes(location.pathname)) {
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated and tries to access login/signup, redirect to home
  if (isAuthenticated && publicRoutes.includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  // If user tries to access admin page without admin role, show unauthorized page
  if (location.pathname === "/admin" && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If user tries to access delivery page without delivery person or admin role, show unauthorized page
  if (location.pathname === "/delivery" && !isDeliveryPerson && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <>
      <Toaster />
      <ScrollToTop />
      {shouldShowHeader && <SiteHeader />}
      <Routes>
        {pages.map(({ component: Component, path }, index) => {
          // List of paths that require authentication
          const protectedPaths = [
            "/account",
            "/account-savelists",
            "/account-change-password",
            "/account-billing",
            "/account-my-order",
            "/cart",
            "/checkout",
          ];

          if (protectedPaths.includes(path)) {
            return (
              <Route
                key={index}
                path={path}
                element={
                  isAuthenticated ? (
                    <Component />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            );
          }

          return <Route key={index} element={<Component />} path={path} />;
        })}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurant-admin"
          element={
            <ProtectedRoute requireRestaurantAdmin>
              <RestaurantAdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurant-orders"
          element={
            <ProtectedRoute requireRestaurantAdmin>
              <RestaurantOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/delivery"
          element={
            <ProtectedRoute requireDeliveryPerson>
              <DeliveryPage />
            </ProtectedRoute>
          }
        />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route element={<Page404 />} />
      </Routes>
    </>
  );
};

const MyRoutes = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default MyRoutes;

export type LocationStates = {
  "/"?: {};
  "/#"?: {};
  "/login"?: {};
  "/signup"?: {};
  "/forgot-pass"?: {};
  "/page-author"?: {};
  "/account"?: {};
  "/account-my-order"?: {};
  "/account-savelists"?: {};
  "/account-change-password"?: {};
  "/account-billing"?: {};
  "/account-my-order/:id"?: {};
  "/cart"?: {};
  "/checkout"?: {};
  "/home2"?: {};
  "/home3"?: {};
  "/page-collection"?: {};
  "/page-collection-2"?: {};
  "/page-product-detail/:id"?: {};
  "/page-search"?: {};
  "/page-shopping-cart"?: {};
  "/page-404"?: {};
  "/subscription"?: {};
  "/admin"?: {};
  "/unauthorized"?: {};
  "/restaurant-admin"?: {};
  "/delivery"?: {};
};
