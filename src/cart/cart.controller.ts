import * as _ from 'lodash';
import { CartItem } from './cart-item';

/* 
 * Controller of the cart
 * This should be a service through dependency injection
 */
export class CartController {
  
  private cart: CartItem[] = []; 
  
  constructor() {}
  
  /*
   * Add item to cart
   * - add new item
   * - update quantity if item is added already
   * TODO: Test case for both situation
   */
  public addItem(order: CartItem): true | Error {
    if(!order || !order.productID || !order.quantity || order.quantity === 0) {
      return new Error('400');
    }
    const item: CartItem = _.find(this.cart, {productID: order.productID });
    if(item) {
      // Update item quantity in cart
      item.quantity += order.quantity;
    } else {
      // Add new item to cart
      this.cart.push(order);
    }
    this.updateCartOrder();
    return true;
  }
  /*
   * Remove item from cart
   * - remove item
   * TODO: Test case
   */
  public removeItem(order: CartItem): true | Error {
    if(!order || !order.productID || !order.quantity) {
      return new Error('400');
    }
    const itemIndex: number = _.findIndex(this.cart, {productID: order.productID });
    if(itemIndex < 0) {
      return new Error('404');
    }
    // Update quantity
    const item = this.cart[itemIndex];
    item.quantity -= order.quantity;
    if(item.quantity <= 0) {
      // Remove item from cart
      _.pullAt(this.cart, itemIndex);
    }
    
    this.updateCartOrder();
    return true;
  }
  /*
   * Get item count in cart
   */
  public getCartItemCount(): number {
    return this.cart.length;
  }
  /*
   * Get a copy of cart
   */
  public getCartContent(): CartItem[] {
    return this.cart.slice(0);
  }
  /*
   * Order cart item
   * - order by productID
   */
  private updateCartOrder(): void {
    this.cart = _.sortBy(this.cart, ['productID']);
  }
  
}