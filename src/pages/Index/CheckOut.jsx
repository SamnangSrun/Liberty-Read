import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSpinner, FaCreditCard, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { request } from "../../utils/request";
import { profileStore } from "../../store/Pfile_store";
import { config } from "../../utils/config";

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = profileStore();
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  // Get order ID and cart items from navigation state
  const orderId = state?.orderId;
  const cartItems = state?.cartItems || [];

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    country: "Cambodia",
    street_address: "",
    town_city: "",
    state_county: "",
    postcode: "",
    order_notes: "",
    payment_method: "",
    visa_card_number: "",
    visa_expiry_date: "",
    visa_cvc: "",
  });

  // Calculate totals from cart items
  const subtotal = cartItems
    .reduce((sum, item) => {
      return sum + parseFloat(item.price) * item.quantity;
    }, 0)
    .toFixed(2);

  const total = subtotal;

  // Format card number as user types (4111 1111 1111 1111)
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  // Format expiry date as user types (MM/YY)
  const formatExpiryDate = (value) => {
    const v = value.replace(/[^0-9]/g, "");
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return value;
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "visa_card_number") {
      formattedValue = formatCardNumber(value);
    } else if (name === "visa_expiry_date") {
      formattedValue = formatExpiryDate(value);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }

    // Redirect if no order ID is provided
    if (!orderId) {
      toast.error("No order found");
      navigate("/cart");
    }
  }, [user, orderId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.payment_method) {
      toast.error("Please select a payment method");
      return false;
    }

    if (formData.payment_method === "card") {
      if (
        !formData.visa_card_number ||
        formData.visa_card_number.replace(/\s/g, "").length !== 16
      ) {
        toast.error("Please enter a valid 16-digit card number");
        return false;
      }

      if (
        !formData.visa_expiry_date ||
        !/^\d{2}\/\d{2}$/.test(formData.visa_expiry_date)
      ) {
        toast.error("Please enter a valid expiry date (MM/YY)");
        return false;
      }

      if (!formData.visa_cvc || formData.visa_cvc.length < 3) {
        toast.error("Please enter a valid CVC (3 digits)");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setProcessingPayment(true);

      // Prepare payment data according to API spec
      const paymentData = {
        order_id: orderId,
        payment_method: formData.payment_method,
        payment_status:
          formData.payment_method === "cash" ? "pending" : "completed",
        transaction_id:
          formData.payment_method === "card"
            ? `TX${Math.random().toString().slice(2, 10)}`
            : null,
        first_name: formData.first_name,
        last_name: formData.last_name,
        country: formData.country,
        street_address: formData.street_address,
        town_city: formData.town_city,
        state_county: formData.state_county,
        postcode: formData.postcode,
        phone: formData.phone,
        email: formData.email,
        order_notes: formData.order_notes,
        ...(formData.payment_method === "card" && {
          visa_card_number: formData.visa_card_number.replace(/\s/g, ""),
          visa_expiry_date: formData.visa_expiry_date,
          visa_cvc: formData.visa_cvc,
        }),
      };

      // Process payment through API
      const paymentResponse = await request("payments", "post", paymentData);

      setPaymentDetails(paymentResponse);
      setPaymentSuccess(true);

      // Clear both cart and order after successful payment
      // await Promise.all([
      //   request('cart/clear', 'delete'),
      //   request(`orders/${orderId}/clear`, 'delete') // Assuming you have an endpoint to clear orders
      // ]);

      toast.success("Payment processed successfully! Order cleared.");
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error(error.response?.data?.message || "Failed to process payment");
    } finally {
      setProcessingPayment(false);
    }
  };

  if (paymentSuccess && paymentDetails) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        
        <div className="mb-6 text-green-500">
          <FaCheckCircle className="w-16 h-16 mx-auto" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>

        <div className="bg-white p-6 rounded-lg shadow-sm text-left mb-6">
          <h2 className="text-xl font-semibold mb-4">Payment Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-600">Order Number</p>
              <p className="font-medium">#{orderId}</p>
            </div>
            <div>
              <p className="text-gray-600">Date</p>
              <p className="font-medium">{new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Payment Method</p>
              <p className="font-medium capitalize">
                {paymentDetails.payment?.payment_method}
              </p>
            </div>

            <div>
              <p className="text-gray-600">Status</p>
              <p className="font-medium capitalize">
                {paymentDetails.payment?.payment_status}
              </p>
            </div>

            <div>
              <p className="text-gray-600">Note</p>
              <p className="font-medium capitalize">
                {paymentDetails.payment?.order_notes}
              </p>
            </div>
          </div>

          {paymentDetails.transaction_id && (
            <div className="mb-4">
              <p className="text-gray-600">Transaction ID</p>
              <p className="font-medium">{paymentDetails.transaction_id}</p>
            </div>
          )}

          <h3 className="text-lg font-semibold mt-6 mb-2">Order Summary</h3>
          <div className="border-t pt-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-3 p-2 border-b">
                <div className="flex-shrink-0">
                  <img
                    src={`${config.book_image_path}${item.book.cover_image}`}
                    alt={item.book.name}
                    className="w-12 h-16 rounded-sm object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">
                    {item.book.name}
                  </h3>
                  <p className="text-gray-600 text-xs truncate">
                    {item.book.author}
                  </p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="font-bold text-[#102249] text-sm">
                      ${item.price} × {item.quantity}
                    </span>
                    <span className="font-bold text-sm">
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
        </div>
         

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="bg-white border border-[#102249] text-[#102249] px-6 py-3 rounded-lg hover:bg-gray-50"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate("/order-history")}
            className="bg-[#102249] text-white px-6 py-3 rounded-lg hover:bg-[#102259]"
          >
            View Order History
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6">Complete Payment</h1>
           
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Payment Details Form */}
        <div className="lg:w-2/3">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-6">Payment Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block mb-2">First Name *</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Last Name *</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block mb-2">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 border rounded"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-3 border rounded"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2">Country / Region *</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full p-3 border rounded"
                required
              >
                <option value="Cambodia">Cambodia</option>
                <option value="USA">United States</option>
                <option value="UK">United Kingdom</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block mb-2">Street Address *</label>
              <input
                type="text"
                name="street_address"
                value={formData.street_address}
                onChange={handleInputChange}
                className="w-full p-3 border rounded"
                placeholder="House number and street name"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block mb-2">Town / City *</label>
                <input
                  type="text"
                  name="town_city"
                  value={formData.town_city}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">State / County *</label>
                <input
                  type="text"
                  name="state_county"
                  value={formData.state_county}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block mb-2">Postcode *</label>
              <input
                type="text"
                name="postcode"
                value={formData.postcode}
                onChange={handleInputChange}
                className="w-full p-3 border rounded"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2">Order Notes (Optional)</label>
              <textarea
                name="order_notes"
                value={formData.order_notes}
                onChange={handleInputChange}
                className="w-full p-3 border rounded"
                rows="3"
                placeholder="Any special instructions..."
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2">Payment Method *</label>

              {/* Cash on Delivery Option */}
              <div className="border rounded p-4 mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="payment_method"
                    value="cash"
                    checked={formData.payment_method === "cash"}
                    onChange={handleInputChange}
                    className="mr-2"
                    required
                  />
                  <span className="font-medium">Cash on Delivery</span>
                </label>
                <p className="mt-2 text-gray-600 ml-6">
                  Pay with cash or bank transfer upon delivery.
                </p>
              </div>

              {/* Card Payment Option */}
              <div className="border rounded p-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="payment_method"
                    value="card"
                    checked={formData.payment_method === "card"}
                    onChange={handleInputChange}
                    className="mr-2"
                    required
                  />
                  <span className="font-medium flex items-center">
                    <FaCreditCard className="mr-2" /> Credit/Debit Card
                  </span>
                </label>

                {formData.payment_method === "card" && (
                  <div className="mt-4 ml-6 space-y-4">
                    <div>
                      <label className="block mb-2">Card Number</label>
                      <input
                        type="text"
                        name="visa_card_number"
                        value={formData.visa_card_number}
                        onChange={handleCardInputChange}
                        className="w-full p-3 border rounded"
                        placeholder="4111 1111 1111 1111"
                        maxLength="19"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2">Expiry Date</label>
                        <input
                          type="text"
                          name="visa_expiry_date"
                          value={formData.visa_expiry_date}
                          onChange={handleCardInputChange}
                          className="w-full p-3 border rounded"
                          placeholder="MM/YY"
                          maxLength="5"
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-2">CVC</label>
                        <input
                          type="text"
                          name="visa_cvc"
                          value={formData.visa_cvc}
                          onChange={handleCardInputChange}
                          className="w-full p-3 border rounded"
                          placeholder="123"
                          maxLength="3"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={processingPayment || !formData.payment_method}
              className={`w-full bg-[#102249] text-white py-3 rounded-lg ${
                processingPayment || !formData.payment_method
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#102259]"
              }`}
            >
              {processingPayment ? (
                <span className="flex items-center justify-center">
                  <FaSpinner className="animate-spin mr-2" />
                  Processing...
                </span>
              ) : (
                "Complete Payment"
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            <div className="mb-4">
              <h3 className="font-normal">
                You have{" "}
                {cartItems.reduce((total, item) => total + item.quantity, 0)}{" "}
                items in your order
              </h3>
            </div>

            {cartItems.length > 0 ? (
              <>
                <div className="border-b pb-4 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between mb-3">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <img
                            src={`${config.book_image_path}${item.book.cover_image}`}
                            alt={item.book.name}
                            className="w-12 h-16 rounded-sm object-cover"
                          />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">
                            {item.book?.name || item.product?.name} ×{" "}
                            {item.quantity}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.book?.author || ""}
                          </p>
                        </div>
                      </div>

                      <p className="font-medium">
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-b pb-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                </div>

                <div className="flex justify-between font-bold text-lg mb-6">
                  <span>Total</span>
                  <span>${total}</span>
                </div>

                <div className="mt-4 text-sm text-gray-500">
                  <p>
                    By completing your purchase, you agree to our Terms of
                    Service.
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No items found</p>
                <button
                  onClick={() => navigate("/")}
                  className="text-[#102249] hover:underline"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
