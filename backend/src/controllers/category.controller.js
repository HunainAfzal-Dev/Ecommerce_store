/**
 * 🏷️ Category Controller
 */

const catchAsync = require('../utils/catchAsync');
const categoryService = require('../services/category.service');

/**
 * 🏷️ POST /api/categories (admin) - Create category
 */
const createCategory = catchAsync(async (req, res, next) => {
    const category = await categoryService.createCategory(req.body);

    res.status(201).json({
        status: 'Success',
        message: 'Category created successfully.',
        data: { category }
    });
});

/**
 * 🏷️ GET /api/categories (public) - All categories
 */
const getAllCategories = catchAsync(async (req, res, next) => {
    const categories = await categoryService.getAllCategories();

    res.status(200).json({
        status: 'Success',
        count: categories.length,
        data: { categories }
    });
});

/**
 * 🏷️ GET /api/categories/:id (public) - Single category
 */
const getCategoryById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);

    res.status(200).json({
        status: 'Success',
        data: { category }
    });
});

/**
 * 🏷️ PUT /api/categories/:id (admin) - Update category
 */
const updateCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const category = await categoryService.updateCategory(id, req.body);

    res.status(200).json({
        status: 'Success',
        message: 'Category updated successfully.',
        data: { category }
    });
});

/**
 * 🏷️ DELETE /api/categories/:id (admin) - Delete category
 */
const deleteCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const deletedId = await categoryService.deleteCategory(id);

    res.status(200).json({
        status: 'Success',
        message: 'Category deleted successfully.',
        data: { deleted_category_id: deletedId }
    });
});

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};

