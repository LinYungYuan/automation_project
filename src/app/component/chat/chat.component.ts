import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatService } from '../../services/chat/chat.service';
import { Chat, Message } from '../../models/chat.model';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollPanel') private scrollPanel?: ElementRef;

  chatHistory: Chat[] = [];
  currentChatId: number | null = null;
  currentMessages: Message[] = [];
  newMessage: string = '';
  isTyping: boolean = false;
  isDarkTheme: boolean = false;
  currentStreamedResponse: string = '';

  constructor(
    private chatService: ChatService,
    private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit() {
    this.loadChatHistory();
    this.setupMessageStream();
    this.checkThemePreference();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private checkThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkTheme = savedTheme === 'dark';
      this.applyTheme(this.isDarkTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkTheme = prefersDark;
      this.applyTheme(prefersDark);
    }
  }

  private setupMessageStream() {
    this.chatService.messageStream$.subscribe(
      (content: string) => {
        this.currentStreamedResponse += content;
        this.updateLatestAssistantMessage();
      }
    );
  }

  private updateLatestAssistantMessage() {
    const lastMessage = this.currentMessages[this.currentMessages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant') {
      lastMessage.content = this.currentStreamedResponse;
    } else {
      this.currentMessages.push({
        id: Date.now(),
        chatId: this.currentChatId!,
        role: 'assistant',
        content: this.currentStreamedResponse,
        timestamp: new Date()
      });
    }
  }

  private loadChatHistory() {
    this.chatService.getChats().subscribe(
      (chats) => {
        this.chatHistory = chats;
        if (chats.length > 0 && !this.currentChatId) {
          this.loadChat(chats[0].id);
        }
      },
      (error) => console.error('Error loading chat history:', error)
    );
  }

  loadChat(chatId: number) {
    this.currentChatId = chatId;
    this.chatService.getMessages(chatId).subscribe(
      (messages) => {
        this.currentMessages = messages;
        this.scrollToBottom();
      },
      (error) => console.error('Error loading messages:', error)
    );
  }

  async startNewChat() {
    try {
      const newChat = await this.chatService.createChat('New Chat').toPromise();
      if (newChat) {
        this.chatHistory.unshift(newChat);
        this.loadChat(newChat.id);
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  }

  async sendMessage(event?: any) {
    if (event && event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
    } else if (event && event.key === 'Enter') {
      return;
    }

    if (!this.newMessage.trim() || !this.currentChatId) return;

    const messageContent = this.newMessage;
    this.newMessage = '';
    this.isTyping = true;
    this.currentStreamedResponse = '';

    // Add user message immediately
    this.currentMessages.push({
      id: Date.now(),
      chatId: this.currentChatId,
      role: 'user',
      content: messageContent,
      timestamp: new Date()
    });

    try {
      await this.chatService.sendMessage(this.currentChatId, messageContent);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      this.isTyping = false;
    }
  }

  async renameChat(chat: Chat, event: MouseEvent) {
    event.stopPropagation();
    const newTitle = prompt('Enter new chat title:', chat.title);
    if (newTitle && newTitle !== chat.title) {
      try {
        const updatedChat = await this.chatService.updateChat(chat.id, newTitle).toPromise();
        if (updatedChat) {
          const index = this.chatHistory.findIndex(c => c.id === chat.id);
          if (index !== -1) {
            this.chatHistory[index] = updatedChat;
          }
        }
      } catch (error) {
        console.error('Error renaming chat:', error);
      }
    }
  }

  async deleteChat(chatId: number, event: MouseEvent) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this chat?')) {
      try {
        await this.chatService.deleteChat(chatId).toPromise();
        this.chatHistory = this.chatHistory.filter(chat => chat.id !== chatId);
        if (this.currentChatId === chatId) {
          this.currentChatId = this.chatHistory.length > 0 ? this.chatHistory[0].id : null;
          if (this.currentChatId) {
            this.loadChat(this.currentChatId);
          } else {
            this.currentMessages = [];
          }
        }
      } catch (error) {
        console.error('Error deleting chat:', error);
      }
    }
  }

  private scrollToBottom() {
    if (this.scrollPanel) {
      const element = this.scrollPanel.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  toggleTheme() {
    this.applyTheme(this.isDarkTheme);
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }

  private applyTheme(isDark: boolean) {
    const theme = isDark ? 'lara-dark-blue' : 'lara-light-blue';
    const link = document.getElementById('theme-css') as HTMLLinkElement;
    if (link) {
      link.href = `node_modules/primeng/resources/themes/${theme}/theme.css`;
    } else {
      const newLink = document.createElement('link');
      newLink.id = 'theme-css';
      newLink.rel = 'stylesheet';
      newLink.type = 'text/css';
      newLink.href = `node_modules/primeng/resources/themes/${theme}/theme.css`;
      document.head.appendChild(newLink);
    }
  }
}
