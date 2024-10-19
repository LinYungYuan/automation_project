import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat/chat.service';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
@Component({
  selector: 'app-chat-room',
  template: `
    <div class="chat-container">
      <div class="chat-messages">
        <div *ngFor="let message of messages" [class.user-message]="message.isUser" [class.ai-message]="!message.isUser">
          {{ message.content }}
        </div>
      </div>
      <div class="chat-input">
        <input [ngModel]="userInput" (ngModelChange)="userInput = $event" (keyup.enter)="sendMessage()" placeholder="輸入訊息...">
        <button (click)="sendMessage()">發送</button>
      </div>
    </div>
  `,
  standalone: true,
  imports: [FormsModule,NgFor],

})
export class ChatRoomComponent implements OnInit {
  messages: Array<{content: string, isUser: boolean}> = [];
  userInput: string = '';

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.loadChatHistory();
  }

  loadChatHistory() {
    this.chatService.getChatHistory().subscribe(
      history => this.messages = history
    );
  }

  sendMessage() {
    if (this.userInput.trim()) {
      this.messages.push({content: this.userInput, isUser: true});
      this.chatService.sendMessage(this.userInput).subscribe(
        response => {
          this.messages.push({content: response, isUser: false});
        }
      );
      this.userInput = '';
    }
  }
}
