"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Controller for fruit rack
 * This could be a service through dependency injection
 */
var FruitRackController = /** @class */ (function () {
    function FruitRackController() {
        this.rack = [];
        this.setupRack();
    }
    /*
     * Return copy of rack
     */
    FruitRackController.prototype.getProducts = function () {
        return this.rack.slice(0);
    };
    /* Private */
    /*
     * Load content to rack
     * Using static content now
     */
    FruitRackController.prototype.setupRack = function () {
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
    };
    return FruitRackController;
}());
exports.FruitRackController = FruitRackController;
