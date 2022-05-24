import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Movie } from 'src/app/models/movie';
import { Preferiti } from 'src/app/models/preferiti';
import { take } from 'rxjs/operators';
import { AuthData, AuthService } from 'src/app/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  baseURL = 'http://localhost:4201/api/movies-popular';
  movies: Movie[] | undefined;
  preferiti: Movie[] | undefined;
  liked: boolean = false;
  favoritesCounter = 0;
  constructor(private http: HttpClient, private authSrv: AuthService) {}

  async getMovies(): Promise<void> {
    const user: AuthData = (await this.authSrv.user$
      .pipe(take(1))
      .toPromise()) as AuthData;
    const movies = await this.http
      .get<Movie[]>('http://localhost:4201/api/movies-popular')
      .toPromise();
    this.movies = movies;
    if (!this.preferiti) {
      this.getFavourite();
    }
  }

  async addFavorite(movie: Movie) {
    this.favoritesCounter++;
    movie.like = true;
    let count = 0;
    const user: AuthData = (await this.authSrv.user$
      .pipe(take(1))
      .toPromise()) as AuthData;
    const data: Preferiti = {
      movieId: movie.id,
      userId: user.user.id,
      id: count++,
    };
    return this.http.post<Preferiti>(
      'http://localhost:4201/api/favorites',
      data
    );
  }

  async getFavourite(): Promise<void> {
    this.preferiti = [];
    const user: AuthData = (await this.authSrv.user$
      .pipe(take(1))
      .toPromise()) as AuthData;
    this.http
      .get<Preferiti[]>(
        `http://localhost:4201/api/favorites?userId=${user.user.id}`
      )
      .subscribe(async (res) => {
        await this.getMovies();
        for (let i of res) {
          for (let j of this.movies!) {
            if (i.movieId == j.id) {
              this.preferiti!.push(j);
              this.preferiti![this.preferiti!.indexOf(j)].codicePreferito =
                i.id;
              j.like = true;
            }
          }
        }
      });
  }

  async removeFavourite(movie: Movie) {
    const user: AuthData = (await this.authSrv.user$
      .pipe(take(1))
      .toPromise()) as AuthData;
    movie.like = false;
    this.http
      .delete(`http://localhost:4201/api/favorites/${movie.codicePreferito}`)
      .subscribe();
  }
}
