// schemas/userLogin.ts

import { Rule } from '@sanity/types'

export default {
  name: 'userLogin',
  title: 'User Login',
  type: 'document',
  fields: [
    {
      name: 'full_name',
      title: 'Full Name',
      type: 'string'
    },
    {
      name: 'username',
      title: 'Username',
      type: 'string',
      validation: (Rule: Rule) =>
        Rule.required().min(3).max(20).error('Username must be between 3 and 20 characters'),
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule: Rule) =>
        Rule.required().email().error('A valid email address is required'),
    },
    {
      name: 'password',
      title: 'Password',
      type: 'string',
      validation: (Rule: Rule) =>
        Rule.required().min(8).error('Password must be at least 8 characters long'),
    },
    {
      name: 'lastLogin',
      title: 'Last Login',
      type: 'datetime',
      description: 'Timestamp of the last login',
      validation: (Rule: Rule) => Rule.optional(),
    },
    {
      name: 'cartItems',
      title: 'Items In Cart',
      type: 'array',
      of: [
          {
              type: 'string',
          },
      ],      
    },
    {
      name: 'wishItems',
      title: 'Items In Wislist',
      type: 'array',
      of: [
          {
              type: 'string',
          },
      ],      
    },
    {
      name: 'phone',
      title: 'Cell Number',
      type: 'string',
      validation: (Rule: Rule) =>
        Rule.required()
          .min(10) // Minimum length for a phone number (e.g., for international format like "+1234567890")
          .max(15) // Maximum length for a phone number (e.g., to accommodate country codes)
          .regex(/^[+]?[0-9]{10,15}$/, { name: 'phone number', invert: false }) // Validates a phone number with an optional '+' at the beginning and 10-15 digits
          .error('Phone number must be between 10 and 15 digits and may include an optional "+" at the start'),
    },
    {
      name: 'address',
      title: 'Shipping Address',
      type: 'string',
      validation: (Rule: Rule) =>
        Rule.required()
          .min(5) // Minimum length of 5 characters for a meaningful address
          .max(100) // Maximum length for an address, which can be quite long
          .error('Address must be between 5 and 100 characters'),
    },
    {
      name: 'city',
      title: 'City',
      type: 'string',
      validation: (Rule: Rule) =>
        Rule.required()
          .min(2) // Minimum of 2 characters for a valid city name
          .max(50) // Maximum of 50 characters for city name
          .error('City name must be between 2 and 50 characters'),
    },
    {
      name: 'postal',
      title: 'Postal Code',
      type: 'string',
    },
  ],
}
