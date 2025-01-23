import { createClient } from '@sanity/client';

// Initialize Sanity client using createClient
const client = createClient({
  projectId: '',  // Replace with your Sanity project ID
  dataset: '',         // Replace with your dataset name
  token: '',      // Replace with your Sanity token if authentication is required
  useCdn: false,                 // Use false to ensure you get the latest data, true for better performance
  apiVersion: '',
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
