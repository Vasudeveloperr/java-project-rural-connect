package com.ruralconnect.model;

public class Cart {

    private int id;
    private int userId;
    private int productId;
    private int quantity;
    private String createdAt;

    public Cart(int id, int userId, int productId, int quantity, String createdAt) {
        this.id = id;
        this.userId = userId;
        this.productId = productId;
        this.quantity = quantity;
        this.createdAt = createdAt;
    }

    public int getId() {
        return id;
    }

    public int getUserId() {
        return userId;
    }

    public int getProductId() {
        return productId;
    }

    public int getQuantity() {
        return quantity;
    }

    public String getCreatedAt() {
        return createdAt;
    }
}