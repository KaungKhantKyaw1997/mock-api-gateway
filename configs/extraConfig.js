let products = [
  { id: 1, name: "Laptop", price: 1200 },
  { id: 2, name: "Phone", price: 800 },
  { id: 3, name: "Tablet", price: 500 },
];

let productsPath = "/api/products";

module.exports = {
  routes: [
    {
      method: "GET",
      path: productsPath,
      requiresAuth: true,
      response: (req, res) => {
        let { page = 1, limit = 5, search = "" } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        // Filter products based on the search query
        let filteredProducts = products.filter((product) =>
          product.name.toLowerCase().includes(search.toLowerCase())
        );

        // Paginate the results
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

        res.status(200).json({
          page,
          limit,
          totalProducts: filteredProducts.length,
          totalPages: Math.ceil(filteredProducts.length / limit),
          products: paginatedProducts,
        });
      },
    },
    {
      method: "GET",
      path: `${productsPath}/:id`,
      requiresAuth: true,
      response: (req, res) => {
        const product = products.find((p) => p.id === parseInt(req.params.id));
        if (product) {
          res.status(200).json(product);
        } else {
          res.status(404).json({ message: "Product not found" });
        }
      },
    },
    {
      method: "POST",
      path: productsPath,
      requiresAuth: true,
      response: (req, res) => {
        const newProduct = {
          id: products.length + 1,
          ...req.body,
        };
        products.push(newProduct);
        res.status(201).json({
          message: "Product created successfully",
          product: newProduct,
        });
      },
    },
    {
      method: "PUT",
      path: `${productsPath}/:id`,
      requiresAuth: true,
      response: (req, res) => {
        const product = products.find((p) => p.id === parseInt(req.params.id));
        if (product) {
          Object.assign(product, req.body);
          res.status(200).json({
            message: "Product updated successfully",
            product,
          });
        } else {
          res.status(404).json({ message: "Product not found" });
        }
      },
    },
    {
      method: "DELETE",
      path: `${productsPath}/:id`,
      requiresAuth: true,
      response: (req, res) => {
        const index = products.findIndex(
          (p) => p.id === parseInt(req.params.id)
        );
        if (index !== -1) {
          products.splice(index, 1);
          res.status(200).json({ message: "Product deleted successfully" });
        } else {
          res.status(404).json({ message: "Product not found" });
        }
      },
    },
  ],
};
