package com.madwildlife.backend.demo;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class DemoApplicationTests {

	@Test
	void contextLoads() {
	}

	@Test
	void testDocumentCreation() {
		
		DocumentCreationFirebase docCreator = new DocumentCreationFirebase();
		String userId = docCreator.userUpdate("Test User", "test@example.com");
		if (userId != null) {
			System.out.println("Created user with ID: " + userId);
		} else {
			System.out.println("Failed to create user.");
		}
	}

	@Test
	void testUserLogCreation() {
		DocumentCreationFirebase docCreator = new DocumentCreationFirebase();
		String userLogId = docCreator.userlogUpdate("userId123", "speciesId456", 
											"Saw a rare bird!", "http://example.com/photo.jpg", 37.7749, -122.4194);
		if (userLogId != null) {
			System.out.println("Created user log with ID: " + userLogId);
		} else {
			System.out.println("Failed to create user log.");
		}
	}
}