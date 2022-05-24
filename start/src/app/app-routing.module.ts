import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Route[] = [
  {
    path: 'preferiti',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/preferiti/preferiti.module').then((m) => m.UsersModule),
  },
  {
    path: 'movies',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/movie/movies.module').then((m) => m.MoviesModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
