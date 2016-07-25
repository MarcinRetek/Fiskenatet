package com.example.fiskenatet.controllers;

import com.example.fiskenatet.models.UserModel;
import com.example.fiskenatet.services.UserService;
import javassist.bytecode.stackmap.TypeData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.ws.rs.Path;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.*;


@RestController
public class UserController {

    @Autowired
    private UserService userService;

    // check in db in user exist and if any input field is empty,
    // if not, create new user
    @CrossOrigin
    @RequestMapping(value = "/users/", method = RequestMethod.POST)
    public String createUser(@RequestBody UserModel userModel) {
        String validUser = userService.validateUserInputWhenCreating(userModel);
        if(validUser.equals("OK")){
            userService.saveUser(userModel);
        }
        return validUser;
    }

    // get specific user with ID
    @CrossOrigin
    @RequestMapping(value = "/users/{id}", method = RequestMethod.GET)
    public ResponseEntity<UserModel> getUser(@PathVariable Long id) {
        return new ResponseEntity<UserModel>(userService.findUser(id), HttpStatus.OK);
    }

    // get specific with username
    @CrossOrigin
    @RequestMapping(value = "/username/{userName}", method = RequestMethod.GET)
    public ResponseEntity<UserModel>getUserByUserName(@PathVariable String userName) {
        return new ResponseEntity<UserModel>(userService.findUserByUserName(userName), HttpStatus.OK);
    }


    // get all users
    @CrossOrigin
    @RequestMapping(value = "/users", method = RequestMethod.GET)
    public ResponseEntity<List<UserModel>> getAllUsers() {
        return new ResponseEntity<List<UserModel>>(userService.findAllUsers(), HttpStatus.OK);
    }

    // delete specific user
    @CrossOrigin
    @RequestMapping(value = "/users/{id}", method = RequestMethod.DELETE)
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUserInDatabase(id);
    }

    // update user
    @CrossOrigin
    @RequestMapping(value = "/users/{id}", method = RequestMethod.PUT)
    public String updateUser(@PathVariable Long id, @RequestBody UserModel userModel){
        String validUser = userService.validateUserInputWhenUpdating(id, userModel);
        if(validUser.equals("OK")){
            userService.updateUserInDatabase(id, userModel);
        }
        return validUser;
    }

    // set buyer rating
    @CrossOrigin
    @RequestMapping(value = "/users/setbuyerrating/{id}", method = RequestMethod.PUT)
    public void rateABuyer(@PathVariable Long id, @RequestBody String addRating){
        userService.saveBuyerRating(id, addRating);
    }

    // set seller rating
    @CrossOrigin
    @RequestMapping(value = "/users/setsellerrating/{id}", method = RequestMethod.PUT)
    public void rateASeller(@PathVariable Long id, @RequestBody String addRating){
        userService.saveSellerRating(id, addRating);
    }

    // get buyer rating
    @CrossOrigin
    @RequestMapping(value = "/users/getbuyerrating/{id}", method = RequestMethod.GET)
    public String getBuyerRate(@PathVariable Long id){
        return (userService.findBuyerRating(id));
    }

    // get seller rating
    @CrossOrigin
    @RequestMapping(value = "/users/getsellerrating/{id}", method = RequestMethod.GET)
    public String getSellerRate(@PathVariable Long id){
        return (userService.findSellerRating(id));
    }
}
