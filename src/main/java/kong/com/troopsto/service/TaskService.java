package kong.com.troopsto.service;

import kong.com.troopsto.model.Soldier;
import kong.com.troopsto.model.Task;
import kong.com.troopsto.repository.SoldierRepository;
import kong.com.troopsto.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class TaskService {
    public final TaskRepository taskRepository;
    public final SoldierRepository soldierRepository;

    public TaskService(TaskRepository taskRepository, SoldierRepository soldierRepository) {
        this.taskRepository = taskRepository;
        this.soldierRepository = soldierRepository;
    }

    public Task saveNewTask(Task task){
        return taskRepository.save(task);
    }

    public List<Task> findAll() {
        return taskRepository.findAll();
    }

    public Optional<Task> findById(Long id) {
        return taskRepository.findById(id);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    public Task assignSoldiers(Long taskId, Set<Long> soldierIds) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        for (Long soldierId : soldierIds) {
            Soldier soldier = soldierRepository.findById(soldierId)
                    .orElseThrow(() -> new IllegalArgumentException("Soldier not found"));

            if (hasConflict(soldier, task.getStart(), task.getEnd())) {
                throw new IllegalArgumentException("Soldier " + soldier.getFirstName() + " has a conflicting task");
            }

            task.getAssigned().add(soldier);

            soldier.getTasks().add(task);
            soldierRepository.save(soldier);
        }

        return taskRepository.save(task);
    }

    public boolean hasConflict(Soldier soldier, String newTaskStart, String newTaskEnd) {
        for (Task t : soldier.getTasks()) {
            if (timesOverlap(newTaskStart, newTaskEnd, t.getStart(), t.getEnd())) {
                return true;
            }
        }
        return false;
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

    private boolean timesOverlap(String start1, String end1, String start2, String end2) {
        LocalDateTime s1 = parseDateTime(start1);
        LocalDateTime e1 = parseDateTime(end1);
        LocalDateTime s2 = parseDateTime(start2);
        LocalDateTime e2 = parseDateTime(end2);

        return s1.isBefore(e2) && s2.isBefore(e1);
    }

}