import { sequelize } from "../databases/databases.js";

const createProducto = async (body) => {
    console.log("cuerpo del producto en el servicio: ", body)
    try {
        const createdProducto = await sequelize.models.Productos.create({
            nombre: body.nombre,
            precio: body.precio,
            idSubCategoria: body.idSubCategoria,
            descripcion: body.descripcion
        })

        // Obtiene las medidas basadas en los IDs proporcionados (medidas = [1,2,3])
        const medidas = await sequelize.models.Medidas.findAll({
            where: {
                id: body.medidas
            },
        })

        // Crea los registros en la tabla Medidas_Productos
        await Promise.all(medidas.map((medida) =>
            createdProducto.addMedidas(medida)
        ));

        return createdProducto.dataValues
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') { // si viola las restricciones UNIQUE de nombre de producto
            // Manejar el error de restricción única
            return { error: 'Ya existe un producto con ese nombre' };
        } else {
            // Manejar otros errores
            console.log("ERROR AL CREAR PRODUCTO: ", error);
            return { error: 'Error al crear el producto.' };
        }
    }
}   

const getSeccionProductos = async () => {
   const categorias = await sequelize.models.Categorias_Productos.findAll({
         include: {
              model: sequelize.models.SubCategorias_Productos,
              include: {
                model: sequelize.models.Productos,
                include: [
                    {
                        model: sequelize.models.Fotos_Productos
                    },
                    {
                        model: sequelize.models.Medidas,
                        attributes: ['id', 'nombre'],
                    }
                ],
              }
         }
   })

   return categorias.map(categoria => {
        return {
            id: categoria.id,
            nombre: categoria.nombre,
            subcategorias: categoria.SubCategorias_Productos.map(subcategoria => {
                return {
                    id: subcategoria.id,
                    nombre: subcategoria.nombre,
                    productos: subcategoria.Productos.map(producto => {
                        return {
                            id: producto.id,
                            nombre: producto.nombre,
                            precio: producto.precio,
                            descripcion: producto.descripcion,
                            fotos: producto.Fotos_Productos.map(foto => {
                                return {
                                    id: foto.id,
                                    url: foto.url
                                }
                            }),
                            medidas: producto.Medidas.map(medida => {
                                return {
                                    id: medida.id,
                                    nombre: medida.nombre
                                }
                            })
                        }
                    })
                }
            })
        }
   })
}

const updateProducto = async (id, body) => {
    try {
        const productoAActualizar = await sequelize.models.Productos.findByPk(id);
        if (!productoAActualizar) return { error: "No existe ese producto" };

        productoAActualizar.nombre = body.nombre;
        productoAActualizar.precio = body.precio;
        productoAActualizar.descripcion = body.descripcion;

        // borrar las medidas asociadas al profesional encontrado
        await sequelize.models.Medidas_Productos.destroy({
            where: {
                ProductoId: id
            }
        });

        for (const idMedida of body.nuevasMedidas) {
            await sequelize.models.Medidas_Productos.create({
                ProductoId: id,
                MedidaId: idMedida
            });
        }


        await productoAActualizar.save();
    } catch (error) {
        console.log("error en update: ", error);
        if (error.name === 'SequelizeUniqueConstraintError') { // si viola las restricciones UNIQUE de nombre de producto
            // Manejar el error de restricción única
            return { error: 'Ya existe un producto con ese nombre' };
        } else {
            // Manejar otros errores
            console.log("ERROR AL CREAR PRODUCTO: ", error);
            return { error: 'Error al crear el producto.' };
        }
    }
}

const deleteProducto = async (id) => {
    try {
        const productoABorrar = await sequelize.models.Productos.findByPk(id);
        if (!productoABorrar) {
            return { error: 'No existe un producto con ese id.' };
        }

        await sequelize.models.Medidas_Productos.destroy({
            where: {
                ProductoId: id
            }
        });

        await sequelize.models.Fotos_Productos.destroy({
            where: {
                idProducto: id
            }
        });
        

        await sequelize.models.Productos.destroy({
            where: {
                id: id
            }
        })

        return { message: 'Producto eliminado con éxito' }
    } catch (error) {
        // Manejar otros errores
        console.log("ERROR AL ELIMINAR PRODUCTO: ", error);
        return { error: 'Error al eliminar el producto.' };
    }
}

const productos_services = {
    createProducto,
    getSeccionProductos,
    deleteProducto,
    updateProducto
}

export { productos_services }