package com.example.fiskenatet.repositories;

import com.example.fiskenatet.models.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.fiskenatet.models.ProductModel;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;

public interface ProductRepository extends JpaRepository<ProductModel, Long> {

    public List<ProductModel> findProductsByCategory(String category);

    public List<ProductModel> findProductsByCategoryAndOwnerId(String category, Long ownerId);

    public List<ProductModel> findProductsByIsSold(String isSold);

    public List<ProductModel> findProductsByTitleContaining(String title);

    public List<ProductModel> findProductsByDescriptionContaining(String description);

    public List<ProductModel> findProductsByEndDateBefore(Date endDate);

}

