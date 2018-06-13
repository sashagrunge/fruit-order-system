"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = __importStar(require("lodash"));
/*
 * Controller of the cart
 * This should be a service through dependency injection
 */
var CartController = /** @class */ (function () {
    function CartController() {
        this.cart = [];
    }
    /*
     * Add item to cart
     * - add new item
     * - update quantity if item is added already
     * TODO: Test case for both situation
     */
    CartController.prototype.addItem = function (order) {
        if (!order || !order.productID || !order.quantity || order.quantity === 0) {
            return new Error('400');
        }
        var item = _.find(this.cart, { productID: order.productID });
        if (item) {
            // Update item quantity in cart
            item.quantity += order.quantity;
        }
        else {
            // Add new item to cart
            this.cart.push(order);
        }
        this.updateCartOrder();
        return true;
    };
    /*
     * Remove item from cart
     * - remove item
     * TODO: Test case
     */
    CartController.prototype.removeItem = function (order) {
        if (!order || !order.productID || !order.quantity) {
            return new Error('400');
        }
        var itemIndex = _.findIndex(this.cart, { productID: order.productID });
        if (itemIndex < 0) {
            return new Error('404');
        }
        // Update quantity
        var item = this.cart[itemIndex];
        item.quantity -= order.quantity;
        if (item.quantity <= 0) {
            // Remove item from cart
            _.pullAt(this.cart, itemIndex);
        }
        this.updateCartOrder();
        return true;
    };
    /*
     * Get item count in cart
     */
    CartController.prototype.getCartItemCount = function () {
        return this.cart.length;
    };
    /*
     * Get a copy of cart
     */
    CartController.prototype.getCartContent = function () {
        return this.cart.slice(0);
    };
    /*
     * Order cart item
     * - order by productID
     */
    CartController.prototype.updateCartOrder = function () {
        this.cart = _.sortBy(this.cart, ['productID']);
    };
    return CartController;
}());
exports.CartController = CartController;
