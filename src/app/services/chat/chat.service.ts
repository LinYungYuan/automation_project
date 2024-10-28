import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Chat, Message, ChatResponse } from '../../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://127.0.0.1:9000';
  private messageSubject = new Subject<string>();
  messageStream$ = this.messageSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Chat operations
  createChat(title: string): Observable<Chat> {
    return this.http.post<Chat>(`${this.apiUrl}/chats`, { title });
  }

  getChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.apiUrl}/chats`);
  }

  getChat(id: number): Observable<Chat> {
    return this.http.get<Chat>(`${this.apiUrl}/chats/${id}`);
  }

  updateChat(id: number, title: string): Observable<Chat> {
    return this.http.put<Chat>(`${this.apiUrl}/chats/${id}`, { title });
  }

  deleteChat(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/chats/${id}`);
  }

  // Message operations
  getMessages(chatId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/chats/${chatId}/messages`);
  }

  async sendMessage(chatId: number, content: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/chats/${chatId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body reader not available');
      }

      // Read the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Convert the chunk to text and emit it
        const chunk = new TextDecoder().decode(value);
        try {
          const jsonChunk = JSON.parse(chunk) as ChatResponse;
          this.messageSubject.next(jsonChunk.content);
        } catch (e) {
          console.error('Error parsing chunk:', e);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}
