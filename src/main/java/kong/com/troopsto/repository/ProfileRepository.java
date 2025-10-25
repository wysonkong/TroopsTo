package kong.com.troopsto.repository;

import kong.com.troopsto.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {

    Optional<Profile> findProfileByUsername(String username);

    Boolean existsByUsername(String username);

}
