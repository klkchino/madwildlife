package com.example.backend.controller;

import com.example.backend.model.ExampleItem;
import com.example.backend.service.ExampleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/example")
@CrossOrigin // important for frontend later
public class ExampleController {

    private final ExampleService service;

    public ExampleController(ExampleService service) {
        this.service = service;
    }

    @GetMapping
    public List<ExampleItem> getAll() throws Exception {
        return service.getAllItems();
    }

    @PostMapping
    public String create(@RequestBody ExampleItem item) throws Exception {
        service.saveItem(item);
        return "Saved";
    }
}

