import { Fruit } from './fruit';

/* 
 * Controller for fruit rack
 * This could be a service through dependency injection
 */
export class FruitRackController {
  private rack: Fruit[] = [];
  
  constructor() {
    this.setupRack();
  }
  
  /* 
   * Return copy of rack
   */
  public getProducts(): Fruit[] {
    return this.rack.slice(0);
  }
  
  /* Private */
  /* 
   * Load content to rack 
   * Using static content now
   */
  private setupRack(): void {
    this.rack = [
      {
        id: '1',
        name: 'Conchita Bananas'
      },
      {
        id: '2',
        name: 'Red star apple'
      },
      {
        id: '3',
        name: 'Green diamond'
      },
      {
        id: '4',
        name: 'Havanna sugar melone'
      }
    ];
  }

}