/**
 * 📦 Product Service
 *
 * Business logic for product CRUD.
 * Public: list (with filters) + single
 * Admin: create, update, delete
 */

const supabase = require('../config/supabase');
const AppError = require('../utils/AppError');

/**
 * 📦 Create a product
 */
const createProduct = async (productData) => {
    const {
        category_id, name, description, price,
        image_url, stock_quantity, is_active
    } = productData;

    // ===== 1️⃣ Verify category exists =====
    const { data: category, error: catError } = await supabase
        .from('categories')
        .select('id')
        .eq('id', category_id)
        .single();

    if (catError || !category) {
        throw new AppError(
            `Category with id ${category_id} not found.`,
            404
        );
    }

    // ===== 2️⃣ Check duplicate product name =====
    const { data: existingNames } = await supabase
        .from('products')
        .select('id')
        .eq('name', name)
        .limit(1);

    if (existingNames && existingNames.length > 0) {
        throw new AppError(
            `A product with the name "${name}" already exists.`,
            409
        );
    }

    // ===== 3️⃣ Insert =====
    const { data, error } = await supabase
        .from('products')
        .insert([
            {
                category_id,
                name,
                description: description || null,
                price: Number(price),
                image_url: image_url || null,
                stock_quantity: Number(stock_quantity),
                is_active: is_active !== undefined ? is_active : true
            }
        ])
        .select();

    if (error) {
        console.error('Supabase Insert Error:', error.message);
        throw new AppError('Database error while creating product.', 500);
    }

    return data[0];
};

/**
 * 📦 Get all products (public)
 * Supports optional category filter and search query.
 * Only returns active products unless includeInactive is true.
 */
const getAllProducts = async (filters = {}) => {
    const { category_id, search, include_inactive } = filters;

    let query = supabase.from('products').select('*');

    // Filter by category
    if (category_id) {
        query = query.eq('category_id', category_id);
    }

    // Search by name
    if (search) {
        query = query.ilike('name', `%${search}%`);
    }

    // Only active products (for public storefront)
    if (!include_inactive) {
        query = query.eq('is_active', true);
    }

    const { data: products, error } = await query
        .order('created_at', { ascending: false });

    if (error) {
        throw new AppError(error.message, 400);
    }

    return products;
};

/**
 * 📦 Get a single product by ID (public if active)
 */
const getProductById = async (id, requireActive = false) => {
    let query = supabase.from('products').select('*').eq('id', id);

    if (requireActive) {
        query = query.eq('is_active', true);
    }

    const { data: product, error } = await query.single();

    if (error) {
        if (error.code === 'PGRST116') {
            throw new AppError(`Product with id ${id} not found.`, 404);
        }
        throw new AppError(error.message, 400);
    }

    return product;
};

/**
 * 📦 Update a product
 */
const updateProduct = async (id, updateData) => {
    const {
        category_id, name, description, price,
        image_url, stock_quantity, is_active
    } = updateData;

    // ===== 1️⃣ Check if product exists =====
    const { data: existingProduct, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (fetchError || !existingProduct) {
        throw new AppError(`Product with id ${id} not found.`, 404);
    }

    // ===== 2️⃣ If category is changing, verify it exists =====
    if (category_id) {
        const { data: category, error: catError } = await supabase
            .from('categories')
            .select('id')
            .eq('id', category_id)
            .single();

        if (catError || !category) {
            throw new AppError(
                `Category with id ${category_id} not found.`,
                404
            );
        }
    }

    // ===== 3️⃣ Check duplicate name (if changing) =====
    if (name && name !== existingProduct.name) {
        const { data: duplicateNames } = await supabase
            .from('products')
            .select('id')
            .eq('name', name)
            .neq('id', id)
            .limit(1);

        if (duplicateNames && duplicateNames.length > 0) {
            throw new AppError(
                `A product with the name "${name}" already exists.`,
                409
            );
        }
    }

    // ===== 4️⃣ Build update payload =====
    const updatePayload = {};
    if (category_id !== undefined) updatePayload.category_id = category_id;
    if (name !== undefined) updatePayload.name = name;
    if (description !== undefined) updatePayload.description = description;
    if (price !== undefined) updatePayload.price = Number(price);
    if (image_url !== undefined) updatePayload.image_url = image_url;
    if (stock_quantity !== undefined) {
        updatePayload.stock_quantity = Number(stock_quantity);
    }
    if (is_active !== undefined) updatePayload.is_active = is_active;

    // ===== 5️⃣ Update =====
    const { data: updatedProduct, error: updateError } = await supabase
        .from('products')
        .update(updatePayload)
        .eq('id', id)
        .select();

    if (updateError) {
        console.error('Supabase Update Error:', updateError.message);
        throw new AppError('Database error while updating product.', 500);
    }

    return updatedProduct[0];
};

/**
 * 🗑️ Delete a product
 */
const deleteProduct = async (id) => {
    // ===== 1️⃣ Check if product exists =====
    const { data: existingProduct, error: fetchError } = await supabase
        .from('products')
        .select('id')
        .eq('id', id)
        .single();

    if (fetchError || !existingProduct) {
        throw new AppError(`Product with id ${id} not found.`, 404);
    }

    // ===== 2️⃣ Delete =====
    const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (deleteError) {
        console.error('Supabase Delete Error:', deleteError.message);
        throw new AppError('Database error while deleting product.', 500);
    }

    return id;
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};

