package com.madwildlife.backend;

import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.CollectionReference;
import com.google.firebase.cloud.FirestoreClient;
import com.google.api.core.ApiFuture;
import java.util.HashMap;
import java.util.Map;
import java.util.Date;
import java.util.concurrent.ExecutionException;

/**
 * Modifyed from documentCreate.js to Java for Firebase Firestore integration.
 * Handles Firebase Firestore document creation for the MadWildlife application.
 * Manages user profiles, user wildlife sightings logs, and active sightings data.
 */
public class DocumentCreationFirebase {

    private final Firestore db;
    private final CollectionReference usersRef;
    private final CollectionReference userlogRef;
    private final CollectionReference activeSightRef;

    /**
     * Constructor initializes Firestore database and collection references.
     */
    public DocumentCreationFirebase() {
        this.db = FirestoreClient.getFirestore();
        this.usersRef = db.collection("users");
        this.userlogRef = db.collection("userlog");
        this.activeSightRef = db.collection("activeSightings");
    }

    /**
     * Creates a new user document in the users collection.
     *
     * @param name  User's name
     * @param email User's email address
     * @return Document ID of the newly created user, or null if failed
     */
    public String userUpdate(String name, String email) {
        try {
            Map<String, Object> data = new HashMap<>();
            data.put("name", name);
            data.put("email", email);
            data.put("createdAt", new Date());

            ApiFuture<com.google.cloud.firestore.DocumentReference> future = usersRef.add(data);
            String docId = future.get().getId();
            System.out.println("New user added with ID: " + docId);
            return docId;
        } catch (InterruptedException | ExecutionException e) {
            System.err.println("Error creating user: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Creates a new userlog document recording a wildlife sighting.
     *
     * @param userId       Reference to the user who logged the sighting
     * @param speciesId    Reference to the species from wildlife library
     * @param speciesName  Common name of the species
     * @param fieldNotes   Observer's field notes and observations
     * @param photoRef     URL or reference to the photo taken
     * @param location     Geographic location of the sighting (GeoPoint or Map with lat/long)
     * @return Document ID of the newly created userlog, or null if failed
     */
    public String userlogUpdate(String userId, String speciesId, String speciesName, 
                                String fieldNotes, String photoRef, Map<String, Object> location) {
        try {
            Map<String, Object> data = new HashMap<>();
            data.put("userID", userId);
            data.put("speciesID", speciesId);
            data.put("speciesName", speciesName);
            data.put("fieldNotes", fieldNotes);
            data.put("photoRef", photoRef);
            data.put("location", location);
            data.put("createdAt", new Date());

            ApiFuture<com.google.cloud.firestore.DocumentReference> future = userlogRef.add(data);
            String docId = future.get().getId();
            System.out.println("New userlog added with ID: " + docId);
            return docId;
        } catch (InterruptedException | ExecutionException e) {
            System.err.println("Error creating userlog: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Creates a new active sighting document.
     * Active sightings are temporary records that decay after a specified time.
     *
     * @param userId       Reference to the user who reported the sighting
     * @param photoRef     URL or reference to the photo (user or professional)
     * @param location     Geographic location of the sighting
     * @param decayTimeMs  Time in milliseconds after which the sighting should expire (e.g., 3600000 for 1 hour)
     * @return Document ID of the newly created active sighting, or null if failed
     */
    public String activeSightingsUpdate(String userId, String photoRef, 
                                       Map<String, Object> location, long decayTimeMs) {
        try {
            Map<String, Object> data = new HashMap<>();
            data.put("userID", userId);
            data.put("photoRef", photoRef);
            data.put("location", location);
            data.put("createdAt", new Date());
            // Calculate expiration time
            data.put("decayTime", new Date(System.currentTimeMillis() + decayTimeMs));

            ApiFuture<com.google.cloud.firestore.DocumentReference> future = activeSightRef.add(data);
            String docId = future.get().getId();
            System.out.println("New activeSight added with ID: " + docId);
            return docId;
        } catch (InterruptedException | ExecutionException e) {
            System.err.println("Error creating active sighting: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Helper method to create a location object from coordinates.
     *
     * @param latitude  Latitude coordinate
     * @param longitude Longitude coordinate
     * @return Map containing latitude and longitude
     */
    public static Map<String, Object> createLocation(double latitude, double longitude) {
        Map<String, Object> location = new HashMap<>();
        location.put("latitude", latitude);
        location.put("longitude", longitude);
        return location;
    }




    /**
     * the QUERIES created in part by AI and ME
     */


    /

    /**
 * Get Species information by species ID from the wildlife library.
 *
 * @param speciesId The ID of the species to query
 * @return Map containing species data (name, common name, photoref), or null if not found
 */
public Map<String, Object> getSpeciesInfoBySpecies(String speciesId) {
    try {
        // Query the wildlifeLibrary collection for matching speciesID
        com.google.cloud.firestore.QuerySnapshot querySnapshot = db.collection("wildlifeLibrary")
            .whereEqualTo("speciesID", speciesId)
            .limit(1)
            .get().get();
        
        // Get the first (and only) matching document
        if (!querySnapshot.getDocuments().isEmpty()) {
            com.google.cloud.firestore.DocumentSnapshot document = querySnapshot.getDocuments().get(0);
            System.out.println("Species found with ID: " + speciesId);
            return document.getData();
        } else {
            System.out.println("Species not found with ID: " + speciesId);
            return null;
        }
    } catch (InterruptedException | ExecutionException e) {
        System.err.println("Error retrieving species info: " + e.getMessage());
        return null;
    }
}
 
    /**
 * Retrieves a user document by user ID.
 * @param userId The ID of the user to retrieve
 * @return Map containing user data, or null if not found
 */
public Map<String, Object> getUser(String userId) {
    try {
        com.google.cloud.firestore.DocumentSnapshot document = usersRef.document(userId).get().get();
        if (document.exists()) {
            return document.getData();
        } else {
            System.out.println("User not found with ID: " + userId);
            return null;
        }
    } catch (InterruptedException | ExecutionException e) {
        System.err.println("Error retrieving user: " + e.getMessage());
        return null;
    }
}

    /**
 * Retrieves all userlogs for a specific user.
 *
 * @param userId The ID of the user whose sightings to retrieve
 * @return List of userlog documents, or empty list if none found
 */
public java.util.List<Map<String, Object>> getUserlogs(String userId) {
    try {
        com.google.cloud.firestore.QuerySnapshot querySnapshot = userlogRef
            .whereEqualTo("userID", userId)
            .get().get();
        
        java.util.List<Map<String, Object>> results = new java.util.ArrayList<>();
        for (com.google.cloud.firestore.DocumentSnapshot doc : querySnapshot.getDocuments()) {
            results.add(doc.getData());
        }
        System.out.println("Retrieved " + results.size() + " userlogs for user: " + userId);
        return results;
    } catch (InterruptedException | ExecutionException e) {
        System.err.println("Error retrieving userlogs: " + e.getMessage());
        return new java.util.ArrayList<>();
    }
}
    /**
 * Retrieves active sightings (not yet expired).
 *
 * @return List of active sighting documents
 */
public java.util.List<Map<String, Object>> getActiveSightings() {
    try {
        com.google.cloud.firestore.QuerySnapshot querySnapshot = activeSightRef
            .whereLessThan("decayTime", new Date())
            .get().get();
        
        java.util.List<Map<String, Object>> results = new java.util.ArrayList<>();
        for (com.google.cloud.firestore.DocumentSnapshot doc : querySnapshot.getDocuments()) {
            results.add(doc.getData());
        }
        System.out.println("Retrieved " + results.size() + " active sightings");
        return results;
    } catch (InterruptedException | ExecutionException e) {
        System.err.println("Error retrieving active sightings: " + e.getMessage());
        return new java.util.ArrayList<>();
    }
}
}
