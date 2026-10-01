package com.ruralconnect.model;

public class Product {
    private int id; private String name, unit, category, emoji, description, producer, location; private double price; private int stock;
    public Product(int id,String name,double price,String unit,int stock,String category,String emoji,String description,String producer,String location){this.id=id;this.name=name;this.price=price;this.unit=unit;this.stock=stock;this.category=category;this.emoji=emoji;this.description=description;this.producer=producer;this.location=location;}
    public int getId(){return id;} public String getName(){return name;} public double getPrice(){return price;} public String getUnit(){return unit;} public int getStock(){return stock;} public String getCategory(){return category;} public String getEmoji(){return emoji;} public String getDescription(){return description;} public String getProducer(){return producer;} public String getLocation(){return location;}
}
