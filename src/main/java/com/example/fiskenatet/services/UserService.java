package com.example.fiskenatet.services;

import com.example.fiskenatet.Application;
import com.example.fiskenatet.main.MailHandler;
import com.example.fiskenatet.main.UserRating;
import com.example.fiskenatet.main.Validation;
import com.example.fiskenatet.models.HistoryModel;
import com.example.fiskenatet.models.UserModel;
import com.example.fiskenatet.repositories.HistoryRepository;
import com.example.fiskenatet.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.logging.Logger;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private HistoryRepository historyRepository;

    private MailHandler mailHandler = new MailHandler();
    private Validation validation = new Validation();

    //Logging logging = new Logging();
    //Logger log = logging.createLog();

    Logger log = Logger.getLogger(Application.class.getName());

    // create user
    public void saveUser(UserModel userModel) {
        userRepository.saveAndFlush(userModel);
        log.info("New user created with ID = " +userModel.getId());
    }

    
    // get user with specific ID
    public UserModel findUser(Long id) {
        UserModel userModel = userRepository.getOne(id);
        System.out.println("User id = " + id);
        System.out.println("User model = " +userModel.getFirstName());
        log.info("Called method 'findUser' with ID = " +userModel.getId());
        return userModel;
    }

    // get specific user with username
    public UserModel findUserByUserName(String userName) {
        UserModel userModel = userRepository.findUserByUserName(userName);
        log.info("Called method 'findUserByUserName' with username '" +userModel.getUserName()+ "'");
        return userModel;
    }

    // get all users
    public List<UserModel> findAllUsers() {
        List<UserModel> userList = userRepository.findAll();
        log.info("Called method 'findAllUsers' that returned a list of " +userList.size()+ " users");
        return userList;
    }

    // delete user with ID
    public void deleteUserInDatabase(Long id) {
        userRepository.delete(id);
        log.info("User deleted with ID = " +id);
    }

    // update user with ID
    public void updateUserInDatabase(Long id, UserModel userModel) {
        UserModel userToUpdate = userRepository.getOne(id);
        userToUpdate.setUserName(userModel.getUserName());
        userToUpdate.setFirstName(userModel.getFirstName());
        userToUpdate.setLastName(userModel.getLastName());
        userToUpdate.setEmail(userModel.getEmail());
        userToUpdate.setMobileNumber(userModel.getMobileNumber());
        userToUpdate.setPassword(userModel.getPassword());
        userToUpdate.setPaymentMethod(userModel.getPaymentMethod());
        userToUpdate.setAddress(userModel.getAddress());
        userToUpdate.setPostCode(userModel.getPostCode());
        userToUpdate.setPayPalUserName(userModel.getPayPalUserName());
        userRepository.saveAndFlush(userToUpdate);
        log.info("User with ID = " +id+ " has been updated by method 'updateUserInDatabase'");
    }

    public void saveBuyerRating(Long id, String addRating){
        UserModel userToUpdate = userRepository.getOne(id);
        String oldRating = userToUpdate.getRatingAsBuyer();   // gamla betyget
        UserRating userRating = new UserRating();
        userRating.setBuyerRatingForDatabase(userToUpdate, oldRating, addRating);
        userRepository.saveAndFlush(userToUpdate);
        log.info("Saved new buyer rating for user with ID = " +id+ " through method 'saveBuyerRating'");
    }

    public void saveSellerRating(Long id, String addRating){
        UserModel userToUpdate = userRepository.getOne(id);
        String oldRating = userToUpdate.getRatingAsSeller();   // gamla betyget
        UserRating userRating = new UserRating();
        userRating.setSellerRatingForDatabase(userToUpdate, oldRating, addRating);
        userRepository.saveAndFlush(userToUpdate);
        log.info("Saved new seller rating for user with ID = " +id+ " through method 'saveSellerRating'");
    }

    public String findBuyerRating(Long id){
        UserModel userModel = userRepository.getOne(id);
        String buyersFullRating = userModel.getRatingAsBuyer();
        UserRating userRating = new UserRating();
        String averageRating = userRating.getUserAverageRating(buyersFullRating);
        log.info("Called method 'findBuyerRating' with ID = " +id+ " that returned buyers average rating " +averageRating);
        return averageRating;
    }

    public String findSellerRating(Long id){
        UserModel userModel = userRepository.getOne(id);
        String sellersFullRating = userModel.getRatingAsSeller();
        UserRating userRating = new UserRating();
        String averageRating = userRating.getUserAverageRating(sellersFullRating);
        log.info("Called method 'findSellerRating' with ID = " +id+ " that returned sellers average rating " +averageRating);
        return averageRating;
    }

    public String validateUserInputWhenUpdating(Long id, UserModel userModel){
        List<UserModel> userList = userRepository.findAll();
        List<HistoryModel> historyList = historyRepository.findAll();

        for(UserModel compareUser : userList) {
            if(compareUser.getId() == id) {
                userList.remove(compareUser);
                break;
            }
        }
        String checkUser = validation.validateUserNameAndEmail(userList, historyList, userModel);
        if(checkUser.equals("OK")){
            checkUser = validation.controlUserInput(userModel, checkUser);
        }

        log.info("Called method 'validateUserInputWhenUpdating' for user with ID = " + id + " that returned string: " + checkUser);
        return checkUser;
    }

    public String validateUserInputWhenCreating(UserModel userModel){
        List<UserModel> userList = userRepository.findAll();
        List<HistoryModel> historyList = historyRepository.findAll();

        String checkUser = validation.validateUserNameAndEmail(userList, historyList, userModel);
        if(checkUser.equals("OK")){
            checkUser = validation.controlUserInput(userModel, checkUser);
            if(checkUser.equals("OK")){
               boolean verifyMail = mailHandler.controlUserMail(userModel.getEmail());
                if(verifyMail == false){
                    checkUser = "Ange en giltig e-postadress";
                }
            }
        }
        log.info("Called method 'validateUserInputWhenCreating' for user with username = " + userModel.getUserName() + " that returned string: " + checkUser);
        return checkUser;
    }

}
