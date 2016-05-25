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

    //kolla databasen efter användarDublett & så inga fält är tomma
    //om allt ok, lägger till användaren i databasen
    @CrossOrigin
    @RequestMapping(value = "/users/", method = RequestMethod.POST)
    public String createUser(@RequestBody UserModel userModel) {
        System.out.println("första vändan i controllern");
        String validUser = userService.validateUserInputWhenCreating(userModel);
        System.out.println("tillbaka i controller " + validUser);
        if(validUser.equals("OK")){
            userService.saveUser(userModel);
        }
        return validUser;
    }

    // hämta specifik user med ID
    @CrossOrigin
    @RequestMapping(value = "/users/{id}", method = RequestMethod.GET)
    public ResponseEntity<UserModel> getUser(@PathVariable Long id) {
        return new ResponseEntity<UserModel>(userService.findUser(id), HttpStatus.OK);
    }

    // hämta specifik user med USERNAME
    @CrossOrigin
    @RequestMapping(value = "/username/{userName}", method = RequestMethod.GET)
    public ResponseEntity<UserModel>getUserByUserName(@PathVariable String userName) {
        return new ResponseEntity<UserModel>(userService.findUserByUserName(userName), HttpStatus.OK);
    }


    // hämta alla users
    @CrossOrigin
    @RequestMapping(value = "/users", method = RequestMethod.GET)
    public ResponseEntity<List<UserModel>> getAllUsers() {
        return new ResponseEntity<List<UserModel>>(userService.findAllUsers(), HttpStatus.OK);
    }

    // delete specifik user
    @CrossOrigin
    @RequestMapping(value = "/users/{id}", method = RequestMethod.DELETE)
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUserInDatabase(id);
    }

    //kontrollerar först användarens inmatade uppgifter
    // om allt är ok - uppdatera användare
    @CrossOrigin
    @RequestMapping(value = "/users/{id}", method = RequestMethod.PUT)
    public String updateUser(@PathVariable Long id, @RequestBody UserModel userModel){
        String validUser = userService.validateUserInputWhenUpdating(id, userModel);
        if(validUser.equals("OK")){
            userService.updateUserInDatabase(id, userModel);
        }
        return validUser;
    }

    @CrossOrigin
    @RequestMapping(value = "/users/setbuyerrating/{id}", method = RequestMethod.PUT)
    public void rateABuyer(@PathVariable Long id, @RequestBody String addRating){
        userService.saveBuyerRating(id, addRating);
    }

    @CrossOrigin
    @RequestMapping(value = "/users/setsellerrating/{id}", method = RequestMethod.PUT)
    public void rateASeller(@PathVariable Long id, @RequestBody String addRating){
        userService.saveSellerRating(id, addRating);
    }

    @CrossOrigin
    @RequestMapping(value = "/users/getbuyerrating/{id}", method = RequestMethod.GET)
    public String getBuyerRate(@PathVariable Long id){
        return (userService.findBuyerRating(id));
    }

    @CrossOrigin
    @RequestMapping(value = "/users/getsellerrating/{id}", method = RequestMethod.GET)
    public String getSellerRate(@PathVariable Long id){
        return (userService.findSellerRating(id));
    }
}
