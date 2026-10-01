package com.ruralconnect.dao;

import com.ruralconnect.model.Bid;
import com.ruralconnect.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class BidDAO {

    public boolean placeBid(
            int auctionId,
            int buyerId,
            String bidderName,
            double amount) throws Exception {

        String sql = "INSERT INTO bids " +
                "(auction_id, buyer_id, bidder_name, amount) " +
                "VALUES (?, ?, ?, ?)";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, auctionId);
            ps.setInt(2, buyerId);
            ps.setString(3, bidderName);
            ps.setDouble(4, amount);

            return ps.executeUpdate() > 0;
        }
    }

    public List<Bid> findByAuction(int auctionId) throws Exception {

        List<Bid> bids = new ArrayList<>();

        String sql =
                "SELECT * FROM bids WHERE auction_id = ? ORDER BY amount DESC";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, auctionId);

            ResultSet rs = ps.executeQuery();

            while (rs.next()) {

                bids.add(new Bid(
                    rs.getInt("id"),
                    rs.getInt("auction_id"),
                    rs.getInt("buyer_id"),
                    rs.getString("bidder_name"),
                    rs.getDouble("amount"),
                    rs.getString("bid_time")
                ));
            }
        }

        return bids;
    }

    public Bid findHighestBid(int auctionId) throws Exception {

        String sql =
                "SELECT * FROM bids " +
                "WHERE auction_id = ? " +
                "ORDER BY amount DESC LIMIT 1";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, auctionId);

            ResultSet rs = ps.executeQuery();

            if (rs.next()) {

                return new Bid(
                    rs.getInt("id"),
                    rs.getInt("auction_id"),
                    rs.getInt("buyer_id"),
                    rs.getString("bidder_name"),
                    rs.getDouble("amount"),
                    rs.getString("bid_time")
                );
            }
        }

        return null;
    }
}