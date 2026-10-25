/**
 * 📦 Order Service
 *
 * Business logic for placing orders and order history.
 */

const supabase = require('../config/supabase');
const AppError = require('../utils/AppError');
const { sendOrderConfirmationEmail } = require('../utils/email');
const {
    generateTrackingCode,
    normalizeTrackingCode,
    ALLOWED_STATUSES,
    withTrackingMeta
} = require('../utils/orderTracking');

const ORDER_DETAIL_SELECT = `
            id,
            user_id,
            total_amount,
            shipping_address,
            city,
            phone,
            status,
            tracking_code,
            created_at,
            users (
                id,
                name,
                email
            ),
            order_items (
                id,
                quantity,
                price,
                products (
                    id,
                    name,
                    image_url
                )
            )
        `;

const generateUniqueTrackingCode = async () => {
    for (let attempt = 0; attempt < 8; attempt += 1) {
        const code = generateTrackingCode();
        const { data, error } = await supabase
            .from('orders')
            .select('id')
            .eq('tracking_code', code)
            .maybeSingle();

        if (error) {
            console.error('Tracking code lookup error:', error.message);
            return code;
        }
        if (!data) return code;
    }
    return `ORD-${Date.now().toString(36).slice(-6).toUpperCase()}`;
};

/**
 * 📦 Place a new order
 * Steps:
 * 1. Fetch user's cart items with product info
 * 2. Verify stock availability for all items
 * 3. Create order + order_items (in a transaction)
 * 4. Decrement stock quantities
 * 5. Clear the user's cart
 */
const createOrder = async (userId, orderData) => {
    const { shipping_address, city, phone } = orderData;

    // ===== 1️⃣ Fetch cart items =====
    const { data: cartItems, error: cartError } = await supabase
        .from('cart_items')
        .select(`
            id,
            quantity,
            product_id,
            products (
                id,
                name,
                price,
                stock_quantity
            )
        `)
        .eq('user_id', userId);

    if (cartError) {
        throw new AppError(cartError.message, 400);
    }

    if (!cartItems || cartItems.length === 0) {
        throw new AppError('Your cart is empty. Add items before checkout.', 400);
    }

    // ===== 2️⃣ Verify stock + calculate total =====
    let totalAmount = 0;
    for (const item of cartItems) {
        const product = item.products;

        if (!product) {
            throw new AppError('A product in your cart is no longer available.', 400);
        }

        if (item.quantity > product.stock_quantity) {
            throw new AppError(
                `Insufficient stock for "${product.name}". Only ${product.stock_quantity} available.`,
                400
            );
        }

        totalAmount += product.price * item.quantity;
    }

    const trackingCode = await generateUniqueTrackingCode();

    // ===== 3️⃣ Create order =====
    const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert([
            {
                user_id: userId,
                total_amount: Number(totalAmount.toFixed(2)),
                shipping_address,
                city,
                phone,
                status: 'pending',
                tracking_code: trackingCode
            }
        ])
        .select()
        .single();

    if (orderError) {
        console.error('Order Insert Error:', {
            message: orderError.message,
            code: orderError.code,
            details: orderError.details,
            hint: orderError.hint,
        });
        throw new AppError(`Failed to place order: ${orderError.message}`, 500);
    }

    // ===== 4️⃣ Create order_items + decrement stock =====
    const orderItems = cartItems.map((item) => ({
        order_id: newOrder.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.products.price
    }));

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

    if (itemsError) {
        console.error('Order Items Insert Error:', itemsError.message);
        // Cleanup: delete the order since items failed
        await supabase.from('orders').delete().eq('id', newOrder.id);
        throw new AppError('Failed to place order. Please try again.', 500);
    }

    // ===== 5️⃣ Decrement stock for each product =====
    for (const item of cartItems) {
        const product = item.products;
        const newStock = product.stock_quantity - item.quantity;

        const { error: stockError } = await supabase
            .from('products')
            .update({ stock_quantity: newStock })
            .eq('id', item.product_id);

        if (stockError) {
            console.error('Stock Update Error:', stockError.message);
        }
    }

    // ===== 6️⃣ Clear the cart =====
    await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

    const { data: customer } = await supabase
        .from('users')
        .select('name, email')
        .eq('id', userId)
        .maybeSingle();

    const orderItemsForResponse = cartItems.map((item, index) => ({
        id: `temp-${index}`,
        quantity: item.quantity,
        price: item.products.price,
        products: {
            id: item.products.id,
            name: item.products.name,
            image_url: item.products.image_url || null
        }
    }));

    const hydratedOrder = withTrackingMeta({
        ...newOrder,
        tracking_code: trackingCode,
        order_items: orderItemsForResponse,
        users: customer
            ? { id: userId, name: customer.name, email: customer.email }
            : undefined
    });

    if (customer?.email) {
        sendOrderConfirmationEmail({
            to: customer.email,
            customerName: customer.name,
            trackingCode,
            items: cartItems.map((item) => ({
                name: item.products.name,
                quantity: item.quantity,
                price: item.products.price
            })),
            totalAmount: newOrder.total_amount,
            shippingAddress: shipping_address,
            city,
            phone,
            estimatedDeliveryDate: hydratedOrder.estimated_delivery_date,
            estimatedDeliveryDays: hydratedOrder.estimated_delivery_days,
            frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
        }).catch((emailError) => {
            console.error('Order confirmation email failed:', emailError.message);
        });
    }

    return hydratedOrder;
};

/**
 * 📦 Get orders for a specific user
 */
const getOrdersByUser = async (userId) => {
    const { data: orders, error } = await supabase
        .from('orders')
        .select(`
            id,
            total_amount,
            shipping_address,
            city,
            phone,
            status,
            tracking_code,
            created_at,
            order_items (
                id,
                quantity,
                price,
                products (
                    id,
                    name,
                    image_url
                )
            )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        throw new AppError(error.message, 400);
    }

    return (orders || []).map(withTrackingMeta);
};

/**
 * 📦 Get all orders (admin)
 */
const getAllOrders = async () => {
    const { data: orders, error } = await supabase
        .from('orders')
        .select(ORDER_DETAIL_SELECT)
        .order('created_at', { ascending: false });

    if (error) {
        throw new AppError(error.message, 400);
    }

    return (orders || []).map(withTrackingMeta);
};

/**
 * 📦 Get a single order by ID (customer must own it, or admin)
 */
const getOrderById = async (orderId, user) => {
    const { data: order, error } = await supabase
        .from('orders')
        .select(ORDER_DETAIL_SELECT)
        .eq('id', orderId)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            throw new AppError(`Order with id ${orderId} not found.`, 404);
        }
        throw new AppError(error.message, 400);
    }

    // Check ownership (admin can view any order)
    if (user.role !== 'admin' && order.user_id !== user.id) {
        throw new AppError(
            'You do not have permission to view this order.',
            403
        );
    }

    return withTrackingMeta(order);
};

/**
 * 📦 Public tracking lookup by ORD-XXXXXX (no auth)
 */
const getOrderByTrackingCode = async (rawCode) => {
    const trackingCode = normalizeTrackingCode(rawCode);
    if (!trackingCode || trackingCode.length < 6) {
        throw new AppError('Please enter a valid order tracking ID.', 400);
    }

    const { data: order, error } = await supabase
        .from('orders')
        .select(ORDER_DETAIL_SELECT)
        .eq('tracking_code', trackingCode)
        .maybeSingle();

    if (error) {
        throw new AppError(error.message, 400);
    }

    if (!order) {
        throw new AppError('No order found for that tracking ID.', 404);
    }

    const hydrated = withTrackingMeta(order);
    return {
        tracking_code: hydrated.tracking_code,
        status: hydrated.status,
        status_label: hydrated.status_label,
        estimated_delivery_days: hydrated.estimated_delivery_days,
        estimated_delivery_date: hydrated.estimated_delivery_date,
        timeline: hydrated.timeline,
        payment_method: hydrated.payment_method,
        total_amount: hydrated.total_amount,
        shipping_address: hydrated.shipping_address,
        city: hydrated.city,
        phone: hydrated.phone,
        created_at: hydrated.created_at,
        order_items: hydrated.order_items
    };
};

/**
 * 📦 Update order status (admin)
 */
const updateOrderStatus = async (orderId, status) => {
    if (!ALLOWED_STATUSES.includes(status)) {
        throw new AppError(
            `Invalid status. Allowed: ${ALLOWED_STATUSES.join(', ')}.`,
            400
        );
    }

    // ===== 1️⃣ Check order exists =====
    const { data: existingOrder, error: fetchError } = await supabase
        .from('orders')
        .select('id')
        .eq('id', orderId)
        .single();

    if (fetchError || !existingOrder) {
        throw new AppError(`Order with id ${orderId} not found.`, 404);
    }

    // ===== 2️⃣ Update status =====
    const { data: updatedOrder, error: updateError } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select(ORDER_DETAIL_SELECT);

    if (updateError) {
        throw new AppError(updateError.message, 400);
    }

    return withTrackingMeta(updatedOrder[0]);
};

module.exports = {
    createOrder,
    getOrdersByUser,
    getAllOrders,
    getOrderById,
    getOrderByTrackingCode,
    updateOrderStatus
};

