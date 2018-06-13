"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var readline = __importStar(require("readline"));
var _ = __importStar(require("lodash"));
var cart_1 = require("../cart");
var fruit_rack_1 = require("../fruit-rack");
/*
 * Controller of the shop
 * This is supposed to be a smart component
 */
var ShopController = /** @class */ (function () {
    function ShopController() {
        this.products = [];
        this.cart = new cart_1.CartController();
        this.newline = '\r\n';
        this.loadProducts();
        this.createIOInteface();
        this.openShop();
    }
    /*
     * Create interface for ostream and istream
     */
    ShopController.prototype.createIOInteface = function () {
        this.ioInterface = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: ''
        });
    };
    /*
     * Load products
     * - We sell only fruit
     */
    ShopController.prototype.loadProducts = function () {
        var fruitRack = new fruit_rack_1.FruitRackController();
        this.products = fruitRack.getProducts();
    };
    /*
     * Open shop
     * - list product
     * - allow user to make/update order
     */
    ShopController.prototype.openShop = function () {
        var shopMessage = "\n\n===============================================================\nHello, welcome to the fruit shop. These are what we have today:\n===============================================================\n\n";
        for (var _i = 0, _a = this.products; _i < _a.length; _i++) {
            var product = _a[_i];
            shopMessage += product.id + ') ' + product.name + this.newline;
        }
        shopMessage += this.newline;
        this.ioInterface.write(shopMessage);
        this.serveCustomer();
    };
    /*
     * List services
     */
    ShopController.prototype.serveCustomer = function () {
        var _this = this;
        if (this.cart.getCartItemCount() === 0) {
            // Cart is empty, encourage user to order
            this.placeOrder();
        }
        else {
            this.ioInterface.question('What I can do for you? add items, remove items, view cart or leave? (A/R/V/L)', function (action) {
                action = action.toUpperCase();
                switch (action) {
                    case 'A':
                        _this.placeOrder();
                        break;
                    case 'R':
                        _this.cancelOrder();
                        break;
                    case 'V':
                        _this.viewCart();
                        _this.serveCustomer();
                        break;
                    case 'L':
                        _this.destory();
                        break;
                    default:
                        _this.serveCustomer();
                }
            });
        }
    };
    /*
     * listen to order
     */
    ShopController.prototype.placeOrder = function () {
        var _this = this;
        var fruitID;
        var quantity;
        // Request item
        this.requestOrderItem()
            .then(function (input) {
            fruitID = input;
            // Request quantity
            return _this.requestOrderQuantity();
        })
            .then(function (input) {
            quantity = input;
            // Submit order
            _this.submitOrder(fruitID, quantity);
        });
    };
    /*
     * Cancel order
     */
    ShopController.prototype.cancelOrder = function () {
        var _this = this;
        var fruitID;
        var quantity;
        // Request item
        this.requestOrderItem()
            .then(function (input) {
            fruitID = input;
            // Request quantity
            return _this.requestOrderQuantity();
        })
            .then(function (input) {
            quantity = input;
            // Submit order
            _this.submitCancel(fruitID, quantity);
        });
    };
    /*
     * Get item of the order
     * - validate input
     */
    ShopController.prototype.requestOrderItem = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.ioInterface.question('Item (Please type in the number): ', function (fruitID) {
                if (_this.isNumberValidator(fruitID) && _this.productIDValidator(fruitID)) {
                    resolve(fruitID);
                }
                else {
                    _this.requestOrderItem().then(function (input) { return resolve(input); });
                }
            });
        });
        return promise;
    };
    /*
     * Get order quantity of the item
     * - validate input
     */
    ShopController.prototype.requestOrderQuantity = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.ioInterface.question('Quantity (Please type in the number): ', function (quantity) {
                if (_this.isNumberValidator(quantity)) {
                    resolve(parseInt(quantity));
                }
                else {
                    _this.requestOrderQuantity().then(function (input) { return resolve(input); });
                }
            });
        });
        return promise;
    };
    /*
     * number validation
     * - validate input is number
     */
    ShopController.prototype.isNumberValidator = function (input) {
        var isNumberExp = /[0-9]+/;
        return !!isNumberExp.exec(input);
    };
    /*
     * item id validation
     * - check if the item with the id exist
     */
    ShopController.prototype.productIDValidator = function (input) {
        return _.find(this.products, { 'id': input });
    };
    /*
     * Submit order
     */
    ShopController.prototype.submitOrder = function (fruitID, quantity) {
        var _this = this;
        var response = this.cart.addItem({
            productID: fruitID,
            quantity: quantity
        });
        if (response instanceof Error) {
            this.handleError(response);
        }
        else {
            this.viewCart();
            var successMessage = "\n\nItems added to cart.  \n\n";
            this.ioInterface.write(successMessage);
        }
        setTimeout(function () { return _this.openShop(); }, 800);
    };
    /*
     * Submit cancel
     */
    ShopController.prototype.submitCancel = function (fruitID, quantity) {
        var _this = this;
        var response = this.cart.removeItem({
            productID: fruitID,
            quantity: quantity
        });
        if (response instanceof Error) {
            this.handleError(response);
        }
        else {
            this.viewCart();
            var successMessage = "\n\nItems removed from cart.  \n\n";
            this.ioInterface.write(successMessage);
        }
        setTimeout(function () { return _this.openShop(); }, 800);
    };
    /*
     * Print cart content
     */
    ShopController.prototype.viewCart = function () {
        var cart = this.cart.getCartContent();
        var column = 27;
        var cartMessage = "\n\n+-----------------------------+\n| Cart                        |\n+-----------------------------+";
        if (cart.length === 0) {
            cartMessage += '| Cart is empty.              |';
        }
        else {
            for (var _i = 0, cart_2 = cart; _i < cart_2.length; _i++) {
                var item = cart_2[_i];
                var product = _.find(this.products, { id: item.productID });
                if (product) {
                    var value = product.name + ('                       x ' + item.quantity).slice((column - product.name.length) * -1);
                    cartMessage += this.newline + '| ' + value + ' |';
                }
            }
        }
        cartMessage += "\n+-----------------------------+\n";
        this.ioInterface.write(cartMessage);
    };
    /*
     * Print error
     */
    ShopController.prototype.handleError = function (error) {
        var errorMessage = "\n\nOps!, something happened, please try again.  \n\n";
        if (error.message === "404") {
            errorMessage = "\n\nSorry, cannot find item in cart.  \n\n";
        }
        this.ioInterface.write(errorMessage);
    };
    /*
     * Destory app
     */
    ShopController.prototype.destory = function () {
        this.ioInterface.close();
        process.exit();
    };
    return ShopController;
}());
exports.ShopController = ShopController;
