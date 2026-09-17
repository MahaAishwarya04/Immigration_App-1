package com.aishwarya.immigration.controller;

import com.aishwarya.immigration.model.Deadline;
import com.aishwarya.immigration.repository.DeadlineRepository;
import com.aishwarya.immigration.repository.ImmigrationCaseRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api")
public class DeadlineController {
    private final DeadlineRepository deadlines;
    private final ImmigrationCaseRepository cases;

    public DeadlineController(DeadlineRepository deadlines, ImmigrationCaseRepository cases) {
        this.deadlines = deadlines;
        this.cases = cases;
    }

    @GetMapping("/cases/{caseId}/deadlines")
    public List<Deadline> getForCase(@PathVariable Long caseId) {
        return deadlines.findByImmigrationCaseIdOrderByDueDateAsc(caseId);
    }

    @PostMapping("/cases/{caseId}/deadlines")
    public ResponseEntity<Deadline> create(@PathVariable Long caseId, @Valid @RequestBody Deadline input) {
        return cases.findById(caseId).map(c -> {
            input.setImmigrationCase(c);
            return ResponseEntity.ok(deadlines.save(input));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/deadlines/{id}")
    public ResponseEntity<Deadline> update(@PathVariable Long id, @Valid @RequestBody Deadline input) {
        return deadlines.findById(id).map(existing -> {
            existing.setTitle(input.getTitle());
            existing.setDueDate(input.getDueDate());
            existing.setCompleted(input.isCompleted());
            return ResponseEntity.ok(deadlines.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/deadlines/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!deadlines.existsById(id)) return ResponseEntity.notFound().build();
        deadlines.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
