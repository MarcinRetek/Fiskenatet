package com.example.fiskenatet.main;

import com.example.fiskenatet.Application;
import com.example.fiskenatet.models.BidModel;
import com.example.fiskenatet.models.ProductModel;
import com.example.fiskenatet.models.UserModel;

import java.util.List;
import java.util.Properties;
import java.util.logging.Logger;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;


public class MailHandler {

    Logger log = Logger.getLogger(Application.class.getName());

    public Session setUpMail() {

        final String username = "fiskenaetet@gmail.com";
        final String password = "fisk12345";

        Properties properties = new Properties();
        properties.put("mail.smtp.ssl.trust", "smtp.gmail.com");
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.smtp.host", "smtp.gmail.com");
        properties.put("mail.smtp.port", "587");

        Session session = Session.getInstance(properties, new javax.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });
        log.info("Method 'setUpMail' ran with email: " +username+ " and password: " +password);
        return session;
    }

    public void sendWinnerNotification(UserModel owner, UserModel winner, ProductModel soldProduct) {
        try {
            List<BidModel> bidList = soldProduct.getListOfBids();
            BidModel highestBid = bidList.get(bidList.size() - 1);
            Message message = new MimeMessage(setUpMail());
            message.setFrom(new InternetAddress("fiskenaetet@gmail.com"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(winner.getEmail()));
            message.setSubject("Du vann en auktion!");
            message.setText("Grattis " + winner.getFirstName() + "! Du vann budgivningen på " + owner.getUserName() + "'s " + soldProduct.getTitle()
                    + "\n" + "Slutpris: " + highestBid.getAmount() + ":-"
                    + "\n" + getSellerPaymentMethodForMail(owner, highestBid)
                    + "\n" + ""
                    + "\n" + "Hälsningar Fiskenätet!");
            Transport.send(message);
            log.info("Called method 'sendWinnerNotification' that sent a winner-mail to " +winner.getEmail());
        } catch (MessagingException e) {
            log.warning("Warning in method 'sendWinnerNotification'. MessagingException: " +e);
            //throw new RuntimeException(e);
        }
    }

    private String getSellerPaymentMethodForMail(UserModel seller, BidModel highestBid){
        String toWinnerMail = "";
        if(seller.getPaymentMethod() == 1){
            toWinnerMail = "Betala säljaren via Swish till: " + seller.getMobileNumber();
        }if(seller.getPaymentMethod() == 2){
            toWinnerMail = "Betala säljaren via PayPal: " + "https://www.paypal.me/"+ seller.getPayPalUserName() + "/" + highestBid.getAmount();
        }if(seller.getPaymentMethod() == 3){
            toWinnerMail = "Betala säljaren via Swish till: " + seller.getMobileNumber()
                            + "\n" + "Eller betala säljaren via PayPal: " + "https://www.paypal.me/"+ seller.getPayPalUserName() + "/" + highestBid.getAmount();
        }
        return toWinnerMail;
    }

    public void sendSellerNotification(UserModel owner, UserModel winner, ProductModel soldProduct) {
        try {
            List<BidModel> bidList = soldProduct.getListOfBids();
            BidModel highestBid = bidList.get(bidList.size() - 1);
            Message message = new MimeMessage(setUpMail());
            message.setFrom(new InternetAddress("fiskenaetet@gmail.com"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(owner.getEmail()));
            message.setSubject("Din annons har sålts!");
            message.setText("Grattis " + owner.getFirstName() + "! Din annons '" + soldProduct.getTitle() + "' har sålts för " + highestBid.getAmount() + ":-"
                    + "\n" + "Köparen är: " + winner.getUserName()
                    + "\n" + winner.getFirstName() + " " + winner.getLastName()
                    + "\n" + winner.getEmail()
                    + "\n" + winner.getMobileNumber()
                    + "\n" + winner.getAddress() + " " + winner.getPostCode()
                    + "\n" + ""
                    + "\n" + "När du mottagit betalningen från köparen måste du logga in på din sida och bekräfta betalningen!"
                    + "\n" + ""
                    + "\n" + "Hälsningar Fiskenätet!");

            Transport.send(message);
            log.info("Called method 'sendSellerNotification' that sent a mail to seller " +owner.getEmail());
        } catch (MessagingException e) {
            log.warning("Warning in method 'sendSellerNotification'. MessagingException: " +e);
            //throw new RuntimeException(e);
        }
    }

    public void sendNewBidNotification(ProductModel currentProduct, BidModel bidModel, UserModel lastBidder) {

        try {
            Message message = new MimeMessage(setUpMail());
            message.setFrom(new InternetAddress("fiskenaetet@gmail.com"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(lastBidder.getEmail()));
            message.setSubject("Du blev överbudad");
            message.setText("Någon har budat över på '" + currentProduct.getTitle() + "'"
                    + "\n" + "Skynda dig in för att lägga ett nytt bud!"
                    + "\n" + "Nuvarande högsta bud är: " + bidModel.getAmount() + ":-"
                    + "\n" + ""
                    + "\n" + "Hälsningar Fiskenätet!");
                Transport.send(message);
                log.info("Called method 'sendNewBidNotification' that sent a mail to " +lastBidder.getEmail()+ " who just got overbidded");

            } catch (MessagingException e) {
                log.warning("Warning in method 'sendNewBidNotification'. MessagingException: " +e);
                //throw new RuntimeException(e);
            }
    }

    public void sendLoserNotification(ProductModel currentProduct, UserModel loser, UserModel seller, BidModel endBid) {
        try {

            Message message = new MimeMessage(setUpMail());
            message.setFrom(new InternetAddress("fiskenaetet@gmail.com"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(loser.getEmail()));
            message.setSubject("Du förlorade en budgivning");
            message.setText("Du förlorade budgivningen på '" + seller.getUserName() + "'s " + currentProduct.getTitle() + "'"
                    + "\n" + "Slutpriset blev: " + endBid.getAmount() + ":-"
                    + "\n" + "Lycka till nästa gång!"
                    + "\n" + ""
                    + "\n" + "Hälsningar Fiskenätet!");

            Transport.send(message);
            log.info("Called method 'sendSellerNotification' that sent a mail to loser " +loser.getEmail());
        } catch (MessagingException e) {
            log.warning("Warning in method 'sendLoserNotification'. MessagingException: " +e);
            //throw new RuntimeException(e);
        }

    }

    public boolean controlUserMail(String email) {
        boolean validMail;
        try {
            Message message = new MimeMessage(setUpMail());
            message.setFrom(new InternetAddress("fiskenaetet@gmail.com"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
            message.setSubject("Välkommen till Fiskenätet");
            message.setText("Tack för din registrering hos Fiskenätet!"
                    + "\n" + "Detta är ett verifikationsmejl."
                    + "\n" + "Lycka till med dina framtida auktioner."
                    + "\n" + ""
                    + "\n" + "Hälsningar Fiskenätet!");
            Transport.send(message);
            validMail = true;
            log.info("Called method 'controlUserMail' that sent a welcome mail to " +email);
        } catch(MessagingException e){
            log.warning("Warning in method 'controlUserMail'. MessagingException: " +e);
            validMail = false;
        }
        return validMail;
    }

    public void sendSellerNotificationProductNotSold(UserModel owner, ProductModel product) {
        try {
            Message message = new MimeMessage(setUpMail());
            message.setFrom(new InternetAddress("fiskenaetet@gmail.com"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(owner.getEmail()));
            message.setSubject("Tiden för din annons har gått ut");
            message.setText("Hej " + owner.getFirstName() + "\n" + "Din annons '" + product.getTitle() + "' har gått ut utan att någon har budat på den. "
                    + "\n" + "Logga in på din sida för att se mer information."
                    + "\n" + ""
                    + "\n" + "Hälsningar Fiskenätet!");

            Transport.send(message);
            log.info("Called method 'sendSellerNotificationProductNotSold' that sent a mail to seller " +owner.getEmail());
        } catch (MessagingException e) {
            log.warning("Warning in method 'sendSellerNotificationProductNotSold'. MessagingException: " +e);
            //throw new RuntimeException(e);
        }
    }
}