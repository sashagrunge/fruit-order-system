import * as readline from 'readline';
import * as _ from 'lodash';
import { Product } from '../models';
import { CartItem, CartController } from '../cart';
import { FruitRackController } from '../fruit-rack';

/* 
 * Controller of the shop
 * This is supposed to be a smart component
 */
export class ShopController {
  
  private products: Product[] = [];
  private ioInterface;
  private cart: CartController = new CartController();
  private readonly newline = '\r\n';
  
  constructor() {
    this.loadProducts();
    this.createIOInteface();
    this.openShop();
  }
  /*
   * Create interface for ostream and istream
   */
  private createIOInteface(): void {
    this.ioInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: ''
    });
  }
  /*
   * Load products
   * - We sell only fruit
   */
  private loadProducts(): void {
    let fruitRack = new FruitRackController();
    this.products = fruitRack.getProducts();
  }
  /*
   * Open shop
   * - list product
   * - allow user to make/update order
   */
  private openShop(): void {
    let shopMessage = `

===============================================================
Hello, welcome to the fruit shop. These are what we have today:
===============================================================

`; 
    for (const product of this.products) {
       shopMessage += product.id + ') ' + product.name + this.newline;
    }
    shopMessage += this.newline;
    this.ioInterface.write(shopMessage);
    this.serveCustomer();
  }
  /* 
   * List services
   */
  private serveCustomer(): void {
    if (this.cart.getCartItemCount() === 0) {
      // Cart is empty, encourage user to order
      this.placeOrder();
    } else {
      this.ioInterface.question('What I can do for you? add items, remove items, view cart or leave? (A/R/V/L)', (action) => {
        action = action.toUpperCase();
        switch (action) {
          case 'A':
            this.placeOrder();
            break;
          case 'R':
            this.cancelOrder();
            break;
          case 'V':
            this.viewCart();
            this.serveCustomer();
            break;
          case 'L':
            this.destory();
            break;
          default:
            this.serveCustomer();
        }
      });
    }
  }
  /*
   * listen to order
   */
  private placeOrder(): void {
    let fruitID: string;
    let quantity: number;
    // Request item
    this.requestOrderItem()
    .then((input) => {
      fruitID = input;
      // Request quantity
      return this.requestOrderQuantity();
    })
    .then((input) => {
      quantity = input;
      // Submit order
      this.submitOrder(fruitID, quantity);
    });
  }
  /*
   * Cancel order
   */
  private cancelOrder(): void {
    let fruitID: string;
    let quantity: number;
    // Request item
    this.requestOrderItem()
    .then((input) => {
      fruitID = input;
      // Request quantity
      return this.requestOrderQuantity();
    })
    .then((input) => {
      quantity = input;
      // Submit order
      this.submitCancel(fruitID, quantity);
    });
  }
  /*
   * Get item of the order
   * - validate input
   */
  private requestOrderItem(): Promise<string> {
    const promise = new Promise<string>((resolve, reject) => {
      this.ioInterface.question('Item (Please type in the number): ', (fruitID) => {
        if(this.isNumberValidator(fruitID) && this.productIDValidator(fruitID)) {
          resolve(fruitID);
        } else {
          this.requestOrderItem().then(input => resolve(input));
        }
      });
    });
    return promise;
  }
  /*
   * Get order quantity of the item
   * - validate input
   */
  private requestOrderQuantity(): Promise<number> {
    const promise = new Promise<number>((resolve, reject) => {
      this.ioInterface.question('Quantity (Please type in the number): ', (quantity) => {
        if(this.isNumberValidator(quantity)) {
          resolve(parseInt(quantity));
        } else {
          this.requestOrderQuantity().then(input => resolve(input));
        }
      });
    });
    return promise;

  }
  /*
   * number validation
   * - validate input is number
   */
  private isNumberValidator(input: string): boolean {
    let isNumberExp = /[0-9]+/;
    return !!isNumberExp.exec(input);
  }
  /*
   * item id validation
   * - check if the item with the id exist
   */
  private productIDValidator(input: string): boolean {
    return _.find(this.products, {'id': input});
  }
  /*
   * Submit order
   */
  private submitOrder(fruitID: string, quantity: number): void {
    const response = this.cart.addItem({
      productID: fruitID,
      quantity
    });
    if (response instanceof Error) {
      this.handleError(response);
    } else {
      this.viewCart();
      let successMessage = `

Items added to cart.  

`;
      this.ioInterface.write(successMessage);
    }
    setTimeout(() => this.openShop(), 800);
  }
  /*
   * Submit cancel
   */
  private submitCancel(fruitID: string, quantity: number): void {
    const response = this.cart.removeItem({
      productID: fruitID,
      quantity
    });
    if (response instanceof Error) {
      this.handleError(response);
    } else {
      this.viewCart();
      let successMessage = `

Items removed from cart.  

`;
      this.ioInterface.write(successMessage);
    }
    setTimeout(() => this.openShop(), 800);
  }
  /*
   * Print cart content
   */
  private viewCart(): void {
    const cart = this.cart.getCartContent();
    const column = 27;
    let cartMessage = `

+-----------------------------+
| Cart                        |
+-----------------------------+`;
    if(cart.length === 0) {
      cartMessage += '| Cart is empty.              |';
    } else {
      for(const item of cart) {
        const product = _.find(this.products, {id: item.productID });
        if(product) {
          const value = product.name + ('                       x ' + item.quantity).slice((column - product.name.length) * -1);
          cartMessage += this.newline + '| ' + value + ' |';
        }
      }
    }
    
    cartMessage += `
+-----------------------------+
`;  
    this.ioInterface.write(cartMessage);
  }
  /*
   * Print error
   */
  private handleError(error: Error): void {
    let errorMessage = `

Ops!, something happened, please try again.  

`;
    if (error.message === "404") {
      errorMessage = `

Sorry, cannot find item in cart.  

`;
    }
    this.ioInterface.write(errorMessage);
  }
  /*
   * Destory app
   */
  private destory(): void {
    this.ioInterface.close();
    process.exit();
  }
}