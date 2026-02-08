package com.example.backend.service;

import com.example.backend.dto.TempLogRequest;
import com.example.backend.dto.FinalizeLogRequest;
import com.google.cloud.firestore.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserLogService {

    private final Firestore db;

    public UserLogService(Firestore db) {
        this.db = db;
    }

    // Save tempUserLog after photo capture
    public void saveTempUserLog(TempLogRequest req) {
        DocumentReference userRef = db
            .collection("userLogs")
            .document(req.userId);

        userRef.update("tempUserLog", Arrays.asList(
            req.photoRef,
            req.author,
            req.timestamp,
            req.location
        ));
    }

    // Convert tempUserLog → Flora/Fauna log
    public void finalizeUserLog(FinalizeLogRequest req) {
        try {
            DocumentReference userDoc = db
                .collection("userLogs")
                .document(req.userId);

            DocumentSnapshot userSnap = userDoc.get().get();
            List<Object> tempLog = (List<Object>) userSnap.get("tempUserLog");

            if (tempLog == null) {
                throw new RuntimeException("tempUserLog missing");
            }

            DocumentReference superLogRef = db
                .collection("superLogs")
                .document(req.category);

            Map<String, Object> species =
                (Map<String, Object>) superLogRef.get().get().get(req.speciesId);

            Map<String, Object> finalLog = new HashMap<>();
            finalLog.put("category", req.category);
            finalLog.put("photoRef", tempLog.get(0));
            finalLog.put("photoAuthor", tempLog.get(1));
            finalLog.put("timestamp", tempLog.get(2));
            finalLog.put("location", tempLog.get(3));
            finalLog.put("imageUrl", species.get("0"));
            finalLog.put("commonName", species.get("1"));
            finalLog.put("sciName", species.get("2"));
            finalLog.put("status", "logged");

            userDoc
                .collection(req.category)
                .document(req.speciesId + "_" + System.currentTimeMillis())
                .set(finalLog);

            userDoc.update("tempUserLog", FieldValue.delete());

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}

