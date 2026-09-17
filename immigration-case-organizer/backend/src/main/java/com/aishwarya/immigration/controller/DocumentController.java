package com.aishwarya.immigration.controller;

import com.aishwarya.immigration.model.Document;
import com.aishwarya.immigration.repository.DocumentRepository;
import com.aishwarya.immigration.repository.ImmigrationCaseRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api")
public class DocumentController {
    private final DocumentRepository documents;
    private final ImmigrationCaseRepository cases;

    public DocumentController(DocumentRepository documents, ImmigrationCaseRepository cases) {
        this.documents = documents;
        this.cases = cases;
    }

    @GetMapping("/cases/{caseId}/documents")
    public List<Document> getForCase(@PathVariable Long caseId) {
        return documents.findByImmigrationCaseId(caseId);
    }

    @PostMapping("/cases/{caseId}/documents")
    public ResponseEntity<Document> create(@PathVariable Long caseId, @Valid @RequestBody Document input) {
        return cases.findById(caseId).map(c -> {
            input.setImmigrationCase(c);
            return ResponseEntity.ok(documents.save(input));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/documents/{id}")
    public ResponseEntity<Document> update(@PathVariable Long id, @Valid @RequestBody Document input) {
        return documents.findById(id).map(existing -> {
            existing.setName(input.getName());
            existing.setCategory(input.getCategory());
            existing.setExpirationDate(input.getExpirationDate());
            existing.setStatus(input.getStatus());
            return ResponseEntity.ok(documents.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/documents/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!documents.existsById(id)) return ResponseEntity.notFound().build();
        documents.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
