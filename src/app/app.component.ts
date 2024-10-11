import { Component, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root', 
  standalone: true, 
  imports: [RouterOutlet], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'chatGPT app';
  loadinterval: any;
  bot = './assets/bot.png';
  user = './assets/user.png';

  form: any; // Referência ao formulário HTML
  container: any; // Referência ao contêiner onde as mensagens serão exibidas

  constructor(private elementref: ElementRef) {
    // O ElementRef é utilizado para acessar elementos do DOM nativo
  }

  // Método chamado após o componente ser completamente renderizado
  ngAfterViewInit(): void {
    this.form = this.elementref.nativeElement.querySelector('form'); // Captura o formulário no DOM
    // Adiciona o listener para o evento de submit do formulário
    this.form.addEventListener('submit', this.handlesubmit); 
    // Adiciona o listener para o evento de tecla (keyup) e detecta se a tecla Enter foi pressionada
    this.form.addEventListener('keyup', (e: any) => {
      if (e.keycode === 13) {
        this.handlesubmit(e); // Submete o formulário se a tecla Enter for pressionada
      }
    });
    this.container = this.elementref.nativeElement.querySelector('.container'); // Captura o contêiner no DOM
  }

  // Exibe a animação de 'IA pensando' (três pontos aparecendo e desaparecendo)
  loader(element: any) {
    element.textContent = ''; // Limpa o texto
    // Inicia o intervalo para exibir os pontos
    this.loadinterval = setInterval(() => {
      element.textContent += '.'; // Adiciona um ponto
      if (element.textContent === '....') { // Se houver 4 pontos, reinicia o texto
        element.textContent = '';
      }
    }, 360); // Intervalo de 360ms entre cada ponto
  }

  // Mostra o texto de resposta, revelando uma letra de cada vez
  typetext(element: any, text: any) {
    let index = 0; // Índice inicial do texto

    // Cria um intervalo para adicionar letras uma por uma
    let interval = setInterval(() => {
      if (index < text.length) { // Enquanto houver letras a serem exibidas
        element.innerHTML += text.charAt(index); // Adiciona a letra atual ao HTML
        index++; // Avança para a próxima letra
      } else {
        clearInterval(interval); // Quando o texto estiver completo, para o intervalo
      }
    }, 20); // Exibe uma letra a cada 20ms
  }

  // Gera um ID único baseado no timestamp atual e um número aleatório
  generateUniqueId() {
    const timestamp = Date.now(); // Captura o timestamp atual
    const rnNumber = Math.random(); // Gera um número aleatório
    const hex = rnNumber.toString(16); // Converte o número para hexadecimal
    return `id-${timestamp}-${hex}`; // Retorna o ID único gerado
  }

  // Função que retorna o HTML para o layout das mensagens (stripes)
  stripes(ai: any, value: any, uniqueId: any) {
    return (
      `
        <div class="wrapper ${ai && 'ai'}"> <!-- Se for mensagem do bot, adiciona a classe 'ai' -->
          <div class="chat">
            <div class="profile">
              <img src="${ai ? this.bot : this.user}" /> <!-- Mostra a imagem do bot ou do usuário -->
            </div>
            <div class="message" id=${uniqueId}>${value}</div> <!-- Mensagem exibida -->
          </div>
        </div>
      `
    );
  }

  // Função que lida com o envio do formulário e o comportamento do chat
  handlesubmit = async (e: any) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário

    const data = new FormData(this.form ?? undefined); // Cria um objeto FormData com os dados do formulário

    // Exibe a mensagem do usuário
    if (this.container != null) {
      this.container.innerHTML += this.stripes(false, data.get('prompt'), null); // Adiciona o stripe do usuário
    }

    // Exibe o placeholder para a resposta do bot
    const uniqueId = this.generateUniqueId(); // Gera um ID único para a mensagem do bot
    if (this.container != null) {
      this.container.innerHTML += this.stripes(true, " ", uniqueId); // Adiciona o stripe do bot
      this.container.scrollTop = this.container.scrollHeight; // Move a barra de rolagem para o final
    }

    const messageDiv = document.getElementById(uniqueId); // Captura a mensagem do bot pelo ID
    this.loader(messageDiv); // Exibe a animação de carregamento (IA pensando)

    // Faz a requisição para o servidor
    const response = await fetch("http://localhost:5000/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Define o tipo de conteúdo como JSON
      },
      body: JSON.stringify({
        prompt: data.get('prompt'), // Envia o texto inserido pelo usuário como 'prompt'
      }),
    });

    clearInterval(this.loadinterval); // Para a animação de carregamento
    if (messageDiv != null) {
      messageDiv.innerHTML = ''; // Limpa a mensagem do bot
    }

    // Se a resposta do servidor for bem-sucedida
    if (response.ok) {
      const data = await response.json(); // Converte a resposta para JSON
      const parseddata = data.bot.trim(); // Pega a resposta do bot e remove espaços em branco

      this.typetext(messageDiv, parseddata); // Exibe a resposta letra por letra
    } else {
      // Em caso de erro, exibe a mensagem de erro no chat
      const err = await response.text();
      if (messageDiv != null) {
        messageDiv.innerHTML = 'algo deu ruim'; // Exibe uma mensagem de erro
        alert(err); // Mostra um alerta com o erro
      }
    }
  };
}
