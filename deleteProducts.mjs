import { createClient } from '@sanity/client';

// Initialize Sanity client using createClient
const client = createClient({
  projectId: 'kbozbv29',  // Replace with your Sanity project ID
  dataset: 'production',         // Replace with your dataset name
  token: 'skGVQ5CfyRhDOPPsQgotYcsSRfEKd2Fql5MPsFQgmR2xTvmSY9NVU3bA8jkWPKh6PwfbcBR5KIyeQIzD4UFxn15rcyKfPBJ2I22RznSOSCJq4CcKvSFfVOHgHbb2p3d4HZE8mhg0ku1iQC4nmVQa0DEIFCYeZqySkwcFIxk2cNAtdVYFPYgf',      // Replace with your Sanity token if authentication is required
  useCdn: false,                 // Use false to ensure you get the latest data, true for better performance
  apiVersion: '2021-08-31',
});

async function deleteAllProducts() {
  try {
    // Fetch all documents of the 'product' type
    const products = await client.fetch('*[_type == "products"]{_id}');

    // If there are no products, exit the script
    if (products.length === 0) {
      console.log('No products to delete');
      return;
    }

    // Extract the _id of each product document
    const productIds = products.map(product => product._id);

    // Delete the products in batches (Sanity allows batch deletion)
    const batchSize = 100;  // You can adjust the batch size as needed
    for (let i = 0; i < productIds.length; i += batchSize) {
      const batch = productIds.slice(i, i + batchSize);
      await client.delete(batch);
      console.log(`Deleted products: ${batch.join(', ')}`);
    }

    console.log('All product documents have been deleted!');
  } catch (error) {
    console.error('Error deleting products:', error);
  }
}

// Run the deletion script
deleteAllProducts();
