package kong.com.troopsto.controller;

import kong.com.troopsto.model.Soldier;
import kong.com.troopsto.model.Task;
import kong.com.troopsto.service.SoldierService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/soldier")
public class SoldierController {
    public final SoldierService soldierService;

    public SoldierController(SoldierService soldierService){
        this.soldierService = soldierService;
    }

    @PostMapping("/new_soldier")
    public Soldier saveNewSoldier(@RequestBody Soldier soldier) {
        return soldierService.saveNewSoldier(soldier);
    }


    @GetMapping("/soldiers")
    public List<Soldier> findAll() {
        return soldierService.getAllSoldiers();
    }

    @GetMapping("/soldiers/{lastname}")
    public Soldier findByLastName(@PathVariable String lastname) {
        return (Soldier) soldierService.getSoldierByLastName(lastname);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteSoldierById(@PathVariable Long id){
        soldierService.deleteSoldier(id);
    }

    @GetMapping("/{id}/check-conflict")
    public ResponseEntity<?> checkConflict(
            @PathVariable Long id,
            @RequestParam String taskStart,
            @RequestParam String taskEnd) {
        try {
            Soldier soldier = soldierService.getSoldierById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Soldier not found"));

            boolean hasConflict = soldierService.hasConflict(soldier, taskStart, taskEnd);

            List<String> conflictingTasks = new ArrayList<>();
            if (hasConflict) {
                for (Task task : soldier.getTasks()) {
                    if (timesOverlap(taskStart, taskEnd, task.getStart(), task.getEnd())) {
                        conflictingTasks.add(task.getName() + " (" +
                                formatDateTime(task.getStart()) + " - " + formatDateTime(task.getEnd()) + ")");
                    }
                }
            }

            return ResponseEntity.ok(Map.of(
                    "soldierId", id,
                    "hasConflict", hasConflict,
                    "conflictingTasks", conflictingTasks
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/available")
    public ResponseEntity<?> getAvailableSoldiers(
            @RequestParam String taskStart,
            @RequestParam String taskEnd,
            @RequestParam(required = false) Long excludeTaskId) {
        try {
            List<Soldier> allSoldiers = soldierService.getAllSoldiers();
            List<Map<String, Object>> availableSoldiers = new ArrayList<>();

            for (Soldier soldier : allSoldiers) {
                boolean hasConflict = false;
                List<String> conflictingTasks = new ArrayList<>();

                for (Task task : soldier.getTasks()) {
                    // Skip the current task if we're editing
                    if (excludeTaskId != null && task.getId().equals(excludeTaskId)) {
                        continue;
                    }

                    if (timesOverlap(taskStart, taskEnd, task.getStart(), task.getEnd())) {
                        hasConflict = true;
                        conflictingTasks.add(task.getName());
                    }
                }

                // Only include soldiers without conflicts
                if (!hasConflict) {
                    Map<String, Object> soldierInfo = new HashMap<>();
                    soldierInfo.put("id", soldier.getId());
                    soldierInfo.put("firstName", soldier.getFirstName());
                    soldierInfo.put("lastName", soldier.getLastName());
                    soldierInfo.put("rank", soldier.getRank());
                    soldierInfo.put("squad", soldier.getSquad());
                    soldierInfo.put("team", soldier.getTeam());
                    soldierInfo.put("role", soldier.getRole());
                    availableSoldiers.add(soldierInfo);
                }
            }

            return ResponseEntity.ok(availableSoldiers);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private boolean timesOverlap(String start1, String end1, String start2, String end2) {
        LocalDateTime s1 = parseDateTime(start1);
        LocalDateTime e1 = parseDateTime(end1);
        LocalDateTime s2 = parseDateTime(start2);
        LocalDateTime e2 = parseDateTime(end2);
        return s1.isBefore(e2) && s2.isBefore(e1);
    }

    private LocalDateTime parseDateTime(String dateTimeStr) {
        try {
            // Try parsing as ISO 8601 with Z (UTC)
            if (dateTimeStr.endsWith("Z")) {
                Instant instant = Instant.parse(dateTimeStr);
                return LocalDateTime.ofInstant(instant, ZoneId.systemDefault());
            }
            // Try parsing as LocalDateTime
            return LocalDateTime.parse(dateTimeStr);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid date format: " + dateTimeStr);
        }
    }

    private String formatDateTime(String dateTimeStr) {
        try {
            LocalDateTime dt = parseDateTime(dateTimeStr);
            return dt.format(DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm"));
        } catch (Exception e) {
            return dateTimeStr;
        }
    }
}
