export interface Chat {
    id: number;
    title: string;
    createdAt: Date;
}

export interface Message {
    id: number;
    chatId: number;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface ChatResponse {
    content: string;
    done: boolean;
}
