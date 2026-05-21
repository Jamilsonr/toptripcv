"use client";

import { Attachment, Message } from "ai";
import { useChat } from "ai/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Message as PreviewMessage } from "@/components/custom/message";
import { useScrollToBottom } from "@/components/custom/use-scroll-to-bottom";

import { MultimodalInput } from "./multimodal-input";

export function Chat({
  id,
  initialMessages,
  tripDefaults,
}: {
  id: string;
  initialMessages: Array<Message>;
  tripDefaults?: {
    origin?: string;
    destination?: string;
    departureDate?: string;
    returnDate?: string;
    passengers?: number;
  };
}) {
  const { messages, handleSubmit, input, setInput, append, isLoading, stop } =
    useChat({
      id,
      body: { id, tripDefaults },
      initialMessages,
      maxSteps: 10,
      onFinish: () => {
        window.history.replaceState({}, "", `/chat/${id}`);
      },
    });

  const hasAutoSent = useRef(false);
  const autoSearchMessage = useMemo(() => {
    const destination = tripDefaults?.destination?.trim();
    const departureDate = tripDefaults?.departureDate?.trim();
    if (!destination || !departureDate) return null;

    const origin = tripDefaults?.origin?.trim() || "Lisboa";
    const returnDate = tripDefaults?.returnDate?.trim();
    const passengers = tripDefaults?.passengers ?? 1;

    return `Quero ver voos com estes dados: Origem: ${origin}. Destino: ${destination}. Ida: ${departureDate}.${returnDate ? ` Volta: ${returnDate}.` : ""} Passageiros: ${passengers}.`;
  }, [tripDefaults]);

  useEffect(() => {
    if (hasAutoSent.current) return;
    if (!autoSearchMessage) return;
    if (messages.length > 0) return;

    hasAutoSent.current = true;
    append({
      role: "user",
      content: autoSearchMessage,
    });
  }, [append, autoSearchMessage, messages.length]);

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  return (
    <div className="flex flex-row justify-center pb-4 md:pb-8 min-h-dvh bg-background">
      <div className="flex flex-col justify-between items-center gap-4 w-full md:max-w-[720px]">
        <div
          ref={messagesContainerRef}
          className="flex flex-col gap-4 size-full items-center overflow-y-scroll overflow-x-hidden px-4 md:px-0"
        >
          {messages.map((message) => (
            <PreviewMessage
              key={message.id}
              chatId={id}
              role={message.role}
              content={message.content}
              attachments={message.experimental_attachments}
              toolInvocations={message.toolInvocations}
            />
          ))}

          <div
            ref={messagesEndRef}
            className="shrink-0 min-w-[24px] min-h-[24px]"
          />
        </div>

        <form className="flex flex-row gap-2 relative items-end w-full md:max-w-[500px] max-w-[calc(100dvw-32px)] px-4 md:px-0">
          <MultimodalInput
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            stop={stop}
            attachments={attachments}
            setAttachments={setAttachments}
            messages={messages}
            append={append}
          />
        </form>
      </div>
    </div>
  );
}
