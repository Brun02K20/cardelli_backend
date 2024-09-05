import { Sequelize } from "sequelize"; // importando el framework de ORM
import mysql2 from 'mysql2'; // importo el dialecto mysql, necesario para produccion
import { UsuariosModel } from "../models/Usuarios.js";
import { CategoriasProductosModel } from "../models/CategoriasProductos.js";
import { CategoriasOfertasModel } from "../models/CategoriasOfertas.js";
import { SubCategoriasProductosModel } from "../models/SubCategoriasProductos.js";
import { SubCategoriasOfertasModel } from "../models/SubCategoriasOfertas.js";
import { ProductosModel } from "../models/Productos.js";
import { FotosProductosModel } from "../models/Fotos_Productos.js";
import { MedidasModel } from "../models/Medidas.js";
import { MedidasProductosModel } from "../models/Medidas_Productos.js";
import { MedidasOfertasModel } from "../models/Medidas_Ofertas.js";
import { OfertasModel } from "../models/Ofertas.js";
import { FotosOfertasModel } from "../models/Fotos_Ofertas.js";

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
sequelize.define("Productos", ProductosModel.productosAttributes, ProductosModel.productosMethods);
sequelize.define("Fotos_Productos", FotosProductosModel.fotosProductosAttributes, FotosProductosModel.fotosProductosMethods);
sequelize.define("Medidas", MedidasModel.attributes, MedidasModel.methods);
sequelize.define("Medidas_Productos", MedidasProductosModel.attributes, MedidasProductosModel.methods);
sequelize.define("Medidas_Ofertas", MedidasOfertasModel.attributes, MedidasOfertasModel.methods);
sequelize.define("Ofertas", OfertasModel.attributes, OfertasModel.methods);
sequelize.define("Fotos_Ofertas", FotosOfertasModel.fotosOfertasAttributes, FotosOfertasModel.fotosOfertasMethods);

// Relaciones entre las tablas

// Productos
// Una categoria tiene muchas subcategorias
sequelize.models.Categorias_Productos.hasMany(sequelize.models.SubCategorias_Productos, { foreignKey: 'idCategoriaProducto' });
sequelize.models.SubCategorias_Productos.belongsTo(sequelize.models.Categorias_Productos, { foreignKey: 'idCategoriaProducto' });

// Un producto pertenece a una subcategoria
sequelize.models.Productos.belongsTo(sequelize.models.SubCategorias_Productos, { foreignKey: 'idSubCategoria' });
sequelize.models.SubCategorias_Productos.hasMany(sequelize.models.Productos, { foreignKey: 'idSubCategoria' });

// Los productos tienen muchas fotos
sequelize.models.Fotos_Productos.belongsTo(sequelize.models.Productos, { foreignKey: 'idProducto' });
sequelize.models.Productos.hasMany(sequelize.models.Fotos_Productos, { foreignKey: 'idProducto' });

// definicion de FKs en muchos a muchos para los productos y las medidas
sequelize.models.Productos.belongsToMany(sequelize.models.Medidas, { through: sequelize.models.Medidas_Productos, fields: ['idProducto'] });
sequelize.models.Medidas.belongsToMany(sequelize.models.Productos, { through: sequelize.models.Medidas_Productos, fields: ['idMedida'] });


// Ofertas
// Una categoria tiene muchas subcategorias
sequelize.models.Categorias_Ofertas.hasMany(sequelize.models.SubCategorias_Ofertas, { foreignKey: 'idCategoriaOferta' });
sequelize.models.SubCategorias_Ofertas.belongsTo(sequelize.models.Categorias_Ofertas, { foreignKey: 'idCategoriaOferta' });

// Una subcategoria tiene muchas ofertas
sequelize.models.SubCategorias_Ofertas.hasMany(sequelize.models.Ofertas, { foreignKey: 'idSubCategoria' });
sequelize.models.Ofertas.belongsTo(sequelize.models.SubCategorias_Ofertas, { foreignKey: 'idSubCategoria' });

// Las ofertas tienen muchas fotos
sequelize.models.Fotos_Ofertas.belongsTo(sequelize.models.Ofertas, { foreignKey: 'idOferta' });
sequelize.models.Ofertas.hasMany(sequelize.models.Fotos_Ofertas, { foreignKey: 'idOferta' });

// definicion de FKs en muchos a muchos para los ofertas y las medidas
sequelize.models.Ofertas.belongsToMany(sequelize.models.Medidas, { through: sequelize.models.Medidas_Ofertas, fields: ['idOferta'] });
sequelize.models.Medidas.belongsToMany(sequelize.models.Ofertas, { through: sequelize.models.Medidas_Ofertas, fields: ['idMedida'] });

// Exportando la conexión a la base de datos
export { sequelize }