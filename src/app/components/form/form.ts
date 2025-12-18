import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { PaisService } from '../../services/data/pais/pais-service';
import { Pais } from '../../services/data/pais/pais-service';
import { Estado, EstadoService } from '../../services/data/estado/estado-service';
import { Municipio, MunicipioService } from '../../services/data/municipio/municipio-service';
import { Colonia, ColoniaService } from '../../services/data/colonia/colonia-service';
import { FormsModule, NgForm } from '@angular/forms';
import { User, UsuarioService } from '../../services/data/usuario/usuario-service';
import { Rol, RolService } from '../../services/data/rol/rol-service';
import { AlertService } from '../../services/alert/alert';
import { direccion, DireccionService } from '../../services/data/direccion/direccion-service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form {
  private activateRoute = inject(ActivatedRoute);

  onCancel() {
    this.closeModal.emit();
  }

  @Output() closeModal = new EventEmitter<void>();
  @Output() cargarUsuarios = new EventEmitter<void>();

  @Input() showPersonalInfo: boolean = true;
  @Input() showContactInfo: boolean = true;
  @Input() showAddress: boolean = true;
  @Input() showAccountInfo: boolean = true;

  // Alternativamente, puedes usar un solo input con modo
  @Input() formMode: 'full' | 'user-only' | 'address-only' | 'contact-only' | 'custom' = 'full';

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

  onSubmit(form: any) {
    if (form.valid) {
      if (this.formMode === 'address-only') {
        this.addDireccion();
      } else {
        this.addUsuario();
      }
    }
  }

  addDireccion() {
    // Solo enviar la dirección nueva, NO todo el usuario
    const direccionData = {
      idDireccion: 0,
      calle: this.direccion.calle,
      numeroInterior: this.direccion.numeroInterior || '',
      numeroExterior: this.direccion.numeroExterior,
      usuario: this.usuario.username || this.usuario.idUser, // ID o username del usuario
      Colonia: {
        idColonia: this.direccion.Colonia.idColonia,
        nombre: '',
        codigoPostal: this.direccion.Colonia.codigoPostal || '',
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

    console.log('Dirección a enviar:', direccionData);

    this.direccionService.addDirecion(direccionData).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        this.alertService.success('Dirección agregada exitosamente');
        // Emitir eventos si existen
        if (this.closeModal) this.closeModal.emit();
        if (this.cargarUsuarios) this.cargarUsuarios.emit();
      },
      error: (error) => {
        console.error('Error al agregar dirección:', error);
        const errorMsg = error?.error?.errorMessage || error?.message || 'Error desconocido';
        this.alertService.error(`Error al agregar la dirección: ${errorMsg}`);
      },
    });
  }

  addUsuario() {
    const userData = {
      ...this.usuario,
      Rol: {
        idRol: this.usuario.Rol.idRol,
        nombre: '',
      },
      Direcciones: this.showAddress
        ? [
            {
              idDireccion: 0,
              calle: this.direccion.calle,
              numeroInterior: this.direccion.numeroInterior || '',
              numeroExterior: this.direccion.numeroExterior,
              Colonia: {
                idColonia: this.direccion.Colonia.idColonia,
                nombre: '',
                codigoPostal: this.direccion.Colonia.codigoPostal || '',
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
            },
          ]
        : [],
    };

    console.log('Usuario a enviar:', userData);

    this.usuarioService.addUser(userData).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        this.alertService.success('Usuario creado exitosamente');
        if (this.cargarUsuarios) this.cargarUsuarios.emit();
        if (this.closeModal) this.closeModal.emit();
      },
      error: (error) => {
        console.error('Error al crear usuario:', error);
        const errorMsg = error?.error?.errorMessage || error?.message || 'Error desconocido';
        this.alertService.error(`Error al crear el usuario: ${errorMsg}`);
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
  private alertService = inject(AlertService);
  private direccionService = inject(DireccionService);
  id: number | null = null;
  configureSectionVisibility() {
    switch (this.formMode) {
      case 'user-only':
        this.showPersonalInfo = true;
        this.showContactInfo = true;
        this.showAddress = false;
        this.showAccountInfo = true;
        break;
      case 'address-only':
        this.showPersonalInfo = false;
        this.showContactInfo = false;
        this.showAddress = true;
        this.showAccountInfo = false;
        break;
      case 'contact-only':
        this.showPersonalInfo = false;
        this.showContactInfo = true;
        this.showAddress = false;
        this.showAccountInfo = false;
        break;
      case 'custom':
        // Usa los valores de los @Input individuales
        break;
      case 'full':
      default:
        this.showPersonalInfo = true;
        this.showContactInfo = true;
        this.showAddress = true;
        this.showAccountInfo = true;
        break;
    }
  }
  ngOnInit(): void {
    this.configureSectionVisibility();
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
    this.activateRoute.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      this.id = idParam ? Number(idParam) : 0;
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
