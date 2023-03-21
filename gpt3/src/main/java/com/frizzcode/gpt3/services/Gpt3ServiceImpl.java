package com.frizzcode.gpt3.services;

import com.frizzcode.gpt3.models.Gpt3Request;
import com.frizzcode.gpt3.models.Gpt3Response;
import com.theokanning.openai.completion.CompletionRequest;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.edit.EditRequest;
import com.theokanning.openai.model.Model;
import com.theokanning.openai.service.OpenAiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

@RequiredArgsConstructor
@Slf4j
@Service
public class Gpt3ServiceImpl implements Gpt3Service {

    @Value("${gpt3.token}")
    public String API_TOKEN;

    @Override
    @Async("asyncExecution")
    public CompletableFuture<List<Gpt3Response>> getResponses(Gpt3Request request) {
        OpenAiService service = new OpenAiService(API_TOKEN, Duration.ofMinutes(5));
        ModelMapper mapper = new ModelMapper();

        String[] promptSplit = request.getPrompt().split("\\.");
        String instruction = promptSplit[promptSplit.length-1];
        StringBuilder input = new StringBuilder();
        log.info("Instruction: {}", instruction);

        for (int i=0; i<promptSplit.length -1; i++){
            String message = promptSplit[i] + ". ";
            input.append(message);
        }

        log.info("Input: {}", input);

        if (request.getModel().contains("gpt"))
            return CompletableFuture.completedFuture(service.createChatCompletion(ChatCompletionRequest.builder()
                    .model(request.getModel())
                    .frequencyPenalty(0.5)
                    .topP(1.0)
                    .user(UUID.randomUUID().toString())
                    .temperature(0.3)
                    .maxTokens(3500)
                    .messages(List.of(new ChatMessage("user", request.getPrompt())))
                    .build()).getChoices().stream().map(
                    chatCompletionChoice -> mapper.map(chatCompletionChoice, Gpt3Response.class)
            ).toList()).orTimeout(5, TimeUnit.MINUTES);
        else if (request.getModel().contains("edit"))
            return CompletableFuture.completedFuture(service.createEdit(EditRequest.builder()
                    .model(request.getModel())
                    .temperature(0.7)
                    .input(input.toString())
                    .instruction(instruction)
                    .build()).getChoices().stream().map(
                    editChoice -> mapper.map(editChoice, Gpt3Response.class)
            ).toList()).orTimeout(5, TimeUnit.MINUTES);
        else
            return CompletableFuture.completedFuture(service.createCompletion(CompletionRequest.builder()
                    .model(request.getModel())
                    .frequencyPenalty(0.5)
                    .topP(1.0)
                    .user(UUID.randomUUID().toString())
                    .temperature(0.3)
                    .maxTokens(3500)
                    .prompt(request.getPrompt())
                    .build()).getChoices().stream().map(
                    completionChoice -> mapper.map(completionChoice, Gpt3Response.class)
            ).toList()).orTimeout(5, TimeUnit.MINUTES);

    }

    @Override
    public List<Model> getEngineList() {
        OpenAiService service = new OpenAiService(API_TOKEN, Duration.ofMinutes(5));
        return service.listModels();
    }
}
