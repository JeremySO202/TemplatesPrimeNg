import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  standalone: true,
  template: `
    <div>
      <h1>Test Component</h1>
      <p>Si ves esto, Angular está funcionando correctamente.</p>
    </div>
  `,
  styles: [
    `
      div {
        padding: 20px;
        text-align: center;
      }
      h1 {
        color: #333;
      }
    `,
  ],
})
export class TestComponent {}
