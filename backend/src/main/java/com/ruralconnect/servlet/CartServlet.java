package com.ruralconnect.servlet;

import com.ruralconnect.dao.CartDAO;
import com.ruralconnect.model.Cart;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.util.List;

@WebServlet("/api/cart")
public class CartServlet extends HttpServlet {

    private final CartDAO cartDAO = new CartDAO();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        resp.setContentType("application/json;charset=UTF-8");

        try {
            String action = req.getParameter("action");
            String userIdParam = req.getParameter("userId");

            if (userIdParam == null) {
                resp.setStatus(400);
                resp.getWriter().print(
                    "{\"success\":false,\"message\":\"userId is required\"}"
                );
                return;
            }

            int userId = Integer.parseInt(userIdParam);

            if ("add".equals(action)) {

                String productIdParam = req.getParameter("productId");
                String quantityParam = req.getParameter("quantity");

                if (productIdParam == null || quantityParam == null) {
                    resp.setStatus(400);
                    resp.getWriter().print(
                        "{\"success\":false,\"message\":\"productId and quantity are required\"}"
                    );
                    return;
                }

                int productId = Integer.parseInt(productIdParam);
                int quantity = Integer.parseInt(quantityParam);

                boolean added =
                    cartDAO.addToCart(userId, productId, quantity);

                resp.getWriter().print(
                    "{\"success\":" + added + ",\"message\":\"Product added to cart\"}"
                );

            } else if ("remove".equals(action)) {

                String productIdParam = req.getParameter("productId");

                if (productIdParam == null) {
                    resp.setStatus(400);
                    resp.getWriter().print(
                        "{\"success\":false,\"message\":\"productId is required\"}"
                    );
                    return;
                }

                int productId = Integer.parseInt(productIdParam);

                boolean removed =
                    cartDAO.removeFromCart(userId, productId);

                resp.getWriter().print(
                    "{\"success\":" + removed + ",\"message\":\"Product removed from cart\"}"
                );

            } else if ("clear".equals(action)) {

                cartDAO.clearCart(userId);

                resp.getWriter().print(
                    "{\"success\":true,\"message\":\"Cart cleared\"}"
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
            String userIdParam = req.getParameter("userId");

            if (userIdParam == null) {
                resp.setStatus(400);
                resp.getWriter().print(
                    "{\"error\":\"userId is required\"}"
                );
                return;
            }

            int userId = Integer.parseInt(userIdParam);

            List<Cart> cartItems = cartDAO.findByUser(userId);

            StringBuilder json = new StringBuilder("[");

            for (Cart item : cartItems) {

                if (json.length() > 1) {
                    json.append(",");
                }

                json.append("{")
                    .append("\"id\":").append(item.getId()).append(",")
                    .append("\"userId\":").append(item.getUserId()).append(",")
                    .append("\"productId\":").append(item.getProductId()).append(",")
                    .append("\"quantity\":").append(item.getQuantity()).append(",")
                    .append("\"createdAt\":\"").append(item.getCreatedAt()).append("\"")
                    .append("}");
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
}