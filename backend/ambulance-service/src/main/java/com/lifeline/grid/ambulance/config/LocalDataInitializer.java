package com.lifeline.grid.ambulance.config;

import com.lifeline.grid.common.entity.Ambulance;
import com.lifeline.grid.common.entity.Hospital;
import com.lifeline.grid.common.entity.TrafficSignal;
import com.lifeline.grid.common.entity.enums.AmbulanceStatus;
import com.lifeline.grid.common.entity.enums.EquipmentLevel;
import com.lifeline.grid.common.entity.enums.TrafficSignalState;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@Profile("local")
@Slf4j
@RequiredArgsConstructor
public class LocalDataInitializer {
    private final EntityManager entityManager;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void initialize() {
        log.info("Running ambulance-service local data initializer");
        seedAmbulances();
        seedHospitals();
        seedTrafficSignals();
    }

    private void seedAmbulances() {
        Long count = entityManager.createQuery("select count(a) from Ambulance a", Long.class).getSingleResult();
        if (count != null && count > 0) {
            log.info("Local H2 ambulance data already present (count={})", count);
            return;
        }
        log.info("Seeding local H2 database with demo ambulances");

        entityManager.persist(Ambulance.builder()
                .vehicleNumber("AMB-101")
                .currentLat(12.9716)
                .currentLng(77.5946)
                .status(AmbulanceStatus.AVAILABLE)
                .driverName("Ramesh")
                .driverPhone("+919876543210")
                .equipmentLevel(EquipmentLevel.ICU)
                .build());

        entityManager.persist(Ambulance.builder()
                .vehicleNumber("AMB-102")
                .currentLat(12.9767)
                .currentLng(77.5903)
                .status(AmbulanceStatus.AVAILABLE)
                .driverName("Neha")
                .driverPhone("+919812345678")
                .equipmentLevel(EquipmentLevel.ALS)
                .build());

        entityManager.persist(Ambulance.builder()
                .vehicleNumber("AMB-103")
                .currentLat(12.9642)
                .currentLng(77.5792)
                .status(AmbulanceStatus.AVAILABLE)
                .driverName("Murali")
                .driverPhone("+919998877665")
                .equipmentLevel(EquipmentLevel.BASIC)
                .build());
    }

    private void seedHospitals() {
        Long count = entityManager.createQuery("select count(h) from Hospital h", Long.class).getSingleResult();
        if (count != null && count > 0) {
            log.info("Local H2 hospital data already present (count={})", count);
            return;
        }
        log.info("Seeding local H2 database with demo hospitals");

        entityManager.persist(Hospital.builder()
                .name("City Trauma Center")
                .lat(12.9731)
                .lng(77.5950)
                .totalIcuBeds(12)
                .availableIcuBeds(6)
                .specializations("cardiac,trauma,general")
                .phone("+918012345678")
                .currentLoadPct(0.55)
                .build());

        entityManager.persist(Hospital.builder()
                .name("Green Valley Hospital")
                .lat(12.9692)
                .lng(77.5855)
                .totalIcuBeds(10)
                .availableIcuBeds(4)
                .specializations("burns,trauma,general")
                .phone("+918012345679")
                .currentLoadPct(0.62)
                .build());
    }

    private void seedTrafficSignals() {
        Long count = entityManager.createQuery("select count(t) from TrafficSignal t", Long.class).getSingleResult();
        if (count != null && count > 0) {
            log.info("Local H2 traffic signal data already present (count={})", count);
            return;
        }
        log.info("Seeding local H2 database with demo traffic signals");

        entityManager.persist(TrafficSignal.builder()
                .lat(12.9712)
                .lng(77.5898)
                .roadSegment("Library Road")
                .currentState(TrafficSignalState.RED)
                .build());

        entityManager.persist(TrafficSignal.builder()
                .lat(12.9750)
                .lng(77.5923)
                .roadSegment("Central Avenue")
                .currentState(TrafficSignalState.RED)
                .build());

        entityManager.persist(TrafficSignal.builder()
                .lat(12.9685)
                .lng(77.5980)
                .roadSegment("Market Street")
                .currentState(TrafficSignalState.RED)
                .build());
    }
}
