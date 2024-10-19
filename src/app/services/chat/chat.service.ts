import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private chatHistory: Array<{content: string, isUser: boolean}> = [];

  constructor() {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      this.chatHistory = JSON.parse(savedHistory);
    }
  }

  getChatHistory(): Observable<Array<{content: string, isUser: boolean}>> {
    return of(this.chatHistory);
  }

  sendMessage(message: string): Observable<string> {
    this.chatHistory.push({content: message, isUser: true});
    // 這裡應該實現與 AI 後端的實際通信
    const aiResponse = `AI 回覆: ${message}`;
    this.chatHistory.push({content: aiResponse, isUser: false});
    this.saveChatHistory();
    return of(aiResponse);
  }

  private saveChatHistory() {
    localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
  }
}
