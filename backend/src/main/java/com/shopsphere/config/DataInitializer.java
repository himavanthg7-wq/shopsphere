package com.shopsphere.config;

import com.shopsphere.entity.*;
import com.shopsphere.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // Ensure roles
        Role customerRole = roleRepository.findByName("ROLE_CUSTOMER")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_CUSTOMER")));
        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_ADMIN")));

        // Ensure Admin user
        userRepository.findByEmail("admin@shopsphere.com").ifPresentOrElse(
                admin -> {
                    admin.setPassword(passwordEncoder.encode("Admin@123"));
                    Set<Role> roles = new HashSet<>();
                    roles.add(adminRole);
                    admin.setRoles(roles);
                    userRepository.save(admin);
                },
                () -> {
                    User admin = new User("System", "Admin", "admin@shopsphere.com",
                            passwordEncoder.encode("Admin@123"), "+91 9876543210");
                    Set<Role> roles = new HashSet<>();
                    roles.add(adminRole);
                    admin.setRoles(roles);
                    userRepository.save(admin);
                }
        );

        // Ensure Customer user
        userRepository.findByEmail("customer@shopsphere.com").ifPresentOrElse(
                customer -> {
                    customer.setPassword(passwordEncoder.encode("Customer@123"));
                    Set<Role> roles = new HashSet<>();
                    roles.add(customerRole);
                    customer.setRoles(roles);
                    userRepository.save(customer);
                },
                () -> {
                    User customer = new User("Rahul", "Sharma", "customer@shopsphere.com",
                            passwordEncoder.encode("Customer@123"), "+91 9123456780");
                    Set<Role> roles = new HashSet<>();
                    roles.add(customerRole);
                    customer.setRoles(roles);
                    userRepository.save(customer);
                }
        );
    }
}
