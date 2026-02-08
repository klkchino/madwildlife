package com.example.backend.service;

import com.example.backend.model.ExampleItem;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ExampleService {

    private static final String COLLECTION = "exampleItems";

    public void saveItem(ExampleItem item) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        db.collection(COLLECTION).document(item.getId()).set(item).get();
    }

    public List<ExampleItem> getAllItems() throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        List<ExampleItem> items = new ArrayList<>();
        db.collection(COLLECTION)
          .get()
          .get()
          .getDocuments()
          .forEach(doc -> items.add(doc.toObject(ExampleItem.class)));

        return items;
    }
}

