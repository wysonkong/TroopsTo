package kong.com.troopsto.repository;

import kong.com.troopsto.model.Soldier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SoldierRepository extends JpaRepository<Soldier, Long> {

    Optional<Soldier> findSoldierByLastName(String lastname);

    Optional<Soldier> findSoldiersBySquad(String squad);

    Optional<Soldier> findSoldierById(Long id);


}