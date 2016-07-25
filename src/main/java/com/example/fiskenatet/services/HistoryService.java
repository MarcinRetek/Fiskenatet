package com.example.fiskenatet.services;

import com.example.fiskenatet.Application;
import com.example.fiskenatet.models.HistoryModel;
import com.example.fiskenatet.models.ProductModel;
import com.example.fiskenatet.models.UserModel;
import com.example.fiskenatet.repositories.HistoryRepository;
import com.example.fiskenatet.repositories.ProductRepository;
import com.example.fiskenatet.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;


@Service
public class HistoryService {

    @Autowired
    HistoryRepository historyRepository;

    @Autowired

    ProductRepository productRepository;
    @Autowired
    UserRepository userRepository;

    Logger log = Logger.getLogger(Application.class.getName());

    // create history product
    public void saveHistory(HistoryModel historyModel) {
        historyRepository.saveAndFlush(historyModel);
        log.info("New history saved with ID: " + historyModel.getId());
    }

    // get all product with a specific user
    public List<HistoryModel> getHistoryByOwner(Long ownerId){
        List<HistoryModel> historyList = historyRepository.findHistoryByOwner(ownerId);
        log.info("Called method 'getHistoryByOwner' that returned a list of " + historyList.size() + " products from history for owner with ID: " + ownerId);
        return historyList;
    }
    public List<HistoryModel> getHistoryByBuyer(String username){
        List<HistoryModel> historyList = historyRepository.findHistoryByBuyerUsername(username);
        log.info("Called method 'getHistoryByBuyer' that returned a list of " + historyList.size() + " products from history for owner with username: " + username);
        return historyList;
    }


    public void runMe() {
        HistoryModel user = historyRepository.findOne(1L);
        UserModel model = userRepository.findOne(user.getOwner());
        System.out.println("User first name = " +model.getFirstName());
    }





}
