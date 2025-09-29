import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatBot, ChatBotConfig } from '../n8n-chat-bot';
import { ThemeService } from '../../../services/theme.service';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

/**
 * Ejemplo de implementación del ChatBot Dinámico
 *
 * Este componente demuestra cómo configurar y usar el chat bot
 * con diferentes configuraciones y eventos.
 */
@Component({
  selector: 'implementacion-chat-bot',
  standalone: true,
  imports: [CommonModule, ChatBot, ButtonModule, TooltipModule],
  templateUrl: './implementacion-chat-bot.html',
})
export class ImplementacionChatBot implements OnInit {
  constructor(public themeService: ThemeService) {}

  ngOnInit() {
    // Inicialización si es necesaria
  }

  // Configuración básica del chat bot
  chatConfig: ChatBotConfig = {
    webhookUrl:
      'https://n8n.infiniteccsoftware.work/webhook/e9feada2-cbc6-4aa2-8964-ac1d27473afa/chat',
    welcomeMessage: '¡Hola! 👋 Soy tu asistente virtual especializado. ¿En qué puedo ayudarte hoy?',
    userAvatarIcon: 'pi pi-user',
    botAvatarIcon: 'pi pi-android',
    placeholder: 'Escribe tu pregunta aquí...',
    loadingText: 'Procesando tu consulta...',
    errorMessage: 'Lo siento, no pude procesar tu solicitud. Intenta nuevamente.',
    sessionStorageKey: 'mi-chat-session',
    height: '500px',
    enableTimestamps: true,
    enableClearButton: true,
    maxMessageLength: 500,
  };

  // Configuración alternativa para chat de soporte
  chatSoporteConfig: ChatBotConfig = {
    webhookUrl:
      'https://n8n.infiniteccsoftware.work/webhook/e9feada2-cbc6-4aa2-8964-ac1d27473afa/chat',
    welcomeMessage: '🛠️ Bienvenido al soporte técnico. ¿Cómo podemos asistirte?',
    userAvatarIcon: 'pi pi-user-edit',
    botAvatarIcon: 'pi pi-cog',
    placeholder: 'Describe tu problema...',
    loadingText: 'Consultando base de conocimientos...',
    errorMessage: 'Error de conexión. Contacta a soporte@empresa.com',
    sessionStorageKey: 'soporte-chat-session',
    height: '600px',
    enableTimestamps: false,
    enableClearButton: true,
    maxMessageLength: 1000,
  };

  // Colores personalizados para el tema corporativo
  temaCoorporativo = {
    primary: 'bg-indigo-500',
    secondary: 'bg-indigo-50',
    userMessage: 'bg-indigo-500 text-white',
    botMessage: 'bg-white border border-indigo-200',
    headerGradient: 'from-indigo-500 to-purple-600',
  };

  // Colores para el tema de soporte
  temaSoporte = {
    primary: 'bg-green-500',
    secondary: 'bg-green-50',
    userMessage: 'bg-green-500 text-white',
    botMessage: 'bg-white border border-green-200',
    headerGradient: 'from-green-500 to-teal-600',
  };

  // Manejo de eventos del chat
  onMensajeEnviado(mensaje: string) {
    console.log('Usuario envió:', mensaje);
    // Aquí puedes agregar lógica personalizada cuando se envía un mensaje
  }

  onRespuestaRecibida(respuesta: any) {
    console.log('Bot respondió:', respuesta);
    // Aquí puedes procesar la respuesta del bot
  }

  onErrorChat(error: any) {
    console.error('Error en el chat:', error);
    // Aquí puedes mostrar notificaciones de error
  }

  onChatLimpiado() {
    console.log('Chat limpiado');
    // Aquí puedes ejecutar acciones adicionales al limpiar el chat
  }

  // Métodos para el manejo del tema
  toggleTheme() {
    this.themeService.toggleTheme();
  }

  getCurrentThemeInfo() {
    return this.themeService.getThemeIcons();
  }
}
