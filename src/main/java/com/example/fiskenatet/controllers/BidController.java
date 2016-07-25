package com.example.fiskenatet.controllers;

import com.example.fiskenatet.models.BidModel;
import com.example.fiskenatet.models.ProductModel;
import com.example.fiskenatet.models.UserModel;
import com.example.fiskenatet.services.BidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
public class BidController {

    @Autowired
    private BidService bidService;

    // Create bid
    @CrossOrigin
    @RequestMapping(value = "/bids", method = RequestMethod.POST)
    public void createBid(@RequestBody BidModel bidModel) {
        bidService.saveBid(bidModel);
    }

}
