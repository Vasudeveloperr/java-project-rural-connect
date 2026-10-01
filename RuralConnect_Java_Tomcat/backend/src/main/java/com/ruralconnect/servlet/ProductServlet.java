package com.ruralconnect.servlet;

import com.ruralconnect.dao.ProductDAO;
import com.ruralconnect.model.Product;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet("/api/products")
public class ProductServlet extends HttpServlet {
    @Override protected void doGet(HttpServletRequest req,HttpServletResponse resp)throws IOException{
        resp.setContentType("application/json;charset=UTF-8");
        try{
            StringBuilder json=new StringBuilder("[");
            for(Product p:new ProductDAO().findAll()){
                if(json.length()>1)json.append(',');
                json.append("{\"id\":").append(p.getId()).append(",\"name\":\"").append(esc(p.getName())).append("\",\"price\":").append(p.getPrice()).append(",\"unit\":\"").append(esc(p.getUnit())).append("\",\"stock\":").append(p.getStock()).append(",\"category\":\"").append(esc(p.getCategory())).append("\",\"emoji\":\"").append(esc(p.getEmoji())).append("\",\"desc\":\"").append(esc(p.getDescription())).append("\",\"producer\":\"").append(esc(p.getProducer())).append("\",\"location\":\"").append(esc(p.getLocation())).append("\"}");
            }
            resp.getWriter().print(json.append(']'));
        }catch(Exception e){resp.setStatus(500);resp.getWriter().print("{\"error\":\"Database error\"}");}
    }
    private String esc(String s){return s==null?"":s.replace("\\","\\\\").replace("\"","\\\"");}
}
