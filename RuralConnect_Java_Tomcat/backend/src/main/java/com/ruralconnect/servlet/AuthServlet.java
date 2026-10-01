package com.ruralconnect.servlet;

import com.ruralconnect.dao.UserDAO;
import com.ruralconnect.model.User;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;

@WebServlet("/api/auth")
public class AuthServlet extends HttpServlet {

    private final UserDAO userDAO = new UserDAO();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        resp.setContentType("application/json;charset=UTF-8");

        String action = req.getParameter("action");
        String email = req.getParameter("email");
        String password = req.getParameter("password");

        try {

            // LOGIN
            if ("login".equals(action)) {

                User user = userDAO.login(email, password);

                if (user != null) {

                    resp.getWriter().print(
                        "{\"success\":true," +
                        "\"message\":\"Login successful\"," +
                        "\"id\":" + user.getId() + "," +
                        "\"name\":\"" + escape(user.getName()) + "\"," +
                        "\"email\":\"" + escape(user.getEmail()) + "\"," +
                        "\"role\":\"" + escape(user.getRole()) + "\"}"
                    );

                } else {

                    resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

                    resp.getWriter().print(
                        "{\"success\":false,\"message\":\"Invalid email or password\"}"
                    );
                }

                return;
            }

            // REGISTER
            if ("register".equals(action)) {

                String name = req.getParameter("name");
                String role = req.getParameter("role");

                if (name == null || email == null || password == null || role == null) {

                    resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);

                    resp.getWriter().print(
                        "{\"success\":false,\"message\":\"All fields are required\"}"
                    );

                    return;
                }

                User user = new User(
                    0,
                    name,
                    email,
                    password,
                    role
                );

                boolean created = userDAO.register(user);

                if (created) {

                    resp.getWriter().print(
                        "{\"success\":true,\"message\":\"Registration successful\"}"
                    );

                } else {

                    resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);

                    resp.getWriter().print(
                        "{\"success\":false,\"message\":\"Registration failed\"}"
                    );
                }

                return;
            }

            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);

            resp.getWriter().print(
                "{\"success\":false,\"message\":\"Invalid action\"}"
            );

        } catch (Exception e) {

            e.printStackTrace();

            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);

            resp.getWriter().print(
                "{\"success\":false,\"message\":\"Server error\"}"
            );
        }
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