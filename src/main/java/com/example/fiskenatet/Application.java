package com.example.fiskenatet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;
import java.util.logging.FileHandler;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;


@SpringBootApplication
public class Application {

	public static final Logger log = Logger.getLogger(Application.class.getName());

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);

/*
		try {
			FileHandler fileHandler = new FileHandler("logging.txt", true);
			fileHandler.setFormatter(new SimpleFormatter());
			log.addHandler(fileHandler);
			log.info("Program started and new log file was created");
		} catch (IOException e) {
			e.printStackTrace();
		}*/

	}

}
