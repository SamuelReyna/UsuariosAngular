import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { PaisService } from '../../services/data/pais/pais-service';
import { Pais } from '../../services/data/pais/pais-service';
import { Estado, EstadoService } from '../../services/data/estado/estado-service';
import { Municipio, MunicipioService } from '../../services/data/municipio/municipio-service';
import { Colonia, ColoniaService } from '../../services/data/colonia/colonia-service';
import { FormsModule } from '@angular/forms';
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

  @Input() idUser: number | null = null;
  @Input() direccionSeleccionada: direccion | null = null;
  @Input() usuarioSeleccionado: User | null = null;
  @Input() editandoUsuario: boolean = false;
  @Input() editandoDireccion: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() cargarUsuarios = new EventEmitter<void>();
  @Output() getUser = new EventEmitter<void>();

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
        if (this.editandoDireccion) {
          this.editDireccion();
        } else {
          this.addDireccion();
        }
      } else if (this.editandoUsuario) {
        this.modifyUser();
      } else {
        this.addUsuario();
      }
    }
  }

  modifyUser() {
    const userData = {
      idUser: this.usuario.idUser,
      nombreUsuario: this.usuario.nombreUsuario,
      apellidoPaterno: this.usuario.apellidoPaterno,
      apellidoMaterno: this.usuario.apellidoMaterno,
      username: this.usuario.username,
      email: this.usuario.email,
      telefono: this.usuario.telefono,
      fechaNacimiento: this.usuario.fechaNacimiento,
      celular: this.usuario.celular,
      curp: this.usuario.curp,
      sexo: this.usuario.sexo,

      Rol: {
        idRol: this.usuario.Rol.idRol,
        nombre: '',
      },
    };
    this.usuarioService.update(userData).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        this.alertService.success('Usuario modificado exitosamente');
        if (this.cargarUsuarios) this.cargarUsuarios.emit();
        if (this.closeModal) this.closeModal.emit();
      },
      error: (error) => {
        console.error('Error al modificar usuario:', error);
        const errorMsg = error?.error?.errorMessage || error?.message || 'Error desconocido';
        this.alertService.error(`Error al modificar el usuario: ${errorMsg}`);
        if (this.closeModal) this.closeModal.emit();
      },
    });

    // Lógica para modificar usuario
  }
  ngOnChanges(changes: SimpleChanges): void {
    // Detectar cuando cambia direccionSeleccionada
    if (changes['direccionSeleccionada'] && this.direccionSeleccionada) {
      this.cargarDireccionEnFormulario();
    } else if (changes['usuarioSeleccionado'] && this.usuarioSeleccionado) {
      this.cargandoUsuarioFormulario();
    }
  }

  cargandoUsuarioFormulario(): void {
    if (this.usuarioSeleccionado) {
      this.usuario = { ...this.usuarioSeleccionado };
    }
  }
  cargarDireccionEnFormulario(): void {
    if (this.direccionSeleccionada) {
      // Asignar los valores de la dirección seleccionada al formulario
      console.log('Cargando dirección en formulario:', this.direccionSeleccionada);
      this.direccion = {
        idDireccion: this.direccionSeleccionada.idDireccion,
        calle: this.direccionSeleccionada.calle,
        numeroInterior: this.direccionSeleccionada.numeroInterior,
        numeroExterior: this.direccionSeleccionada.numeroExterior,
        Colonia: {
          idColonia: this.direccionSeleccionada.Colonia.idColonia,
          nombre: this.direccionSeleccionada.Colonia.nombre,
          codigoPostal: this.direccionSeleccionada.Colonia.codigoPostal,
          municipio: this.direccionSeleccionada.Colonia.municipio,
        },
      };

      // Cargar las dependencias en cascada para los selects
      this.cargarDependenciasDireccion();
    }
  }

  cargarDependenciasDireccion(): void {
    if (this.direccionSeleccionada) {
      const idPais = this.direccionSeleccionada.Colonia.municipio.estado.pais.idPais;
      const idEstado = this.direccionSeleccionada.Colonia.municipio.estado.idEstado;
      const idMunicipio = this.direccionSeleccionada.Colonia.municipio.idMunicipio;

      // Cargar estados del país
      this.estadoService.getByIdPais(idPais).subscribe({
        next: (response) => {
          this.estados = response.object;
          this.estadoSeleccionado = idEstado;
        },
      });

      // Cargar municipios del estado
      this.municipioService.getByEstado(idEstado).subscribe({
        next: (response) => {
          this.municipios = response.object;
          this.municipioSeleccionado = idMunicipio;
        },
      });

      // Cargar colonias del municipio
      this.coloniaService.getByMunicipio(idMunicipio).subscribe({
        next: (response) => {
          this.colonias = response.object;
        },
      });

      // Establecer el país seleccionado
      this.paisSeleccionado = idPais;
    }
  }
  editDireccion() {
    const direccionData = {
      idUser: this.idUser,
      Direcciones: [
        {
          idDireccion: this.direccion.idDireccion,
          calle: this.direccion.calle,
          numeroInterior: this.direccion.numeroInterior || '',
          numeroExterior: this.direccion.numeroExterior,
          Colonia: {
            idColonia: this.direccion.Colonia.idColonia,
          },
        },
      ],
    };
    this.direccionService.updateDireccion(direccionData as any).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        this.alertService.success('Dirección editada exitosamente');
        // Emitir eventos si existen
        if (this.closeModal) this.closeModal.emit();
        if (this.getUser) this.getUser.emit();
      },
      error: (error) => {
        console.error('Error al editar dirección:', error);
        const errorMsg = error?.error?.errorMessage || error?.message || 'Error desconocido';
        this.alertService.error(`Error al editar la dirección: ${errorMsg}`);
        if (this.closeModal) this.closeModal.emit();
      },
    });
    // Lógica para editar la dirección
  }
  addDireccion() {
    const direccionData = {
      idUser: this.idUser,
      Direcciones: [
        {
          calle: this.direccion.calle,
          numeroInterior: this.direccion.numeroInterior || '',
          numeroExterior: this.direccion.numeroExterior,
          Colonia: {
            idColonia: this.direccion.Colonia.idColonia,
          },
        },
      ],
    };

    this.direccionService.addDirecion(direccionData).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        this.alertService.success('Dirección agregada exitosamente');
        // Emitir eventos si existen
        if (this.closeModal) this.closeModal.emit();
        if (this.getUser) this.getUser.emit();
      },
      error: (error) => {
        console.error('Error al agregar dirección:', error);
        const errorMsg = error?.error?.errorMessage || error?.message || 'Error desconocido';
        this.alertService.error(`Error al agregar la dirección: ${errorMsg}`);
        if (this.closeModal) this.closeModal.emit();
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
    const formData = new FormData();
    formData.append('imagenFile', this.selectedFile as Blob);
    formData.append('usuario', new Blob([JSON.stringify(userData)], { type: 'application/json' }));

    this.usuarioService.addUser(formData).subscribe({
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
        if (this.closeModal) this.closeModal.emit();
      },
    });
  }
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    //this.imagePreview = URL.createObjectURL(this.selectedFile); // Preview
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
    img: '',
    telefono: '',
    fechaNacimiento: new Date(),
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
        this.showPersonalInfo = true;
        this.showContactInfo = true;
        this.showAddress = false;
        this.showAccountInfo = true;
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
