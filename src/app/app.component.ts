import { Component, OnInit } from '@angular/core';
import { ThemeService } from './core/theme/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'AEM Secrets';

  constructor(private readonly themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.initTheme();
  }
}
