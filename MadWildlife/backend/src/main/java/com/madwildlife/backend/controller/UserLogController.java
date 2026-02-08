package com.example.backend.controller;

import com.example.backend.dto.TempLogRequest;
import com.example.backend.dto.FinalizeLogRequest;
import com.example.backend.service.UserLogService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/logs")
public class UserLogController {

    private final UserLogService userLogService;

    public UserLogController(UserLogService userLogService) {
        this.userLogService = userLogService;
    }

    // Step 1: Camera → tempUserLog
    @PostMapping("/temp")
    public void saveTempLog(@RequestBody TempLogRequest request) {
        userLogService.saveTempUserLog(request);
    }

    // Step 2: Field Guide → finalized log
    @PostMapping("/finalize")
    public void finalizeLog(@RequestBody FinalizeLogRequest request) {
        userLogService.finalizeUserLog(request);
    }
}

