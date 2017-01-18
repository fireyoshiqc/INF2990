import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'mon-app',
  templateUrl: "/assets/templates/app-component-template.html" 
})

export class AppComponent {
  title = "Check mon cube";
  private value = "Hello World";
}
