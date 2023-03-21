package com.frizzcode.gpt3.controllers;

import com.frizzcode.gpt3.models.Gpt3Request;
import com.frizzcode.gpt3.models.Gpt3Response;
import com.frizzcode.gpt3.services.Gpt3Service;
import com.theokanning.openai.model.Model;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("api/v1/gpt3/")
@Slf4j
@RequiredArgsConstructor
@CrossOrigin
public class Gpt3Controller {

    private final Gpt3Service gpt3Service;

    @PostMapping("chat")
    ResponseEntity<List<Gpt3Response>> getExplanation(@RequestBody Gpt3Request request){
        try {
            log.info("Fetching response from OpenAI GPT-3");
            log.info("Request: {}", request);
            CompletableFuture<List<Gpt3Response>> responses = gpt3Service.getResponses(request);
            CompletableFuture
                    .allOf(responses)
                    .join();
            List<Gpt3Response> gpt3Responses = responses.get();
            log.info("Response: {}", gpt3Responses);
            return ResponseEntity.ok(gpt3Responses);
        } catch (Exception exception){
            log.error("Error fetching response: {}",exception.getMessage());
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("models")
    ResponseEntity<List<Model>> getListEngines(){
        try {
            log.info("Getting models...");
            List<com.theokanning.openai.model.Model> models = gpt3Service.getEngineList();
            models.forEach(model ->  log.info("{}", model));
            return ResponseEntity.ok(models);
        } catch (Exception exception) {
            log.error("Error fetching response: {}",exception.getMessage());
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
