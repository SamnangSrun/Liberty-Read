import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.jsx";
import AboutUs from "./pages/Index/AboutUs.jsx";
// import ReadingBook from "./pages/ReadingBook.jsx";
// import Books from "./pages/Books.jsx";

import Contact from "./pages/Index/Contact.jsx";
import SignIn from "./pages/Index/SignIn.jsx";
import SignUp from "./pages/Index/SignUp.jsx";
// import Detail from "./pages/Detail.jsx";
import BookDetail from "./pages/Index/BookDetail.jsx";
import NotFound from "./pages/Index/NotFound.jsx"; 

import Home from "./pages/Index/Home.jsx"; 
import ChildrenBook from "./pages/Index/ChildrenBook.jsx"; 

// import Shop from "./pages/Shop.jsx"; 
import CheckOut from "./pages/Index/CheckOut.jsx"; 
import EditProfileForm from "./pages/Index/Edit.jsx"; 
import Books from "./pages/Index/Books.jsx"; 

//index
import MainLayout from "./Layout/MainLayout.jsx";
import NonFiction from ".//pages/Index/NonFiction.jsx";
import Fiction from ".//pages/Index/Fiction.jsx";
import Health  from ".//pages/Index/Health.jsx";
import OrderHistory  from ".//pages/Index/OrderHistory.jsx";
import SellerStep  from ".//Components/Seller/SellerStep.jsx";
import Notifications  from ".//Components/Index/Notifications.jsx";



//admin
import RequestBook from "./Components/Admin/RequestBook.jsx"; 
import ViewBook from "./Components/Admin/ViewBook.jsx"; 
import CategoryManagement from "./Components/Admin/CategoryManagement.jsx"; 
import ViewOrder from "./Components/Admin/ViewOrder.jsx"; 
import OrderStatus from "./Components/Admin/OrderStatus.jsx"; 
import RequestSeller from "./Components/Admin/RequestSeller.jsx"; 
import SellerStatus from "./Components/Admin/SellerStatus.jsx"; 
import CustomerManagement from "./Components/Admin/CustomerManagement.jsx"; 
import AddSeller from "./Components/Admin/AddSeller.jsx"; 
import AdminLayout from "./Layout/AdminLayout.jsx"; 

//seller
import Seller from "./Layout/Seller.jsx"; 
import BookManagement from "./Components/Seller/BookManagement.jsx";
import AddBook from "./Components/Seller/AddBook.jsx";
import EditBook from "./Components/Seller/EditBook.jsx";
import Order from "./Components/Seller/OrderStatus.jsx";
import View from "./Components/Seller/ViewOrder.jsx";


// Define the routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // MainLayout for general app content
    children: [
      { path: "/", element: <App /> }, // Home page
      { path: "/home", element: <Home /> },
      { path: "/books", element: <Books /> },
      { path: "/about", element: <AboutUs /> },
      { path: "/children", element: <ChildrenBook /> },
      { path: "/non-fiction", element: <NonFiction /> },
      { path: "/fiction", element: <Fiction /> },
      { path: "/health-lifestyle", element: <Health  /> },
      { path: "/checkout", element: <CheckOut /> },
      { path: "/seller-step", element: <SellerStep /> },
      { path: "/edit-profile", element: <EditProfileForm /> },
      { path: "/notifications", element: <Notifications /> },
      { path: "/book-details/:id", element: <BookDetail />} ,
      { path: "/order-history", element: <OrderHistory />} ,
     
      
      // { path: "/reading", element: <ReadingBook /> },
      { path: "/contact", element: <Contact /> },
      // { path: "/bookdetail", element: <BookDetail /> },
      // { path: "/details/:id", element: <Detail /> },
      { path: "*", element: <NotFound /> }, // Catch-all for unmatched routes
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />, // Use AdminLayout for admin pages
    children: [
      { path: "/admin/category-management", element: <CategoryManagement /> }, // Corrected to relative path
      { path: "/admin/request-book", element: <RequestBook /> }, // Corrected to relative path
      { path: "/admin/view-book", element: <ViewBook /> }, // Corrected to relative path
      { path: "/admin/view-order", element: <ViewOrder /> }, // Corrected to relative path
      { path: "/admin/order-status", element: <OrderStatus /> }, // Corrected to relative path
      { path: "/admin/request-seller", element: <RequestSeller /> }, // Corrected to relative path
      { path: "/admin/seller-status", element: <SellerStatus /> }, // Corrected to relative path
      { path: "/admin/customer-management", element: <CustomerManagement /> }, // Corrected to relative path
      { path: "/admin/add-seller", element: <AddSeller /> }, // Corrected to relative path
      // Add other admin-related routes here
    ],
  },
  {
    path: "/seller",
    element: < Seller/>, // Use AdminLayout for admin pages
    children: [
      { path: "/seller/book-management", element: <BookManagement /> }, // Corrected to relative path
      { path: "/seller/add-book", element: <AddBook /> }, // Corrected to relative path
      { path: "/seller/edit-book/:id", element: <EditBook /> }, // Corrected to relative path
      { path: "/seller/order-status", element: <Order /> }, // Corrected to relative path
      { path: "/seller/view-order", element: <ViewOrder /> }, // Corrected to relative path
      // { path: "/admin/request-seller", element: <RequestSeller /> }, // Corrected to relative path
      // { path: "/admin/seller-status", element: <SellerStatus /> }, // Corrected to relative path
      // { path: "/admin/customer-management", element: <CustomerManagement /> }, // Corrected to relative path
      // { path: "/admin/add-seller", element: <AddSeller /> }, // Corrected to relative path
      // Add other admin-related routes here
    ],
  },
  { path: "/signin", element: <SignIn /> }, // Login page
  { path: "/signup", element: <SignUp /> }, // Register page
]);

// Render the app
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);