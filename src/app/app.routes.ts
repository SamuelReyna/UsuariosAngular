import { Routes } from '@angular/router';
import { Home } from './views/home/home';
import { Usuario } from './views/usuario/usuario';
import { CargaMasiva } from './views/carga-masiva/carga-masiva';
import { Details } from './views/details/details';
import { Form } from './components/form/form';
import { Login } from './Auth/login/login';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'usuario',
    component: Usuario,
  },
  {
    path: 'usuario/carga-masiva',
    component: CargaMasiva,
  },
  {
    path: 'usuario/details/{id}',
    component: Details,
  },
  {
    path: 'usuario/form',
    component: Form,
  },
];
