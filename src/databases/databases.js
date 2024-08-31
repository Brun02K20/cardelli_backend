import { Sequelize } from "sequelize"; // importando el framework de ORM
import mysql2 from 'mysql2'; // importo el dialecto mysql, necesario para produccion
import { UsuariosModel } from "../models/Usuarios.js";
import { CategoriasProductosModel } from "../models/CategoriasProductos.js";
import { CategoriasOfertasModel } from "../models/CategoriasOfertas.js";
import { SubCategoriasProductosModel } from "../models/SubCategoriasProductos.js";
import { SubCategoriasOfertasModel } from "../models/SubCategoriasOfertas.js";

// Creando la cadena de conexión a la base de datos
const sequelize = new Sequelize({
    dialect: "mysql",
    dialectModule: mysql2, // necesario para produccion
    host: "bnuuykyjffls4ngatosp-mysql.services.clever-cloud.com",
    username: "uljtd3txymydojd0",
    password: "0yosC9HZTyTzCLYaJe05",
    database: "bnuuykyjffls4ngatosp"
});

// definicion de los modelos de datos en el codigo
sequelize.define("Usuarios", UsuariosModel.usuariosAttributes, UsuariosModel.usuariosMethods)
sequelize.define("Categorias_Productos", CategoriasProductosModel.categoriasProductosAttributes, CategoriasProductosModel.categoriasProductosMethods)
sequelize.define("Categorias_Ofertas", CategoriasOfertasModel.categoriasOfertasAttributes, CategoriasOfertasModel.categoriasOfertasMethods)
sequelize.define("SubCategorias_Productos", SubCategoriasProductosModel.subCategoriasProductosAttributes, SubCategoriasProductosModel.subCategoriasProductosMethods)
sequelize.define("SubCategorias_Ofertas", SubCategoriasOfertasModel.subCategoriasOfertasAttributes, SubCategoriasOfertasModel.subCategoriasOfertasMethods)

// Exportando la conexión a la base de datos
export { sequelize }