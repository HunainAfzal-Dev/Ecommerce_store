/**
 * 🛒 Cart Service
 *
 * Business logic for customer shopping cart.
 */

const supabase = require('../config/supabase');
const AppError = require('../utils/AppError');

/**
 * 🛒 Get user's cart with product details
 */
const getCart = async (userId) => {
    const { data: cartItems, error } = await supabase
        .from('cart_items')
        .select(`
            id,
            quantity,
            products (
                id,
                name,
                price,
                image_url,
                stock_quantity,
                is_active
            )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        throw new AppError(error.message, 400);
    }

    return cartItems;
};

/**
 * 🛒 Add item to cart
 * If the item already exists in the cart, increments the quantity.
 */
const addToCart = async (userId, productId, quantity) => {
    // ===== 1️⃣ Verify product exists and is active =====
    const { data: product, error: productError } = await supabase
        .from('products')
        .select('id, stock_quantity, is_active')
        .eq('id', productId)
        .eq('is_active', true)
        .single();

    if (productError || !product) {
        throw new AppError('Product not found or is not available.', 404);
    }

    // ===== 2️⃣ Check if item already in cart =====
    const { data: existingItem, error: existingError } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .maybeSingle();

    if (existingError) {
        throw new AppError(existingError.message, 400);
    }

    if (existingItem) {
        // ===== 3a. Update quantity =====
        const newQuantity = existingItem.quantity + quantity;

        if (newQuantity > product.stock_quantity) {
            throw new AppError(
                `Only ${product.stock_quantity} units available in stock.`,
                400
            );
        }

        const { data: updatedItem, error: updateError } = await supabase
            .from('cart_items')
            .update({ quantity: newQuantity })
            .eq('id', existingItem.id)
            .select();

        if (updateError) {
            throw new AppError(updateError.message, 400);
        }

        return updatedItem[0];
    }

    // ===== 3b. Validate against stock =====
    if (quantity > product.stock_quantity) {
        throw new AppError(
            `Only ${product.stock_quantity} units available in stock.`,
            400
        );
    }

    // ===== 3c. Insert new cart item =====
    const { data: newItem, error: insertError } = await supabase
        .from('cart_items')
        .insert([
            {
                user_id: userId,
                product_id: productId,
                quantity
            }
        ])
        .select();

    if (insertError) {
        console.error('Supabase Insert Error:', insertError.message);
        throw new AppError('Database error while adding to cart.', 500);
    }

    return newItem[0];
};

/**
 * 🛒 Update cart item quantity
 */
const updateCartItem = async (userId, cartItemId, quantity) => {
    // ===== 1️⃣ Check cart item exists and belongs to user =====
    const { data: cartItem, error: fetchError } = await supabase
        .from('cart_items')
        .select('id, product_id, quantity')
        .eq('id', cartItemId)
        .eq('user_id', userId)
        .single();

    if (fetchError || !cartItem) {
        throw new AppError('Cart item not found.', 404);
    }

    // ===== 2️⃣ Verify stock =====
    const { data: product, error: productError } = await supabase
        .from('products')
        .select('stock_quantity')
        .eq('id', cartItem.product_id)
        .single();

    if (productError || !product) {
        throw new AppError('Product not found.', 404);
    }

    if (quantity > product.stock_quantity) {
        throw new AppError(
            `Only ${product.stock_quantity} units available in stock.`,
            400
        );
    }

    // ===== 3️⃣ Update =====
    const { data: updatedItem, error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId)
        .select();

    if (updateError) {
        throw new AppError(updateError.message, 400);
    }

    return updatedItem[0];
};

/**
 * 🗑️ Remove item from cart
 */
const removeFromCart = async (userId, cartItemId) => {
    // ===== 1️⃣ Check cart item exists and belongs to user =====
    const { data: cartItem, error: fetchError } = await supabase
        .from('cart_items')
        .select('id')
        .eq('id', cartItemId)
        .eq('user_id', userId)
        .single();

    if (fetchError || !cartItem) {
        throw new AppError('Cart item not found.', 404);
    }

    // ===== 2️⃣ Delete =====
    const { error: deleteError } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

    if (deleteError) {
        throw new AppError(deleteError.message, 400);
    }

    return cartItemId;
};

/**
 * 🗑️ Clear user's entire cart
 */
const clearCart = async (userId) => {
    const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

    if (error) {
        throw new AppError(error.message, 400);
    }

    return true;
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};

