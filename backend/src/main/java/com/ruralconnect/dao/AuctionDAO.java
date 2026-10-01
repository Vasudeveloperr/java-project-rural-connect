package com.ruralconnect.dao;

import com.ruralconnect.model.Auction;
import com.ruralconnect.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class AuctionDAO {

    public int createAuction(
            int productId,
            int producerId,
            double startingBid,
            int quantity,
            String endsAt) throws Exception {

        String sql = "INSERT INTO auctions " +
                "(product_id, producer_id, starting_bid, quantity, ends_at) " +
                "VALUES (?, ?, ?, ?, ?)";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(
                     sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setInt(1, productId);
            ps.setInt(2, producerId);
            ps.setDouble(3, startingBid);
            ps.setInt(4, quantity);
            ps.setString(5, endsAt);

            ps.executeUpdate();

            ResultSet rs = ps.getGeneratedKeys();

            if (rs.next()) {
                return rs.getInt(1);
            }
        }

        return 0;
    }

    public List<Auction> findAll() throws Exception {

        List<Auction> auctions = new ArrayList<>();

        String sql = "SELECT * FROM auctions ORDER BY id DESC";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {

                auctions.add(new Auction(
                    rs.getInt("id"),
                    rs.getInt("product_id"),
                    rs.getInt("producer_id"),
                    rs.getDouble("starting_bid"),
                    rs.getInt("quantity"),
                    rs.getString("ends_at")
                ));
            }
        }

        return auctions;
    }

    public Auction findById(int auctionId) throws Exception {

        String sql = "SELECT * FROM auctions WHERE id = ?";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, auctionId);

            ResultSet rs = ps.executeQuery();

            if (rs.next()) {

                return new Auction(
                    rs.getInt("id"),
                    rs.getInt("product_id"),
                    rs.getInt("producer_id"),
                    rs.getDouble("starting_bid"),
                    rs.getInt("quantity"),
                    rs.getString("ends_at")
                );
            }
        }

        return null;
    }
}