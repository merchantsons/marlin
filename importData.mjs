import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '',
  dataset: '',
  useCdn: true,
  apiVersion: '',
  token: '',
});

// Function to generate random reviews (like "258", "899", etc.)
function getRandomReviews() {
  return (Math.floor(Math.random() * 1000) + 100).toString();  // Generates a random number between 100 and 999, and converts to string
}

// Function to generate random ratings (like "4.8", "5", "2.9", etc.)
function getRandomRate() {
  return (Math.random() * 3 + 2).toFixed(1);  // Generates a random rating between 2.0 and 5.0 (one decimal)
}

// Function to generate random quantity (1 to 100) and convert it to string
function getRandomQuantity() {
  return (Math.floor(Math.random() * 100) + 1).toString();  // Random number between 1 and 100, converted to string
}

// Function to generate 3 tags based on the product title
function generateTagsFromTitle(title) {
  const words = title.split(' ');
  return words.slice(0, 3); // Get the first 3 words of the title as tags
}

// Function to upload image to Sanity
async function uploadImageToSanity(imageUrl) {
  try {
    console.log(`Uploading image: ${imageUrl}`);

    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${imageUrl}`);
    }

    const buffer = await response.arrayBuffer();
    const bufferImage = Buffer.from(buffer);

    const asset = await client.assets.upload('image', bufferImage, {
      filename: imageUrl.split('/').pop(),
    });

    console.log(`Image uploaded successfully: ${asset._id}`);
    return asset._id;
  } catch (error) {
    console.error('Failed to upload image:', imageUrl, error);
    return null;
  }
}

// Function to upload product to Sanity
async function uploadProduct(product) {
  try {
    const imageId = await uploadImageToSanity(product.imageUrl);

    if (imageId) {
      // Ensure the discountPercent is a string and calculate the discount price correctly
      const discountPercentStr = product.discountPercent.toString(); // Convert discountPercent to string
      const discountAmount = (parseFloat(discountPercentStr) / 100) * product.price;
      const discPrice = (product.price - discountAmount).toFixed(2);  // Fixed the discPrice calculation
      const price = product.price.toFixed(2); // Ensure price is a string

      const document = {
        _type: 'shopco',
        id: product._id,
        title: product.name,
        gender: product.gender,
        price: price,  // Set price as string
        rate: getRandomRate(),  // Assign random rate
        reviews: getRandomReviews(),  // Assign random reviews as a string
        discount: discountPercentStr,  // Set discountPercent as string
        discPrice: discPrice,  // Correct discPrice calculation as a string
        qty: getRandomQuantity(),  // Set random quantity (1 to 100), stored as a string
        tags: generateTagsFromTitle(product.name),  // Extract 3 tags from the title
        image1: {
          _type: 'image',
          asset: {
            _ref: imageId,
          },
        },
        image2: {
          _type: 'image',
          asset: {
            _ref: imageId,
          },
        },
        image3: {
          _type: 'image',
          asset: {
            _ref: imageId,
          },
        },
        image4: {
          _type: 'image',
          asset: {
            _ref: imageId,
          },
        },
        details: [
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: product.description, // Add your plain description here
              },
            ],
          },
        ],

        // details: product.description,
        type: product.category,
        isNew: product.isNew,
        colors: product.colors,
        sizes: product.sizes,
      };

      const createdProduct = await client.create(document);
      console.log(`Product ${product.title} uploaded successfully:`, createdProduct);
    } else {
      console.log(`Product ${product.title} skipped due to image upload failure.`);
    }
  } catch (error) {
    console.error('Error uploading product:', error);
  }
}

// Function to import products starting from a specific ID (e.g., ID 10)
async function importProductsStartingFromId(startingId) {
  try {
    // Fetch products from the API
    const response = await fetch('https://template1-neon-nu.vercel.app/api/products');

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const products = await response.json();

    // Filter products starting from the given ID (e.g., starting from ID 10)
    const productsToImport = products.filter(product => parseInt(product._id, 10) >= startingId);

    if (productsToImport.length > 0) {
      for (const product of productsToImport) {
        await uploadProduct(product);  // Upload each product
      }
    } else {
      console.log(`No products found starting from ID ${startingId}.`);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

// Start importing products from ID 10
importProductsStartingFromId(10);
