// schemas/newsletter.js
export default {
    name: 'orders',
    title: 'Orders',
    type: 'document',
    fields: [
        {
            name: 'ord_id',
            title: 'Order ID',
            type: 'string',
        },
        {
            name: 'cust_id',
            title: 'Customer ID',
            type: 'string',
        },
        {
            name: 'product_id',
            title: 'Product ID',
            type: 'string',
        },
        {
            name: 'qty_product',
            title: 'Product Qty',
            type: 'string',
        },
        {
            name: 'product_price',
            title: 'Product Price',
            type: 'string',
        },

    ],
}