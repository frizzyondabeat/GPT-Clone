package com.frizzcode.gpt3.models;

import com.theokanning.openai.completion.chat.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Gpt3Response {
    private Integer index;
    private ChatMessage message;
    private String text;
}
