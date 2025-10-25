package kong.com.troopsto.service;

import kong.com.troopsto.model.Soldier;
import kong.com.troopsto.model.Task;
import kong.com.troopsto.repository.SoldierRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;

@Service
public class SoldierService {
    public final SoldierRepository soldierRepository;

    public SoldierService(SoldierRepository soldierRepository) {
        this.soldierRepository = soldierRepository;
    }

    public Soldier saveNewSoldier(Soldier soldier) {
        return soldierRepository.save(soldier);
    }

    public List<Soldier> getAllSoldiers(){
        return soldierRepository.findAll();
    }

    public Optional<Soldier> getSoldierById(Long id) {
        return soldierRepository.findSoldierById(id);
    }
    
    public Object getSoldierByLastName(String lastname) {
        return soldierRepository.findSoldierByLastName(lastname);
    }

    public void deleteSoldier(Long id) {
        soldierRepository.deleteById(id);
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
