package com.lifeline.grid.hospital;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EntityScan("com.lifeline.grid.common.entity")
@EnableJpaRepositories("com.lifeline.grid.hospital.repository")
@SpringBootApplication(scanBasePackages = {"com.lifeline.grid.hospital", "com.lifeline.grid.common"})
public class HospitalServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(HospitalServiceApplication.class, args);
    }
}
