package com.aishwarya.immigration.controller;

import com.aishwarya.immigration.model.ImmigrationCase;
import com.aishwarya.immigration.repository.ImmigrationCaseRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/cases")
public class CaseController {
    private final ImmigrationCaseRepository repository;

    public CaseController(ImmigrationCaseRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<ImmigrationCase> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImmigrationCase> getOne(@PathVariable Long id) {
        return repository.findById(id).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ImmigrationCase create(@Valid @RequestBody ImmigrationCase item) {
        return repository.save(item);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ImmigrationCase> update(@PathVariable Long id,
                                                   @Valid @RequestBody ImmigrationCase input) {
        return repository.findById(id).map(existing -> {
            existing.setCaseName(input.getCaseName());
            existing.setVisaCategory(input.getVisaCategory());
            existing.setReceiptNumber(input.getReceiptNumber());
            existing.setFilingDate(input.getFilingDate());
            existing.setStatus(input.getStatus());
            return ResponseEntity.ok(repository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
