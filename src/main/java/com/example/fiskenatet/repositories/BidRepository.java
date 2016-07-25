package com.example.fiskenatet.repositories;

import com.example.fiskenatet.models.BidModel;
import com.example.fiskenatet.models.ProductModel;
import com.example.fiskenatet.models.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.ArrayList;
import java.util.List;


public interface BidRepository extends JpaRepository<BidModel, Long> {

    public List<BidModel> findBidsByCurrentProduct(ProductModel product);

}
