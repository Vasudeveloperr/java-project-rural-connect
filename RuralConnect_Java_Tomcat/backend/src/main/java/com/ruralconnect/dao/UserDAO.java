package com.ruralconnect.dao;

import com.ruralconnect.model.User;
import com.ruralconnect.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class UserDAO {

    // Find user by email and password
    public User login(String email, String password) throws Exception {

        String sql = "SELECT id, name, email, password, role " +
                     "FROM users WHERE email = ? AND password = ?";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, email);
            ps.setString(2, password);

            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                return new User(
                    rs.getInt("id"),
                    rs.getString("name"),
                    rs.getString("email"),
                    rs.getString("password"),
                    rs.getString("role")
                );
            }
        }

        return null;
    }

    // Create a new user
    public boolean register(User user) throws Exception {

        String sql = "INSERT INTO users (name, email, password, role) " +
                     "VALUES (?, ?, ?, ?)";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, user.getName());
            ps.setString(2, user.getEmail());
            ps.setString(3, user.getPassword());
            ps.setString(4, user.getRole());

            return ps.executeUpdate() > 0;
        }
    }
}