import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { MovieService } from '../movie/movies.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  template: `
    <div class="container mt-4">
      <ul class="list-group text-white">
        <p class="text-secondary">
          UTENTE: <span class="text-success fst-italic">{{ welcomeUser }}</span>
        </p>
        <hr />
        <h1 class="text-center tw-bold text-warning ">Lista preferiti:</h1>
        <li *ngFor="let preferito of preferiti">{{ preferito.title }}</li>
      </ul>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [],
})
export class PreferitiPage implements OnInit {
  welcomeUser!: string | undefined;
  users!: User[];
  preferiti = this.movieSrv.preferiti;
  constructor(private authSrv: AuthService, private movieSrv: MovieService) {}

  ngOnInit(): void {
    setInterval(() => {
      this.preferiti = this.movieSrv.preferiti;
    }, 20);
    this.authSrv.user$.subscribe((data) => {
      this.welcomeUser = data?.user.name;
      this.movieSrv.getFavourite();
    });
  }
}
