package com.ruralconnect.model;

public class Bid {

    private int id;
    private int auctionId;
    private int buyerId;
    private String bidderName;
    private double amount;
    private String bidTime;

    public Bid(
            int id,
            int auctionId,
            int buyerId,
            String bidderName,
            double amount,
            String bidTime) {

        this.id = id;
        this.auctionId = auctionId;
        this.buyerId = buyerId;
        this.bidderName = bidderName;
        this.amount = amount;
        this.bidTime = bidTime;
    }

    public int getId() {
        return id;
    }

    public int getAuctionId() {
        return auctionId;
    }

    public int getBuyerId() {
        return buyerId;
    }

    public String getBidderName() {
        return bidderName;
    }

    public double getAmount() {
        return amount;
    }

    public String getBidTime() {
        return bidTime;
    }
}