import { Routes } from '@angular/router';
import { Home } from './views/home/home';
import { Usuario } from './views/usuario/usuario';
import { CargaMasiva } from './views/carga-masiva/carga-masiva';
import { Details } from './views/details/details';
import { Form } from './components/form/form';
import { Login } from './Auth/login/login';
import { Register } from './Auth/register/register';
import { VerifyAccount } from './views/verify-account/verify-account';
import { EnviarEmail } from './views/enviar-email/enviar-email';
import { ForgotPassword } from './views/forgot-password/forgot-password';
import { RecoveryPassword } from './views/recovery-password/recovery-password';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'verify-email',
    component: VerifyAccount,
  },
  {
    path: 'email-sent',
    component: EnviarEmail,
  },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'changePassword', component: RecoveryPassword },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
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
    path: `usuario/details/:id`,
    component: Details,
  },
  {
    path: 'usuario/perfil/:id',
    component: Details,
  },
  {
    path: 'usuario/form',
    component: Form,
  },
];
