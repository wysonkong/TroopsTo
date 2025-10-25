package kong.com.troopsto.controller;


import kong.com.troopsto.model.Profile;
import kong.com.troopsto.model.Soldier;
import kong.com.troopsto.model.Task;
import kong.com.troopsto.service.ProfileService;
import kong.com.troopsto.service.SoldierService;
import kong.com.troopsto.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/task")
public class TaskController {
    public final TaskService taskService;
    public final ProfileService profileService;
    public final SoldierService soldierService;

    public TaskController(TaskService taskService, ProfileService profileService, SoldierService soldierService){
        this.taskService = taskService;
        this.profileService = profileService;
        this.soldierService = soldierService;
    }

    @PostMapping("/new_task")
    public ResponseEntity<?> createTask(@RequestBody Task task) {
        try {
            System.out.println("=== Received Task Data ===");
            System.out.println("Name: " + task.getName());
            System.out.println("Start: " + task.getStart());
            System.out.println("End: " + task.getEnd());
            System.out.println("Created: " + task.getCreated());
            System.out.println("Assigned: " + (task.getAssigned() != null ? task.getAssigned().size() : "null"));

            Task savedTask = taskService.saveNewTask(task);
            return ResponseEntity.ok(savedTask);
        } catch (Exception e) {
            System.err.println("=== ERROR CREATING TASK ===");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage(), "type", e.getClass().getName()));
        }
    }

    @GetMapping("/tasks")
    public List<Task> findAll() {
        return taskService.findAll();
    }

    @DeleteMapping("/delete/{id}")
    public void deleteTaskById(@PathVariable Long id){
        taskService.deleteTask(id);
    }

    @PostMapping("/{taskId}/assign")
    public ResponseEntity<?> assignSoldiersToTask(
            @PathVariable Long taskId,
            @RequestBody Set<Long> soldierIds) {

        try {
            Task updatedTask = taskService.assignSoldiers(taskId, soldierIds);
            return ResponseEntity.ok(updatedTask);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



}