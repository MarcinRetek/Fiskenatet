package com.example.fiskenatet.main;

import com.example.fiskenatet.Application;
import com.example.fiskenatet.models.UserModel;

import java.util.logging.Logger;

/**
 * Created by nordi_000 on 2016-04-28.
 */
public class UserRating {

    Logger log = Logger.getLogger(Application.class.getName());
    // Från backend till frontend. Hämtar betyg från databasen och räknar
    // snittbetyget och retunerar detta som en string.
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


    // Input från frontend till backend. Lägger på det nya betyget på dom andra.
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

    // Input från frontend till backend. Lägger på det nya betyget på dom andra.
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
