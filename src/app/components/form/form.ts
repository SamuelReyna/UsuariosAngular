import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { PaisService } from '../../services/data/pais/pais-service';
import { Pais } from '../../services/data/pais/pais-service';
import { Estado, EstadoService } from '../../services/data/estado/estado-service';
import { Municipio, MunicipioService } from '../../services/data/municipio/municipio-service';
import { Colonia, ColoniaService } from '../../services/data/colonia/colonia-service';
import { FormsModule, NgForm } from '@angular/forms';
import { direccion, User, UsuarioService } from '../../services/data/usuario/usuario-service';
import { Rol, RolService } from '../../services/data/rol/rol-service';
@Component({
  selector: 'app-form',
  imports: [CommonModule, Navbar, FormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form {
  onCancel() {
    throw new Error('Method not implemented.');
  }
  direccion: direccion = {
    idDireccion: 0,
    calle: '',
    numeroInterior: '',
    numeroExterior: '',
    Colonia: {
      idColonia: 0,
      nombre: '',
      codigoPostal: '',
      municipio: {
        idMunicipio: 0,
        nombre: '',
        estado: {
          idEstado: 0,
          nombre: '',
          pais: {
            idPais: 0,
            nombre: '',
          },
        },
      },
    },
  };
  paisSeleccionado: any;
  estadoSeleccionado: any;
  municipioSeleccionado: any;
  passwordConfirm: any;

  onSubmit(form: NgForm) {
    const userData = {
      ...this.usuario,
      Rol: {
        idRol: this.usuario.Rol.idRol,
        nombre: '',
      },
      Direcciones: [
        {
          idDireccion: 0,
          calle: this.direccion.calle,
          numeroInterior: this.direccion.numeroInterior,
          numeroExterior: this.direccion.numeroExterior,
          Colonia: {
            idColonia: this.direccion.Colonia.idColonia,
            nombre: '',
            codigoPostal: '',
            municipio: {
              nombre: '',
              idMunicipio: 0,
              estado: {
                idEstado: 0,
                nombre: '',
                pais: {
                  idPais: 0,
                  nombre: '',
                },
              },
            },
          },
        },
      ],
    };
    this.usuarioService.addUser(userData).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.error('Error al crear usuario:', error);
      },
    });
  }
  onFileSelected($event: Event) {
    throw new Error('Method not implemented.');
  }
  paises: Pais[] = [];
  estados: Estado[] = [];
  municipios: Municipio[] = [];
  colonias: Colonia[] = [];
  roles: Rol[] = [];
  codigoPostal: string = '';
  usuario: User = {
    idUser: 0,
    nombreUsuario: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    username: '',
    estatus: 0,
    verify: 0,
    email: '',
    telefono: '',
    fechaNacimiento: new Date(),
    img: '',
    celular: '',
    curp: '',
    sexo: '',
    password: '',
    Rol: {
      idRol: 0,
      nombre: '',
    },
    Direcciones: [],
  };
  private paisService = inject(PaisService);
  private estadoService = inject(EstadoService);
  private municipioService = inject(MunicipioService);
  private coloniaService = inject(ColoniaService);
  private rolService = inject(RolService);
  private usuarioService = inject(UsuarioService);

  ngOnInit(): void {
    this.paisService.getAll().subscribe({
      next: (response) => {
        this.paises = response.object;
        console.log('paises', this.paises);
      },
      error: (err) => {
        console.log('error al cargar los paises', err);
      },
    });
    this.estadoService.getAll().subscribe({
      next: (response) => {
        this.estados = response.object;
        console.log('estados', this.estados);
      },
    });
    this.municipioService.getAll().subscribe({
      next: (response) => {
        this.municipios = response.object;
        console.log('municipios', this.municipios);
      },
    });
    this.coloniaService.getAll().subscribe({
      next: (response) => {
        this.colonias = response.object;
        console.log('colonias', this.colonias);
      },
    });
    this.rolService.getAll().subscribe({
      next: (response) => {
        this.roles = response.object;
        console.log('roles', this.roles);
      },
    });
  }

  onPaisChange(event: Event): void {
    const estadoSelect = event.target as HTMLSelectElement;
    this.estadoService.getByIdPais(Number.parseInt(estadoSelect.value)).subscribe({
      next: (response) => {
        this.estados = response.object;
        console.log('estados desde el change', this.estados);
      },
    });
  }
  onEstadoChange(event: Event): void {
    const municipioSelect = event.target as HTMLSelectElement;
    this.municipioService.getByEstado(Number.parseInt(municipioSelect.value)).subscribe({
      next: (response) => {
        this.municipios = response.object;
        console.log('municipios desde el change', this.municipios);
      },
    });
  }
  onMunicipioChange(event: Event): void {
    const coloniaSelect = event.target as HTMLSelectElement;
    this.coloniaService.getByMunicipio(Number.parseInt(coloniaSelect.value)).subscribe({
      next: (response) => {
        this.colonias = response.object;
        console.log('colonias desde el change', this.colonias);
      },
    });
  }
  onColoniaChange(event: Event): void {
    const coloniaSelect = event.target as HTMLSelectElement;
    const coloniaBuscada: Colonia | undefined = this.colonias.find((colonia) => {
      return colonia.idColonia === Number.parseInt(coloniaSelect.value);
    });
    if (coloniaBuscada != null) {
      this.direccion.Colonia = coloniaBuscada;
      this.direccion.Colonia.codigoPostal = coloniaBuscada.codigoPostal;
    }
  }
}
