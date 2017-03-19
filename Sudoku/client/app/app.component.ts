import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: '/assets/templates/app.component.html'
})
export class AppComponent {
  private readonly PAGE_TITLE = "FACTORY/24 - Sudoku";

  public constructor(private titleService: Title) {
    this.titleService.setTitle(this.PAGE_TITLE);
  }

}
