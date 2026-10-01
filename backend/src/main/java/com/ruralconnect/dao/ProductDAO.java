package com.ruralconnect.dao;

import com.ruralconnect.model.Product;
import com.ruralconnect.util.DBConnection;
import java.sql.*;
import java.util.*;

public class ProductDAO {
    public List<Product> findAll() throws SQLException {
        List<Product> list=new ArrayList<>();
        String sql="SELECT * FROM products ORDER BY id DESC";
        try(Connection c=DBConnection.getConnection(); PreparedStatement ps=c.prepareStatement(sql); ResultSet rs=ps.executeQuery()){
            while(rs.next()) list.add(map(rs));
        }
        return list;
    }
    private Product map(ResultSet rs)throws SQLException{return new Product(rs.getInt("id"),rs.getString("name"),rs.getDouble("price"),rs.getString("unit"),rs.getInt("stock"),rs.getString("category"),rs.getString("emoji"),rs.getString("description"),rs.getString("producer"),rs.getString("location"));}
}
