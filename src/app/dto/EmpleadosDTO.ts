export interface EmpleadosDTO {
    id: number;
    tipoIdentificacion: string;
    numeroIdentificacion: string;
    primerNombre: string;
    segundoNombre: string;
    primerApellido: string;
    segundoApellido: string;
    nombresCompletos: string;
    telefonoFijo: string;
    telefonoMovil: string;
    direccion: string;
    correo: string;
    sexo: string;
    estado: boolean;
    idDepartamento: number;
    idCargo: number;
    idJefe: number;
    fechaNacimiento: Date;
    fechaIngreso: Date
}