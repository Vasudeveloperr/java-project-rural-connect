package com.ruralconnect.servlet;

import com.ruralconnect.dao.AuctionDAO;
import com.ruralconnect.model.Auction;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.util.List;

@WebServlet("/api/auctions")
public class AuctionServlet extends HttpServlet {

    private final AuctionDAO auctionDAO = new AuctionDAO();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        resp.setContentType("application/json;charset=UTF-8");

        try {
            String action = req.getParameter("action");

            if ("create".equals(action)) {

                String productIdParam = req.getParameter("productId");
                String producerIdParam = req.getParameter("producerId");
                String startingBidParam = req.getParameter("startingBid");
                String quantityParam = req.getParameter("quantity");
                String endsAt = req.getParameter("endsAt");

                if (productIdParam == null ||
                    producerIdParam == null ||
                    startingBidParam == null ||
                    quantityParam == null ||
                    endsAt == null) {

                    resp.setStatus(400);
                    resp.getWriter().print(
                        "{\"success\":false,\"message\":\"All auction fields are required\"}"
                    );
                    return;
                }

                int productId = Integer.parseInt(productIdParam);
                int producerId = Integer.parseInt(producerIdParam);
                double startingBid = Double.parseDouble(startingBidParam);
                int quantity = Integer.parseInt(quantityParam);

                int auctionId = auctionDAO.createAuction(
                    productId,
                    producerId,
                    startingBid,
                    quantity,
                    endsAt
                );

                if (auctionId > 0) {
                    resp.getWriter().print(
                        "{\"success\":true,\"auctionId\":" + auctionId + "}"
                    );
                } else {
                    resp.setStatus(500);
                    resp.getWriter().print(
                        "{\"success\":false,\"message\":\"Auction creation failed\"}"
                    );
                }

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
            String idParam = req.getParameter("id");

            if (idParam != null) {

                int auctionId = Integer.parseInt(idParam);

                Auction auction = auctionDAO.findById(auctionId);

                if (auction == null) {
                    resp.setStatus(404);
                    resp.getWriter().print(
                        "{\"error\":\"Auction not found\"}"
                    );
                    return;
                }

                resp.getWriter().print(toJson(auction));

            } else {

                List<Auction> auctions = auctionDAO.findAll();

                StringBuilder json = new StringBuilder("[");

                for (Auction auction : auctions) {

                    if (json.length() > 1) {
                        json.append(",");
                    }

                    json.append(toJson(auction));
                }

                json.append("]");

                resp.getWriter().print(json);
            }

        } catch (Exception e) {

            e.printStackTrace();

            resp.setStatus(500);
            resp.getWriter().print(
                "{\"error\":\"Database error\"}"
            );
        }
    }

    private String toJson(Auction auction) {

        return "{"
            + "\"id\":" + auction.getId() + ","
            + "\"productId\":" + auction.getProductId() + ","
            + "\"producerId\":" + auction.getProducerId() + ","
            + "\"startingBid\":" + auction.getStartingBid() + ","
            + "\"quantity\":" + auction.getQuantity() + ","
            + "\"endsAt\":\"" + escape(auction.getEndsAt()) + "\""
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