import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Navbar } from "../../components/navbar/navbar";

@Component({
  selector: 'app-home',
  imports: [Navbar],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private router = inject(Router);

  onForm(): void {

    this.router.navigate(['/usuario/form']);

  }

}
