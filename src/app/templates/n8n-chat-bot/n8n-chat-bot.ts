import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  OnDestroy,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ThemeService } from '../../services/theme.service';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isTyping?: boolean;
}

export interface ChatBotConfig {
  webhookUrl: string;
  welcomeMessage?: string;
  userAvatarIcon?: string;
  botAvatarIcon?: string;
  placeholder?: string;
  loadingText?: string;
  errorMessage?: string;
  sessionStorageKey?: string;
  height?: string;
  enableTimestamps?: boolean;
  enableClearButton?: boolean;
  maxMessageLength?: number;
}

@Component({
  selector: 'chat-bot-dinamico',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ButtonModule,
    InputTextModule,
    AvatarModule,
    ScrollPanelModule,
    CardModule,
    TooltipModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './n8n-chat-bot.html',
})
export class ChatBot implements OnInit, OnDestroy {
  @ViewChild('scrollPanel', { static: false }) scrollPanel!: ElementRef;
  @ViewChild('messageInput', { static: false }) messageInput!: ElementRef;

  // Configuraciones del chat
  /**
   * Título del chat.
   * Se muestra en la parte superior del chat.
   */
  @Input() public chatTitle?: string = '🤖 Asistente Virtual';

  /**
   * Subtítulo del chat.
   * Descripción breve que aparece bajo el título.
   */
  @Input() public chatSubtitle?: string = 'Tu asistente inteligente personalizado';

  /**
   * Configuración completa del chat bot.
   * Incluye webhook URL, mensajes, avatares, etc.
   */
  @Input() public config: ChatBotConfig = {
    webhookUrl: '',
    welcomeMessage: '¡Hola! 👋 Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',
    userAvatarIcon: 'pi pi-user',
    botAvatarIcon: 'pi pi-android',
    placeholder: 'Escribe tu mensaje aquí...',
    loadingText: 'Escribiendo...',
    errorMessage: 'Lo siento, hay un problema de conexión. Por favor intenta más tarde.',
    sessionStorageKey: 'chat-session',
    height: '600px',
    enableTimestamps: true,
    enableClearButton: true,
    maxMessageLength: 1000,
  };

  /**
   * Ancho del chat.
   */
  @Input() public chatWidth: string = '100%';

  /**
   * Permite personalizar el estilo del contenedor principal.
   */
  @Input() public containerClass: string = '';

  /**
   * Colores personalizados para el tema.
   * Estos se combinan con los colores del tema actual (claro/oscuro)
   */
  @Input() public customColors: Partial<{
    primary: string;
    secondary: string;
    userMessage: string;
    botMessage: string;
    headerGradient: string;
    background: string;
    cardBackground: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
    inputBg: string;
    inputBorder: string;
    inputFocus: string;
  }> = {};

  /**
   * Habilita el cambio automático de tema según la preferencia del sistema
   */
  @Input() public enableAutoTheme: boolean = true;

  /**
   * Evento emitido cuando se envía un mensaje.
   */
  @Output() public onMessageSent = new EventEmitter<string>();

  /**
   * Evento emitido cuando se recibe una respuesta.
   */
  @Output() public onResponseReceived = new EventEmitter<any>();

  /**
   * Evento emitido cuando ocurre un error.
   */
  @Output() public onError = new EventEmitter<any>();

  /**
   * Evento emitido cuando se limpia el chat.
   */
  @Output() public onChatCleared = new EventEmitter<void>();

  // Datos del chat
  messages: ChatMessage[] = [];
  currentMessage: string = '';
  isLoading: boolean = false;
  isTyping: boolean = false;

  // Colores del tema - calculados reactivamente
  public themeColors = computed(() => {
    if (!this.enableAutoTheme) {
      // Si no está habilitado el tema automático, usar colores por defecto
      return {
        primary: 'bg-blue-500',
        secondary: 'bg-gray-100',
        userMessage: 'bg-blue-500 text-white',
        botMessage: 'bg-white border border-gray-200 text-gray-800',
        headerGradient: 'from-blue-500 to-purple-600',
        background: 'bg-gray-50',
        cardBackground: 'bg-white',
        textPrimary: 'text-gray-800',
        textSecondary: 'text-gray-600',
        border: 'border-gray-200',
        inputBg: 'bg-white',
        inputBorder: 'border-gray-200',
        inputFocus: 'ring-blue-500 border-blue-500',
        ...this.customColors,
      };
    }

    const baseColors = this.themeService.getThemeColors('chat');
    return {
      ...baseColors,
      ...this.customColors,
    };
  });

  constructor(
    private http: HttpClient,
    private themeService: ThemeService,
  ) {}

  ngOnInit() {
    // Validar configuración requerida
    if (!this.config.webhookUrl) {
      console.error('ChatBot: webhookUrl es requerido en la configuración');
      return;
    }

    // Mensaje de bienvenida
    if (this.config.welcomeMessage) {
      this.addMessage({
        id: this.generateId(),
        text: this.config.welcomeMessage,
        sender: 'bot',
        timestamp: new Date(),
      });
    }
  }

  // Enviar mensaje
  async sendMessage() {
    if (!this.currentMessage.trim() || this.isLoading) return;

    const maxLength = this.config.maxMessageLength || 1000;
    if (this.currentMessage.length > maxLength) {
      this.currentMessage = this.currentMessage.substring(0, maxLength);
    }

    const userMessage = this.currentMessage.trim();
    this.currentMessage = '';

    // Agregar mensaje del usuario
    this.addMessage({
      id: this.generateId(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date(),
    });

    // Emitir evento
    this.onMessageSent.emit(userMessage);

    // Mostrar indicador de typing
    this.showTypingIndicator();

    try {
      // Enviar mensaje al webhook
      const response = await this.sendToWebhook(userMessage);

      // Ocultar typing y mostrar respuesta
      this.hideTypingIndicator();

      if (response && response.output) {
        this.addMessage({
          id: this.generateId(),
          text: response.output,
          sender: 'bot',
          timestamp: new Date(),
        });

        // Emitir evento de respuesta
        this.onResponseReceived.emit(response);
      } else {
        this.addMessage({
          id: this.generateId(),
          text: 'Lo siento, no pude procesar tu mensaje. Por favor intenta de nuevo.',
          sender: 'bot',
          timestamp: new Date(),
        });
      }
    } catch (error) {
      this.hideTypingIndicator();
      console.error('Error sending message:', error);

      this.addMessage({
        id: this.generateId(),
        text: this.config.errorMessage || 'Error de conexión',
        sender: 'bot',
        timestamp: new Date(),
      });

      // Emitir evento de error
      this.onError.emit(error);
    }
  }

  // Enviar mensaje al webhook
  private async sendToWebhook(message: string): Promise<any> {
    this.isLoading = true;

    try {
      const payload = {
        chatInput: message,
        sessionId: this.getOrCreateSessionId(),
      };

      const response = await this.http.post(this.config.webhookUrl, payload).toPromise();
      return response;
    } finally {
      this.isLoading = false;
    }
  }

  // Agregar mensaje al chat
  private addMessage(message: ChatMessage) {
    this.messages.push(message);

    // Scroll al final después de un pequeño delay
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  // Mostrar indicador de typing
  private showTypingIndicator() {
    this.isTyping = true;
    this.addMessage({
      id: 'typing',
      text: this.config.loadingText || 'Escribiendo...',
      sender: 'bot',
      timestamp: new Date(),
      isTyping: true,
    });
  }

  // Ocultar indicador de typing
  private hideTypingIndicator() {
    this.isTyping = false;
    this.messages = this.messages.filter((msg) => !msg.isTyping);
  }

  // Scroll al final del chat
  private scrollToBottom() {
    if (this.scrollPanel) {
      const scrollElement = this.scrollPanel.nativeElement.querySelector('.p-scrollpanel-content');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }

  // Manejar Enter en el input
  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  // Generar ID único
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Obtener o crear session ID
  private getOrCreateSessionId(): string {
    const storageKey = this.config.sessionStorageKey || 'chat-session';
    let sessionId = localStorage.getItem(storageKey);
    if (!sessionId) {
      sessionId = this.generateId();
      localStorage.setItem(storageKey, sessionId);
    }
    return sessionId;
  }

  // Limpiar chat
  clearChat() {
    this.messages = [];
    const storageKey = this.config.sessionStorageKey || 'chat-session';
    localStorage.removeItem(storageKey);

    // Agregar mensaje de bienvenida de nuevo
    if (this.config.welcomeMessage) {
      this.addMessage({
        id: this.generateId(),
        text: this.config.welcomeMessage,
        sender: 'bot',
        timestamp: new Date(),
      });
    }

    // Emitir evento
    this.onChatCleared.emit();
  }

  // Track by para ngFor
  trackByMessageId(index: number, message: ChatMessage): string {
    return message.id;
  }

  // Formatear tiempo
  formatTime(timestamp: Date): string {
    return timestamp.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  ngOnDestroy() {
    // Cleanup si es necesario
  }
}
