/**
 * 🏷️ Category Service
 *
 * Business logic for category CRUD.
 */

const supabase = require('../config/supabase');
const AppError = require('../utils/AppError');

/**
 * 🏷️ Create a category
 */
const createCategory = async (categoryData) => {
    const { name, description } = categoryData;

    // ===== 1️⃣ Check for duplicate name =====
    const { data: existingCategories } = await supabase
        .from('categories')
        .select('id')
        .eq('name', name)
        .limit(1);

    if (existingCategories && existingCategories.length > 0) {
        throw new AppError(
            `A category with the name "${name}" already exists.`,
            409
        );
    }

    // ===== 2️⃣ Insert =====
    const { data, error } = await supabase
        .from('categories')
        .insert([{ name, description: description || null }])
        .select();

    if (error) {
        console.error('Supabase Insert Error:', error.message);
        throw new AppError('Database error while creating category.', 500);
    }

    return data[0];
};

/**
 * 🏷️ Get all categories
 */
const getAllCategories = async () => {
    const { data: categories, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        throw new AppError(error.message, 400);
    }

    return categories;
};

/**
 * 🏷️ Get a single category by ID
 */
const getCategoryById = async (id) => {
    const { data: category, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            throw new AppError(`Category with id ${id} not found.`, 404);
        }
        throw new AppError(error.message, 400);
    }

    return category;
};

/**
 * 🏷️ Update a category
 */
const updateCategory = async (id, updateData) => {
    const { name, description } = updateData;

    // ===== 1️⃣ Check if category exists =====
    const { data: existingCategory, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

    if (fetchError || !existingCategory) {
        throw new AppError(`Category with id ${id} not found.`, 404);
    }

    // ===== 2️⃣ Check duplicate name (if changing) =====
    if (name && name !== existingCategory.name) {
        const { data: duplicateCategories } = await supabase
            .from('categories')
            .select('id')
            .eq('name', name)
            .neq('id', id)
            .limit(1);

        if (duplicateCategories && duplicateCategories.length > 0) {
            throw new AppError(
                `A category with the name "${name}" already exists.`,
                409
            );
        }
    }

    // ===== 3️⃣ Build update payload =====
    const updatePayload = {};
    if (name !== undefined) updatePayload.name = name;
    if (description !== undefined) updatePayload.description = description;

    // ===== 4️⃣ Update =====
    const { data: updatedCategory, error: updateError } = await supabase
        .from('categories')
        .update(updatePayload)
        .eq('id', id)
        .select();

    if (updateError) {
        console.error('Supabase Update Error:', updateError.message);
        throw new AppError('Database error while updating category.', 500);
    }

    return updatedCategory[0];
};

/**
 * 🗑️ Delete a category
 */
const deleteCategory = async (id) => {
    // ===== 1️⃣ Check if category exists =====
    const { data: existingCategory, error: fetchError } = await supabase
        .from('categories')
        .select('id')
        .eq('id', id)
        .single();

    if (fetchError || !existingCategory) {
        throw new AppError(`Category with id ${id} not found.`, 404);
    }

    // ===== 2️⃣ Check if any products reference this category =====
    const { data: products, error: productError } = await supabase
        .from('products')
        .select('id')
        .eq('category_id', id)
        .limit(1);

    if (productError) {
        throw new AppError(productError.message, 400);
    }

    if (products && products.length > 0) {
        throw new AppError(
            'Cannot delete this category because products are assigned to it.',
            409
        );
    }

    // ===== 3️⃣ Delete =====
    const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

    if (deleteError) {
        console.error('Supabase Delete Error:', deleteError.message);
        throw new AppError('Database error while deleting category.', 500);
    }

    return id;
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};

