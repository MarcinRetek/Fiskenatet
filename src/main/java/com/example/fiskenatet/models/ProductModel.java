package com.example.fiskenatet.models;


import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.List;


@SuppressWarnings("serial")
@Entity
@Table(name = "products")
public class ProductModel implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "product_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private UserModel owner;

    @OneToMany(mappedBy = "currentProduct", cascade = CascadeType.ALL)
    private List<BidModel> listOfBids;

    @Column(name = "buy_now_price")
    private int buyNowPrice;

    @Column(name = "start_price")
    private int startPrice = 0;

    @Lob
    @Column(name = "description")
    private String description;

    private String title;

    @Column(name = "start_date")
    private Date startDate;

    @Column(name = "end_date")
    private Date endDate;

    private String image;

    private String category;

    @Column(name = "is_sold")
    private String isSold = "no";


    public ProductModel() {

    }

    public String getIsSold() {
        return isSold;
    }

    public void setIsSold(String isSold) {
        this.isSold = isSold;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {

        this.category = category;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public String getImage() {

        return image;
    }

    public void setImage(String image) {

        this.image = image;
    }

    public Date getEndDate() {

        return endDate;
    }

    public void setEndDate(Date endDate) {

        this.endDate = endDate;
    }

    public Date getStartDate() {

        return startDate;
    }

    public void setStartDate(Date startDate) {

        this.startDate = startDate;
    }

    public String getTitle() {

        return title;
    }

    public void setTitle(String title) {

        this.title = title;
    }

    public int getBuyNowPrice() {

        return buyNowPrice;
    }

    public void setBuyNowPrice(int buyNowPrice) {

        this.buyNowPrice = buyNowPrice;
    }

    public int getStartPrice() {

        return startPrice;
    }

    public void setStartPrice(int startPrice) {

        this.startPrice = startPrice;
    }

    public String getDescription() {

        return description;
    }

    public void setDescription(String description) {

        this.description = description;
    }

    public Long getOwner() {
        return owner.getId();
    }

    public void setOwner(UserModel owner) {
        this.owner = owner;
    }

    public List<BidModel> getListOfBids() {
        return listOfBids;
    }

    public void setListOfBids(List<BidModel> listOfBids) {
        this.listOfBids = listOfBids;
    }
}


