package com.ruralconnect.servlet;

import com.ruralconnect.dao.OrderDAO;
import com.ruralconnect.model.Order;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.util.List;

@WebServlet("/api/orders")
public class OrderServlet extends HttpServlet {

    private final OrderDAO orderDAO = new OrderDAO();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        resp.setContentType("application/json;charset=UTF-8");

        try {
            String userIdParam = req.getParameter("userId");
            String totalParam = req.getParameter("totalAmount");

            if (userIdParam == null || totalParam == null) {
                resp.setStatus(400);
                resp.getWriter().print(
                    "{\"success\":false,\"message\":\"userId and totalAmount are required\"}"
                );
                return;
            }

            int userId = Integer.parseInt(userIdParam);
            double totalAmount = Double.parseDouble(totalParam);

            int orderId = orderDAO.createOrder(userId, totalAmount);

            if (orderId > 0) {
                resp.getWriter().print(
                    "{\"success\":true,\"orderId\":" + orderId + "}"
                );
            } else {
                resp.setStatus(500);
                resp.getWriter().print(
                    "{\"success\":false,\"message\":\"Order creation failed\"}"
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

            List<Order> orders = orderDAO.findByUser(userId);

            StringBuilder json = new StringBuilder("[");

            for (Order order : orders) {

                if (json.length() > 1) {
                    json.append(",");
                }

                json.append("{")
                    .append("\"id\":").append(order.getId()).append(",")
                    .append("\"userId\":").append(order.getUserId()).append(",")
                    .append("\"totalAmount\":").append(order.getTotalAmount()).append(",")
                    .append("\"status\":\"").append(order.getStatus()).append("\",")
                    .append("\"createdAt\":\"").append(order.getCreatedAt()).append("\"")
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