import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: string[] = [];

  add(message: string) {
    this.messages.push(message);
  }

  push(message: string){
    this.messages.unshift(message);
  }

  clear() {
    this.messages = [];
  }
}