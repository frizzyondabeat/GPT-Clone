package com.frizzcode.gpt3.services;

import com.frizzcode.gpt3.models.Gpt3Request;
import com.frizzcode.gpt3.models.Gpt3Response;
import com.theokanning.openai.model.Model;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface Gpt3Service {

    CompletableFuture<List<Gpt3Response>> getResponses(Gpt3Request request);
    List<Model> getEngineList();
}
