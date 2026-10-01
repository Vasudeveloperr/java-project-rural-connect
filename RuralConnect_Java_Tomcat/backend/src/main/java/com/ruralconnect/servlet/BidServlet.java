package com.ruralconnect.servlet;

import com.ruralconnect.dao.BidDAO;
import com.ruralconnect.model.Bid;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.util.List;

@WebServlet("/api/bids")
public class BidServlet extends HttpServlet {

    private final BidDAO bidDAO = new BidDAO();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        resp.setContentType("application/json;charset=UTF-8");

        try {
            String action = req.getParameter("action");

            if ("place".equals(action)) {

                String auctionIdParam = req.getParameter("auctionId");
                String buyerIdParam = req.getParameter("buyerId");
                String bidderName = req.getParameter("bidderName");
                String amountParam = req.getParameter("amount");

                if (auctionIdParam == null ||
                    buyerIdParam == null ||
                    bidderName == null ||
                    amountParam == null) {

                    resp.setStatus(400);
                    resp.getWriter().print(
                        "{\"success\":false,\"message\":\"All bid fields are required\"}"
                    );
                    return;
                }

                int auctionId = Integer.parseInt(auctionIdParam);
                int buyerId = Integer.parseInt(buyerIdParam);
                double amount = Double.parseDouble(amountParam);

                boolean placed = bidDAO.placeBid(
                    auctionId,
                    buyerId,
                    bidderName,
                    amount
                );

                resp.getWriter().print(
                    "{\"success\":" + placed + ",\"message\":\"Bid placed successfully\"}"
                );

            } else {

                resp.setStatus(400);
                resp.getWriter().print(
                    "{\"success\":false,\"message\":\"Invalid action\"}"
                );
            }

        } catch (Exception e) {

            e.printStackTrace();

            resp.setStatus(500);
            resp.getWriter().print(
                "{\"success\":false,\"message\":\"Server error\"}"
            );
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        resp.setContentType("application/json;charset=UTF-8");

        try {
            String auctionIdParam = req.getParameter("auctionId");

            if (auctionIdParam == null) {
                resp.setStatus(400);
                resp.getWriter().print(
                    "{\"error\":\"auctionId is required\"}"
                );
                return;
            }

            int auctionId = Integer.parseInt(auctionIdParam);

            List<Bid> bids = bidDAO.findByAuction(auctionId);

            StringBuilder json = new StringBuilder("[");

            for (Bid bid : bids) {

                if (json.length() > 1) {
                    json.append(",");
                }

                json.append(toJson(bid));
            }

            json.append("]");

            resp.getWriter().print(json);

        } catch (Exception e) {

            e.printStackTrace();

            resp.setStatus(500);
            resp.getWriter().print(
                "{\"error\":\"Database error\"}"
            );
        }
    }

    private String toJson(Bid bid) {

        return "{"
            + "\"id\":" + bid.getId() + ","
            + "\"auctionId\":" + bid.getAuctionId() + ","
            + "\"buyerId\":" + bid.getBuyerId() + ","
            + "\"bidderName\":\"" + escape(bid.getBidderName()) + "\","
            + "\"amount\":" + bid.getAmount() + ","
            + "\"bidTime\":\"" + escape(bid.getBidTime()) + "\""
            + "}";
    }

    private String escape(String value) {

        if (value == null) {
            return "";
        }

        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"");
    }
}