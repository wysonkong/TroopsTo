package kong.com.troopsto.controller;

import kong.com.troopsto.dto.LoginDTO;
import kong.com.troopsto.model.Profile;
import kong.com.troopsto.service.ProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.Serializable;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("api/user")
public class ProfileController {

    public final ProfileService profileService;
    private final PasswordEncoder passwordEncoder;


    private final Map<String, Profile> sessions = new ConcurrentHashMap<>();

    public ProfileController(ProfileService profileService, PasswordEncoder passwordEncoder){
        this.profileService = profileService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/new_profile")
    public void saveNewUser(@RequestBody Profile profile) {
        profileService.registerUser(profile);
    }

    @GetMapping("/findProfile")
    public Map<String, Boolean> findUser(@RequestParam String username) {
        Boolean exists = profileService.existsByUsername(username);
        return Map.of("exists", exists);
    }

    @GetMapping("/getProfile/{profileId}")
    public ResponseEntity<Profile> getProfile(@PathVariable("profileId") Long profileId) {
        Profile profile = profileService.findById(profileId);

        if (profile == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(profile);
    }

    @PostMapping("/profile")
    public ResponseEntity<Map<String, Serializable>> login(@RequestBody LoginDTO login) {
        Profile profile =  profileService.findProfileByName(login.username());

        if (profile == null || !passwordEncoder.matches(login.password(), profile.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String sessionId = UUID.randomUUID().toString();
        sessions.put(sessionId, profile);

        return ResponseEntity.ok(Map.of("sessionId", sessionId, "username", profile.getUsername(), "userId", profile.getId()));
    }

    @GetMapping("/me")
    public ResponseEntity<Profile> me(@RequestHeader("X-Session-Id") String sessionId) {
        Profile profile = sessions.get(sessionId);
        if (profile == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return ResponseEntity.ok(profile);
    }
}