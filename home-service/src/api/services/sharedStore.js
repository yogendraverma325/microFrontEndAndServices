export const sharedStore = {
  cart: {},

  setCart(userId, cartData) {
    this.cart[userId] = cartData;
  },

  getCart(userId) {
    return this.cart[userId] || null;
  },
};