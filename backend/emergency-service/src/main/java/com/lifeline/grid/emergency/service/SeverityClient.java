package com.lifeline.grid.emergency.service;

import com.lifeline.grid.common.dto.SeverityPredictionRequest;
import com.lifeline.grid.common.dto.SeverityPredictionResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.util.retry.Retry;

import java.time.Duration;

@Service
@Slf4j
public class SeverityClient {
    private final WebClient client;

    public SeverityClient(WebClient.Builder builder, @Value("${services.severity-ai-url}") String baseUrl) {
        this.client = builder.baseUrl(baseUrl).build();
    }

    public SeverityPredictionResponse predict(SeverityPredictionRequest request) {
        return client.post()
                .uri("/predict/severity")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(SeverityPredictionResponse.class)
                .timeout(Duration.ofSeconds(4))
                .retryWhen(Retry.backoff(2, Duration.ofMillis(300)))
                .doOnError(ex -> log.warn("AI severity service failed after retries: {}", ex.getMessage()))
                .block();
    }
}
