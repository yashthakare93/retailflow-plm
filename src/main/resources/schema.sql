-- Product Lifecycle Management Schema
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    product_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'DESIGN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product Status History for audit trail (currently unused but schema defined)
CREATE TABLE IF NOT EXISTS product_status_history (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES products(id),
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by VARCHAR(100),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Users table for authentication and authorization
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roles table for defining user permissions
CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL -- e.g., 'ROLE_ADMIN', 'ROLE_DESIGNER', 'ROLE_APPROVER', 'ROLE_BUYER', 'ROLE_USER'
);

-- Junction table for Many-to-Many relationship between users and roles
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id),
    role_id BIGINT NOT NULL REFERENCES roles(id),
    PRIMARY KEY (user_id, role_id)
);

-- Insert initial product sample data (if not already present)
INSERT INTO products (product_id, name, description, category, status) VALUES
('PRD-001', 'Summer Dress Collection', 'Lightweight floral summer dresses', 'Apparel', 'DESIGN'),
('PRD-002', 'Athletic Sneakers', 'Performance running shoes', 'Footwear', 'PROTOTYPE'),
('PRD-003', 'Denim Jacket', 'Classic blue denim jacket', 'Apparel', 'APPROVED')
ON CONFLICT (product_id) DO NOTHING;

-- Insert default roles (if not already present)
INSERT INTO roles (name) VALUES
('ROLE_ADMIN'),
('ROLE_DESIGNER'),
('ROLE_APPROVER'),
('ROLE_BUYER'),
('ROLE_USER')
ON CONFLICT (name) DO NOTHING;

-- Insert a default admin user (if not already present)
-- Password for 'admin' user is 'password' (encoded using BCrypt).
-- IMPORTANT: This is the CORRECTED hash for 'password'.
INSERT INTO users (username, password, email) VALUES
('admin', '$2a$10$AaTXvjMEW0RXdHLIThWB0OCr187SowIHs/ltTrDf0rvCzm.tZvDtW', 'admin@retailflow.com') -- Password is 'password'
ON CONFLICT (username) DO NOTHING;

-- Assign 'ROLE_ADMIN' and 'ROLE_DESIGNER' to the 'admin' user
-- This requires the 'users' and 'roles' tables to be populated first.
INSERT INTO user_roles (user_id, role_id) VALUES
((SELECT id FROM users WHERE username = 'admin'), (SELECT id FROM roles WHERE name = 'ROLE_ADMIN')),
((SELECT id FROM users WHERE username = 'admin'), (SELECT id FROM roles WHERE name = 'ROLE_DESIGNER'))
ON CONFLICT (user_id, role_id) DO NOTHING;
