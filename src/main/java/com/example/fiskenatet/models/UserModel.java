package com.example.fiskenatet.models;

import com.example.fiskenatet.main.UserRating;
import com.example.fiskenatet.services.HistoryService;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.List;

/**
 * Created by Erik on 2016-04-27.
 */

@SuppressWarnings("serial")
@Entity
@Table(name = "users")
public class UserModel implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "user_id")
    private Long id;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
    private List<ProductModel> listOfProducts;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
    private List<HistoryModel> listOfHistory;

    @OneToMany(mappedBy = "bidder", cascade = CascadeType.ALL)
    private List<BidModel> listOfBids;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "password")
    @Size(min = 5, max = 64)
    private String password;

    @Column(name = "email")
    private String email;

    @Column(name = "mobile_number")
    private String mobileNumber;

    @Lob
    @Column(name = "rating_as_seller")
    private String ratingAsSeller = "No rating yet";

    @Lob
    @Column(name = "rating_as_buyer")
    private String ratingAsBuyer = "No rating yet";

    @Column(name = "payment_method")
    private int paymentMethod;

    @Column(name = "paypal_username")
    private String payPalUserName;

    private String address;

    @Column (name = "postal_code")
    private String postCode;

    public Long getId() {
        return id;
    }

    public List<HistoryModel> getListOfHistory() {
        return listOfHistory;
    }

    public void setListOfHistory(List<HistoryModel> listOfHistory) {
        this.listOfHistory = listOfHistory;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<ProductModel> getListOfProducts() {
        return listOfProducts;
    }

    public void setListOfProducts(List<ProductModel> listOfProducts) {
        this.listOfProducts = listOfProducts;
    }

    public List<BidModel> getListOfBids() {
        return listOfBids;
    }

    public void setListOfBids(List<BidModel> listOfBids) {
        this.listOfBids = listOfBids;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getRatingAsSeller() {
        return ratingAsSeller;
    }

    public void setRatingAsSeller(String ratingAsSeller) {
        this.ratingAsSeller = ratingAsSeller;
    }

    public String getRatingAsBuyer() {
        return ratingAsBuyer;
    }

    public void setRatingAsBuyer(String ratingAsBuyer) {
        this.ratingAsBuyer = ratingAsBuyer;
    }

    public int getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(int paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPayPalUserName() {
        return payPalUserName;
    }

    public void setPayPalUserName(String payPalUserName) {
        this.payPalUserName = payPalUserName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPostCode() {
        return postCode;
    }

    public void setPostCode(String postCode) {
        this.postCode = postCode;
    }
}
