package com.lifeline.grid.traffic;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@EntityScan("com.lifeline.grid.common.entity")
@EnableJpaRepositories("com.lifeline.grid.traffic.repository")
@SpringBootApplication(scanBasePackages = {"com.lifeline.grid.traffic", "com.lifeline.grid.common"})
public class TrafficServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(TrafficServiceApplication.class, args);
    }
}
