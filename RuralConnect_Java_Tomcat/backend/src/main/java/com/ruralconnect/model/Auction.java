package com.ruralconnect.model;

public class Auction {

    private int id;
    private int productId;
    private int producerId;
    private double startingBid;
    private int quantity;
    private String endsAt;

    public Auction(
            int id,
            int productId,
            int producerId,
            double startingBid,
            int quantity,
            String endsAt) {

        this.id = id;
        this.productId = productId;
        this.producerId = producerId;
        this.startingBid = startingBid;
        this.quantity = quantity;
        this.endsAt = endsAt;
    }

    public int getId() {
        return id;
    }

    public int getProductId() {
        return productId;
    }

    public int getProducerId() {
        return producerId;
    }

    public double getStartingBid() {
        return startingBid;
    }

    public int getQuantity() {
        return quantity;
    }

    public String getEndsAt() {
        return endsAt;
    }
}