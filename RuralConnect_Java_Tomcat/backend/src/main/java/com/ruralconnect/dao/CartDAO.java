package com.ruralconnect.dao;

import com.ruralconnect.model.Cart;
import com.ruralconnect.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class CartDAO {

    public boolean addToCart(int userId, int productId, int quantity) throws Exception {

        String checkSql =
                "SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement check = con.prepareStatement(checkSql)) {

            check.setInt(1, userId);
            check.setInt(2, productId);

            ResultSet rs = check.executeQuery();

            if (rs.next()) {

                int cartId = rs.getInt("id");
                int oldQuantity = rs.getInt("quantity");

                String updateSql =
                        "UPDATE cart SET quantity = ? WHERE id = ?";

                try (PreparedStatement update = con.prepareStatement(updateSql)) {
                    update.setInt(1, oldQuantity + quantity);
                    update.setInt(2, cartId);
                    update.executeUpdate();
                }

            } else {

                String insertSql =
                        "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)";

                try (PreparedStatement insert = con.prepareStatement(insertSql)) {
                    insert.setInt(1, userId);
                    insert.setInt(2, productId);
                    insert.setInt(3, quantity);
                    insert.executeUpdate();
                }
            }

            return true;
        }
    }

    public List<Cart> findByUser(int userId) throws Exception {

        List<Cart> cartItems = new ArrayList<>();

        String sql =
                "SELECT * FROM cart WHERE user_id = ? ORDER BY id DESC";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, userId);

            ResultSet rs = ps.executeQuery();

            while (rs.next()) {

                cartItems.add(new Cart(
                    rs.getInt("id"),
                    rs.getInt("user_id"),
                    rs.getInt("product_id"),
                    rs.getInt("quantity"),
                    rs.getString("created_at")
                ));
            }
        }

        return cartItems;
    }

    public boolean removeFromCart(int userId, int productId) throws Exception {

        String sql =
                "DELETE FROM cart WHERE user_id = ? AND product_id = ?";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, userId);
            ps.setInt(2, productId);

            return ps.executeUpdate() > 0;
        }
    }

    public boolean clearCart(int userId) throws Exception {

        String sql = "DELETE FROM cart WHERE user_id = ?";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, userId);

            ps.executeUpdate();
            return true;
        }
    }
}