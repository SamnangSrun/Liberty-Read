import { create } from "zustand";

export const profileStore = create((set) => ({
  access_token: localStorage.getItem("access_token") || null,
  user: JSON.parse(localStorage.getItem("user")) || null,
  permission: JSON.parse(localStorage.getItem("permission")) || [],
  editingBook: null,

  funSetAccessToken: (token) => {
    if (token) {
      localStorage.setItem("access_token", token);
    } else {
      localStorage.removeItem("access_token");
    }
    set({ access_token: token });
  },

  funSetUser: (userData) => {
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
    set({ user: userData });
  },

  funSetPermission: (permissions) => {
    if (permissions) {
      localStorage.setItem("permission", JSON.stringify(permissions));
    } else {
      localStorage.removeItem("permission");
    }
    set({ permission: permissions });
  },

  funSetRole: (newRole) => {
    set((state) => {
      if (!state.user) return state;

      const updatedUser = { ...state.user, role: newRole };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return { user: updatedUser };
    });
  },

  funLogout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("permission");
    set({ access_token: null, user: null, permission: [] });
  },

  funSetProfileImage: (imageUrl) => {
    set((state) => {
      const updatedUser = { ...state.user, profile_image: imageUrl };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return { user: updatedUser };
    });
  },

  funSetEditingBook: (book) => {
    set({ editingBook: book });
  },

  funClearEditingBook: () => {
    set({ editingBook: null });
  },
    funFetchUserOrders: async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch("https://test-api-production-dc1a.up.railway.app/api/orders/userOrders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user orders");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching user orders:", error);
      return [];
    }
  },

 
  // ... existing state
  cartCount: parseInt(localStorage.getItem("cart_count")) || 0,

  // Add to Cart function
  funAddToCart: () => {
    set((state) => {
      const newCount = state.cartCount + 1;
      localStorage.setItem("cart_count", newCount);
      return { cartCount: newCount };
    });
  },

  // Set cart count (e.g., if loading from backend)
  funSetCartCount: (count) => {
    localStorage.setItem("cart_count", count);
    set({ cartCount: count });
  },

  // Clear cart (e.g., on logout or checkout)
  funClearCart: () => {
    localStorage.removeItem("cart_count");
    set({ cartCount: 0 });
  },


}));