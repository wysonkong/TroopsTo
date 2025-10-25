package kong.com.troopsto.service;

import kong.com.troopsto.config.SecurityConfig;
import kong.com.troopsto.model.Profile;
import kong.com.troopsto.model.Role;
import kong.com.troopsto.repository.ProfileRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfileService {
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileService(ProfileRepository profileRepository, PasswordEncoder passwordEncoder) {
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Profile> findAllProfiles() {
        return profileRepository.findAll();
    }

    public Profile registerUser(Profile profile) {
        if (profile.getRole() == null) {
            profile.setRole(Role.valueOf("USER"));
        }
        profile.setPassword(passwordEncoder.encode(profile.getPassword()));
        return profileRepository.save(profile);
    }

    public Profile findProfileByName(String username) {
        return profileRepository.findProfileByUsername(username).orElse(null);
    }

    public Boolean existsByUsername(String username) {
        return profileRepository.existsByUsername(username);
    }

    public Profile findById(Long id) {
        return profileRepository.findById(id).orElse(null);
    }
}