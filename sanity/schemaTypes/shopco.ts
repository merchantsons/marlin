import { Rule } from '@sanity/types';
export default {
    name: 'shopco',
    type: 'document',
    title: 'shopco',
    fields: [
        {
            name: 'id',
            type: 'string',
            title: 'Product Store Id',
        },
        {
            name: 'gender',
            title: 'For',
            type: 'string',
            options: {
              list: [
                { title: 'Mens', value: 'mens' },
                { title: 'Womens', value: 'womens' },
                { title: 'Boys', value: 'boys' },
                { title: 'Girls', value: 'girls' },
                { title: 'Toddlers', value: 'toddlers' },
              ],
              layout: 'dropdown'
            },
        },
        {
            name: 'type',
            title: 'Categories',
            type: 'string',
            options: {
              list: [
                { title: 'Shirt Full Sleevs', value: 'shirt-fs' },
                { title: 'Shirt Half Sleevs', value: 'shirt-hs' },
                { title: 'T-Shirt', value: 't-shirt' },
                { title: 'Hoodies', value: 'hoodies' },
                { title: 'Shoes', value: 'shoes' },
                { title: 'Sneackers', value: 'sneackers' },
                { title: 'Frock', value: 'frock' },
                { title: 'Pants', value: 'pants' },                
              ],
              layout: 'dropdown'
            },
        },
        {
            name: 'title',
            type: 'string',
            title: 'Product Title',
        },
        {
            name: 'price',
            type: 'string',
            title: 'Orignal Price (Before Discount)',
        },
        {
            name: 'rate',
            type: 'string',
            title: 'Rating',
        },
        {
            name: 'reviews',
            type: 'string',
            title: 'Total Reviews',
        },
        {
            name: 'discount',
            type: 'string',
            title: 'Percent of Discount'
        },
        {
            name: 'discPrice',
            type: 'string',
            title: 'After Discount Price'
        },
        {
            name: 'image1',
            type: 'image',
            title: 'Product Image 1'
        },
        {
            name: 'image2',
            type: 'image',
            title: 'Product Image 2'
        },
        {
            name: 'image3',
            type: 'image',
            title: 'Product Image 3'
        },
        {
            name: 'image4',
            type: 'image',
            title: 'Product Image 4'
        },
        {
            title: 'Available Colors',
            name: 'colors',
            type: 'array',
            of: [
                {
                    type: 'reference',
                    to: [
                        { type: 'colors' },
                    ]
                }
            ]
        },
        {
            title: 'Available Sizes',
            name: 'sizes',
            type: 'array',
            of: [
                {
                    type: 'reference',
                    to: [
                        { type: 'sizes' },
                    ]
                }
            ]
        },
        // {
        //     name: "colors",
        //     title: "Colors",
        //     type: "array",
        //     of: [{ type: "string" }],
        // },
        // {
        //     name: "sizes",
        //     title: "Sizes",
        //     type: "array",
        //     of: [{ type: "string" }],
        // },
        {
            title: 'Article Details', 
            name: 'details',
            type: 'array', 
            of: [{type: 'block'}]
        },
        {
            name: 'qty',
            type: 'string',
            title: 'Available Quantity'
        },
        {
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [
                {
                    type: 'string',
                },
            ],
            options: {
                layout: 'tags', // Displays tags as clickable items
            },
        },
        {
            name: "isNew", // Changed 'new' to 'isNew' to avoid conflict with the keyword `new`
            type: "boolean",
            title: "New",
        },
    ],
}
