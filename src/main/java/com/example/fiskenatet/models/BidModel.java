package com.example.fiskenatet.models;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;


@SuppressWarnings("serial")
@Entity
@Table(name = "bids")
public class BidModel implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "bid_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private ProductModel currentProduct;

    @ManyToOne
    @JoinColumn(name = "bidder_id")
    private UserModel bidder;

    private String bidderUserName;


    private int amount;

    @Column (name = "bid_date")
    private Date bidDate;

    public BidModel(){

    }

    public String getBidderUserName() {
        return bidderUserName;
    }

    public void setBidderUserName(String bidderUserName) {
        this.bidderUserName = bidderUserName;
    }

    public Date getBidDate() {
        return bidDate;
    }

    public void setBidDate(Date bidDate) {
        this.bidDate = bidDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id){
        this.id = id;
    }

    public Long getCurrentProduct() {
        return currentProduct.getId();
    }

    public void setCurrentProduct(ProductModel currentProduct) {
        this.currentProduct = currentProduct;
    }

    public Long getBidder() {
        return bidder.getId();
    }

    public void setBidder(UserModel bidder) {
        this.bidder = bidder;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }
}
