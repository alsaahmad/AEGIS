package com.lifeline.grid.emergency;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableAsync
@EntityScan("com.lifeline.grid.common.entity")
@EnableJpaRepositories("com.lifeline.grid.emergency.repository")
@SpringBootApplication(scanBasePackages = {"com.lifeline.grid.emergency", "com.lifeline.grid.common"})
public class EmergencyServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(EmergencyServiceApplication.class, args);
    }
}
