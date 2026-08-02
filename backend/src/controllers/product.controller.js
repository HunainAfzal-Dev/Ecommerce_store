/**
 * 📦 Product Controller
 */

const catchAsync = require('../utils/catchAsync');
const productService = require('../services/product.service');

/**
 * 📦 POST /api/products (admin) - Create product
 */
const createProduct = catchAsync(async (req, res, next) => {
    const product = await productService.createProduct(req.body);

    res.status(201).json({
        status: 'Success',
        message: 'Product created successfully.',
        data: { product }
    });
});

/**
 * 📦 GET /api/products (public) - List products with filters
 */
const getAllProducts = catchAsync(async (req, res, next) => {
    const { category_id, search, include_inactive } = req.query;

    const products = await productService.getAllProducts({
        category_id,
        search,
        include_inactive: include_inactive === 'true'
    });

    res.status(200).json({
        status: 'Success',
        count: products.length,
        data: { products }
    });
});

/**
 * 📦 GET /api/products/:id (public) - Single product
 */
const getProductById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    // Public endpoint: only return active products
    const product = await productService.getProductById(id, true);

    res.status(200).json({
        status: 'Success',
        data: { product }
    });
});

/**
 * 📦 PUT /api/products/:id (admin) - Update product
 */
const updateProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await productService.updateProduct(id, req.body);

    res.status(200).json({
        status: 'Success',
        message: 'Product updated successfully.',
        data: { product }
    });
});

/**
 * 📦 DELETE /api/products/:id (admin) - Delete product
 */
const deleteProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const deletedId = await productService.deleteProduct(id);

    res.status(200).json({
        status: 'Success',
        message: 'Product deleted successfully.',
        data: { deleted_product_id: deletedId }
    });
});

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};

