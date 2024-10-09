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
  bot = './assets/bot.png'
  user = './assets/user.png'

  form: any;
  container:any;
  
  constructor(private elementref: ElementRef) {

  }

  ngAfterViewInit(): void {
    this.form = this.elementref.nativeElement.querySelector('form');
    this.form.addEventListener('submit', this.handlesubmit);
    this.form.addEventListener('keyup', (e: any) => {
      if (e.keycode === 13) {
        this.handlesubmit(e);
      }
    });
    this.container = this.elementref.nativeElement.querySelector('.container');
  }

  // IA Pensando - tres pontos
  loader(element: any){
    element.textContent = '';
    this.loadinterval = setInterval(() => {
      element.textContent += '.';
      if (element.textContent === '....') {
        element.textContent = '';
      }
    }, 360)
  }

  // Mostrando uma palavra por vez
  typetext(element: any, text: any){
    let index = 0;

    let interval = setInterval(() => {
      if (index < text.length){
        element.innerHTML += text.charAt (index);
        index++;
      }
      else {
        clearInterval(interval);
      }
    }, 20)
  }

  generateUniqueId() {
    const timestamp = Date.now();
    const rnNumber = Math.random();
    const hex = rnNumber.toString(16);
    return `id-${timestamp}-${hex}`;
  }

  stripes(ai: any, value: any, uniqueId: any) {
    return (
      `
        <div class="wrapper ${ai && 'ai'}">
          <div class="chat">
            <div class="profile">
              <img src="${ai ? this.bot : this.user}" />
            </div>
            <div class="message" id=${uniqueId}>${value}</div>
          </div>
        </div>
      `
    )
  }

  handlesubmit = async(e: any) => {
    e.preventDefault();

    const data = new FormData(this.form ?? undefined);

    //user stipes
    if (this.container != null) {
      this.container.innerHTML += this.stripes(false, data.get('prompt'), null)
    }
    // bot stripes
    const uniqueId = this.generateUniqueId();
    if (this.container != null) {
      this.container.innerHTML += this.stripes(true, " ", uniqueId);
      this.container.scrollTop = this.container.scrollHeight;
    }

    const messageDiv = document.getElementById(uniqueId);
    this.loader(messageDiv);

    // fetch the data from serve
    const response = await fetch("http://localhost:5000/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: data.get('prompt')
      })
    })

    clearInterval(this.loadinterval);
    if (messageDiv != null){
      messageDiv.innerHTML = '';
    }

    if (response.ok){
      const data = await response.json();
      const parseddata = data.bot.trim();

      this.typetext(messageDiv, parseddata);
    }
    else {
      const err = await response.text();
      if (messageDiv != null){
        messageDiv.innerHTML = 'algo deu ruim';
        alert(err)
      }
    }
  }
}
