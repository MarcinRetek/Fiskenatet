package com.example.fiskenatet.main;

import com.example.fiskenatet.Application;
import com.example.fiskenatet.models.UserModel;

import java.util.logging.Logger;


public class UserRating {

    Logger log = Logger.getLogger(Application.class.getName());
    // From backend to frontend. Get rate from db and calculate
    // average rate and then return result as a string.
    public String getUserAverageRating(String ratingStringFromDB) {

        double totalRatingPoints = 0;
        String selectedNumber;
        double doubleAverageRating;
        String stringAverageRating="";
        if(ratingStringFromDB.equals("No rating yet")) {
            stringAverageRating = "No rating yet";
            log.info("Method 'getUserAverageRating' was called and returned 'No rating yet'");
            return stringAverageRating;
        } else {
            for (int i = 0; i < ratingStringFromDB.length(); i++) {
                selectedNumber = ratingStringFromDB.substring(i, i + 1);
                totalRatingPoints += Double.parseDouble(selectedNumber);
            }
            doubleAverageRating = (totalRatingPoints / ratingStringFromDB.length());
            stringAverageRating = Double.toString(Math.round(doubleAverageRating));
            stringAverageRating = stringAverageRating.substring(0, 1);
            log.info("Method 'getUserAverageRating' was called and returned " +stringAverageRating);
            return stringAverageRating;
        }
    }

    // input from frontend to backend. Add new rate to the other (old) one. Buyer.
    public void setBuyerRatingForDatabase(UserModel userModel, String oldRating, String newRating) {
        if(oldRating.equals("No rating yet")){
                userModel.setRatingAsBuyer(newRating);
                log.info("Called method 'setBuyerRatingForDatabase' that added "
                        +newRating+ " as rating for user with ID = " +userModel.getId());
        }else {
            userModel.setRatingAsBuyer(oldRating + newRating);
            log.info("Called method 'setBuyerRatingForDatabase' that added new rating "
                    +newRating+ " to old rating " +oldRating+ " for user with ID = " +userModel.getId());
        }

    }

    // input from frontend to backend. Add new rate to the other (old) one. Seller.
    public void setSellerRatingForDatabase(UserModel userModel, String oldRating, String newRating) {
        if(oldRating.equals("No rating yet")){
            userModel.setRatingAsSeller(newRating);
            log.info("Called method 'setSellerRatingForDatabase' that added "
                    +newRating+ " as rating for user with ID = " +userModel.getId());
        }else {
            userModel.setRatingAsSeller(oldRating + newRating);
            log.info("Called method 'setSellerRatingForDatabase' that added new rating "
                    +newRating+ " to old rating " +oldRating+ " for user with ID = " +userModel.getId());
        }
    }

}
