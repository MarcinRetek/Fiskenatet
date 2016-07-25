package com.example.fiskenatet.controllers;


import java.util.ArrayList;
import java.util.List;

import com.example.fiskenatet.main.Validation;
import com.example.fiskenatet.models.HistoryModel;
import com.example.fiskenatet.models.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.example.fiskenatet.models.ProductModel;
import com.example.fiskenatet.services.ProductService;

import javax.validation.Valid;

@RestController
public class ProductController {

    @Autowired
    private ProductService productService;

    private Validation validation = new Validation();

    // check that every product is correct.
    // if so, create new product in db.
    @CrossOrigin
    @RequestMapping(value = "/products", method = RequestMethod.POST)
    public String createProduct(@RequestBody ProductModel productModel) {
        String validProduct = productService.validateProductInput(productModel);
        if(validProduct.equals("OK")) {
            productService.saveProduct(productModel);
        }
        return validProduct;
    }

    // get all products
    @CrossOrigin
    @RequestMapping(value = "/products", method = RequestMethod.GET)
    public ResponseEntity<List<ProductModel>> getAllProducts() {
        return new ResponseEntity<List<ProductModel>>(productService.findAllProducts(), HttpStatus.OK);
    }

    // delete product
    @CrossOrigin
    @RequestMapping(value = "/products/{id}", method = RequestMethod.DELETE)
    public void deleteProduct(@PathVariable Long id){
        productService.deleteProductInDatabase(id);
    }


    // Update product
    @CrossOrigin
    @RequestMapping(value = "/products/{id}", method = RequestMethod.PUT)
    public String updateProduct(@PathVariable Long id, @RequestBody ProductModel productModel){
        String validProduct = productService.validateProductInput(productModel);
        if(validProduct.equals("OK")) {
            productService.updateProductInDatabase(id, productModel);
        }
        return validProduct;
    }

    // Change product to sold
    @CrossOrigin
    @RequestMapping(value = "/products/issold/{id}", method = RequestMethod.PUT)
    public void updateProductWhenSold(@PathVariable Long id){
        productService.updateProductWhenSold(id);
    }

    // Get a specific user
    @CrossOrigin
    @RequestMapping(value = "/products/{id}", method = RequestMethod.GET)
    public ResponseEntity <ProductModel> getSelectedProduct(@PathVariable Long id){
        return new ResponseEntity<ProductModel>(productService.findSelectedProduct(id), HttpStatus.OK);
    }

    // get all product from selected category
    @CrossOrigin
    @RequestMapping(value = "/products/category/{category}", method = RequestMethod.GET)
    public ResponseEntity<List<ProductModel>>getProductsByCategory(@PathVariable String category) {
        return new ResponseEntity<List<ProductModel>>(productService.findAllProductsByCategory(category), HttpStatus.OK);
    }

    // get all product from selected category which are not sold.
    @CrossOrigin
    @RequestMapping(value = "/products/category/notsold/{category}", method = RequestMethod.GET)
    public ResponseEntity<List<ProductModel>>getNotSoldProductsByCategory(@PathVariable String category) {
        return new ResponseEntity<List<ProductModel>>(productService.findAllProductsByCategoryNotSold(category), HttpStatus.OK);
    }

    // get all products from a specific acategory for a specific user
    @CrossOrigin
    @RequestMapping(value = "/products/byownerandcategory/{category}/{ownerId}", method = RequestMethod.GET)
    public ResponseEntity<List<ProductModel>>getProductByOwnerAndByCategory(@PathVariable String category,@PathVariable Long ownerId) {
        return new ResponseEntity<List<ProductModel>>(productService.findProductByOwnerAndByCategory(category, ownerId), HttpStatus.OK);
    }

    //get all products that are not sold
    @CrossOrigin
    @RequestMapping(value = "/products/productissold/{isSold}", method = RequestMethod.GET)
    public ResponseEntity<List<ProductModel>>getUnsoldProducts(@PathVariable String isSold) {
        return new ResponseEntity<List<ProductModel>>(productService.findProductsByIsSold(isSold), HttpStatus.OK);
    }

    // search product
    @CrossOrigin
    @RequestMapping(value = "/productsearch/{value}", method = RequestMethod.GET)
    public ResponseEntity<List<ProductModel>>searchProducts(@PathVariable String value) {
        return new ResponseEntity<List<ProductModel>>(productService.searchProducts(value), HttpStatus.OK);
    }

    // run when time has passed 4.00 pm and the auction has closed for the day
    @CrossOrigin
    @RequestMapping(value = "/products/endofday", method = RequestMethod.GET)
    public void auctionDayEnd() {
        productService.auctionDayEnd();

    }

    // add product to history
    @CrossOrigin
    @RequestMapping(value = "/products/addtohistory/{id}", method = RequestMethod.POST)
    public void createHistory(@PathVariable Long id) {

        productService.moveConfirmedProductToHistory(id);
    }

}

