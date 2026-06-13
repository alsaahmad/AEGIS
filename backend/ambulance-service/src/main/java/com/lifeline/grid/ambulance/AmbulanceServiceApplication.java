package com.lifeline.grid.ambulance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EntityScan("com.lifeline.grid.common.entity")
@EnableJpaRepositories("com.lifeline.grid.ambulance.repository")
@SpringBootApplication(scanBasePackages = {"com.lifeline.grid.ambulance", "com.lifeline.grid.common"})
public class AmbulanceServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(AmbulanceServiceApplication.class, args);
    }
}
