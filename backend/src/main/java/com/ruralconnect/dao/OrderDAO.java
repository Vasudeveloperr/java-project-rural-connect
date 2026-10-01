package com.ruralconnect.dao;

import com.ruralconnect.model.Order;
import com.ruralconnect.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class OrderDAO {

    public int createOrder(int userId, double totalAmount) throws Exception {

        String sql = "INSERT INTO orders (buyer_id, total, status) VALUES (?, ?, ?)";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(
                 sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setInt(1, userId);
            ps.setDouble(2, totalAmount);
            ps.setString(3, "Pending");

            ps.executeUpdate();

            ResultSet rs = ps.getGeneratedKeys();

            if (rs.next()) {
                return rs.getInt(1);
            }
        }

        return 0;
    }

    public List<Order> findByUser(int userId) throws Exception {

        List<Order> orders = new ArrayList<>();

        String sql = "SELECT * FROM orders WHERE buyer_id = ? ORDER BY id DESC";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, userId);

            ResultSet rs = ps.executeQuery();

            while (rs.next()) {

                orders.add(new Order(
                    rs.getInt("id"),
                    rs.getInt("buyer_id"),
                    rs.getDouble("total"),
                    rs.getString("status"),
                    rs.getString("created_at")
                ));
            }
        }

        return orders;
    }
}