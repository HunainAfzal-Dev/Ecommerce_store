/**
 * 🔐 Auth Service
 *
 * Contains business logic for customer signup/login.
 * On signup, user is assigned 'customer' role.
 * Admin role must be set manually in database (or by another admin).
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const AppError = require('../utils/AppError');

/**
 * 🔑 Generate JWT Token
 */
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

/**
 * 📝 Register a new customer
 */
const signup = async (userData) => {
    const { name, email, password } = userData;

    // ===== 1️⃣ Check for existing user =====
    const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

    if (existingUser) {
        throw new AppError('User with this email already exists.', 409);
    }

    // ===== 2️⃣ Hash the password =====
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ===== 3️⃣ Insert new user (role defaults to 'customer') =====
    const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([
            {
                name,
                email,
                password_hash: hashedPassword,
                role: 'customer'
            }
        ])
        .select('id, name, email, role, created_at');

    if (insertError) {
        console.error('Database insert error:', insertError);
        throw new AppError('Failed to create user. Please try again.', 500);
    }

    // ===== 4️⃣ Generate JWT token =====
    const token = generateToken(newUser[0]);

    return {
        user: newUser[0],
        token
    };
};

/**
 * 🔓 Login an existing user
 */
const login = async (email, password) => {
    // ===== 1️⃣ Find user by email =====
    const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if (fetchError || !user) {
        throw new AppError('Invalid email or password.', 401);
    }

    // ===== 2️⃣ Compare passwords =====
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
        throw new AppError('Invalid email or password.', 401);
    }

    // ===== 3️⃣ Generate JWT token =====
    const token = generateToken(user);

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        token
    };
};

/**
 * 👥 Get all users (admin only)
 */
const getAllUsers = async () => {
    const { data: users, error } = await supabase
        .from('users')
        .select('id, name, email, role, created_at')
        .order('created_at', { ascending: false });

    if (error) {
        throw new AppError(error.message, 400);
    }

    return users;
};

/**
 * 🔄 Update user role (admin only)
 */
const updateUserRole = async (id, role) => {
    // ===== 1️⃣ Check if user exists =====
    const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id, name, email, role')
        .eq('id', id)
        .single();

    if (fetchError || !existingUser) {
        throw new AppError(`User with id ${id} not found.`, 404);
    }

    // ===== 2️⃣ Update role =====
    const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({ role })
        .eq('id', id)
        .select('id, name, email, role, created_at')
        .single();

    if (updateError) {
        console.error('Role Update Error:', updateError.message);
        throw new AppError('Database error while updating user role.', 500);
    }

    return updatedUser;
};

/**
 * 🗑️ Delete a user (admin only)
 */
const deleteUser = async (id) => {
    // ===== 1️⃣ Check if user exists =====
    const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .eq('id', id)
        .single();

    if (fetchError || !existingUser) {
        throw new AppError(`User with id ${id} not found.`, 404);
    }

    // ===== 2️⃣ Delete =====
    const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

    if (deleteError) {
        console.error('User Delete Error:', deleteError.message);
        throw new AppError('Database error while deleting user.', 500);
    }

    return id;
};

module.exports = {
    signup,
    login,
    generateToken,
    getAllUsers,
    updateUserRole,
    deleteUser
};

