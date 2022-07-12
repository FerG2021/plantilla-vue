<template>
  <div>
    <modal
      ref="modal"
      titulo="Detalle de la presupuestación"
      :impedir-close="impedirClose"
    >
      <el-descriptions
          title="Información de la presupuestación"
          direction="vertical"
          :column="3"
          :size="size"
          border
          v-loading="loading"
        >
          <div v-if="datos != null">
            <el-descriptions-item label="Nro. presupuestación">
              {{ datos.presupuestacion_id }}
            </el-descriptions-item>
            
            <el-descriptions-item label="Fecha de creación">
              {{ formatearFecha(datos.presupuesto_fecha_creacion) }}  
            </el-descriptions-item>
            
            <el-descriptions-item label="Plan">
              {{ datos.presupuestacion_plan_nombre }}
            </el-descriptions-item>
            
            <el-descriptions-item label="Incio de presupuestación">
              {{ formatearFecha(datos.presupuestacion_fecha_incio) }}  
            </el-descriptions-item>

            <el-descriptions-item label="Fin de presupuestación">
              {{ formatearFecha(datos.presupuestacion_fecha_fin) }}  
            </el-descriptions-item>

            <el-descriptions-item label="Rubro">
              <el-tag class="ml-2" type="success">{{ datos.presupuestacion_rubro_nombre }}</el-tag>
            </el-descriptions-item>
          </div>
        </el-descriptions>


        <h3 style="margin-top: 15px"><b>Productos</b></h3>
        <div v-if="datosProductos">
          <el-table :data="datosProductos" stripe style="width: 100%" v-loading="loadingProductos">
            <el-table-column prop="nombre" label="Nombre" >
              <template #default="props">
                <span>{{ props.row.producto_nombre }}</span>
              </template>
            </el-table-column>
            
            <el-table-column prop="nombre" label="Rubro" >
              <template #default="props">
                <span>{{ props.row.producto_rubro_nombre }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="cantidad" label="Cantidad a comprar" >
              <template #default="props">
                <span>{{ props.row.producto_cantidad_real_a_comprar }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>


        <h3 style="margin-top: 15px"><b>Proveedores</b></h3>
        <div v-if="datosProveedores">
          <el-table :data="datosProveedores" stripe style="width: 100%" v-loading="loadingProductos">
            <el-table-column prop="nombre" label="Nombre" >
              <template #default="props">
                <span>{{ props.row.proveedor_nombre }}</span>
              </template>
            </el-table-column>
            
            <el-table-column prop="nombre" label="Mail" >
              <template #default="props">
                <span>{{ props.row.proveedor_mail }}</span>
              </template>
            </el-table-column>
            
          </el-table>
        </div>
    </modal>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from "element-plus";

name: "nuevoProducto";
export default {
  data() {
    return {
      id: null,
      loading: false,
      loadingProductos: false,
      loadingProveedores: false,
      datos: null,
      datosProductos: [],
      datosProveedores: [],
    };
  },

  methods: {
    abrir(id) {
      this.loading = true;
      this.loadingProductos = true;
      this.loadingProveedores = true;
      this.id = null;
      this.id = id;
      this.datos = null
      this.datosProductos = []
      this.datosProveedores = []

      this.$refs.modal.abrir();

      // limpio los campos
      this.getDatos();

    },

    cerrar() {
      this.$refs.modal.cerrar();
    },

    async getDatos() {
      await this.axios
        .get("/api/presupuestacion/obtenerDatos/" + this.id)
        .then((response) => {
          const respuestaApi = response;
          console.log(respuestaApi);

          if (respuestaApi != null) {
            this.datos = respuestaApi.data
            console.log(this.datos);
            this.loading = false;

            this.datosProductos = respuestaApi.data.productos
            this.loadingProductos = false

            this.datosProveedores = respuestaApi.data.proveedores 
            this.loadingProveedores = false;


          } else {
            this.cerrar();
          }
        });
    },

    formatearFecha(fecha){
      let fecha1 = new Date(fecha)
      let fecha2 = fecha1.toLocaleDateString();
      return fecha2
    },

    // async categoriaObtenerTodosSelect() {
    //   await this.axios
    //     .get(this.base_url + "/categoria/obtenerTodosSelect")
    //     .then((response) => {
    //       this.categoriasSelect = response.data;
    //       console.log(this.categoriasSelect);
    //     });
    // },

    // async unidadMedidaObtenerTodosSelect() {
    //   await this.axios
    //     .get(this.base_url + "/unidad-medida/obtenerTodosSelect")
    //     .then((response) => {
    //       this.unidadMedidaSelect = response.data;
    //       console.log(this.categoriasSelect);
    //     });
    // },

    // cambiarValorIDUnMed() {
    //   this.form.idUnidadMedida = this.form.unidadMedida;
    // },

    // cambiarValorIDCategoria() {
    //   this.form.idCategoria = this.form.categoria;
    // },

    // onSubmit() {
    //   let params = {
    //     id: this.id,
    //     descripcion: this.form.nombre,
    //     precio: this.form.precio,
    //     stock: this.form.stock,
    //     idCategoria: this.form.idCategoria,
    //     idUnidadMedida: this.form.idUnidadMedida,
    //   };

    //   this.axios
    //     .put(this.base_url + "/articulo/actualizar/" + this.id, params)
    //     .then((response) => {
    //       ElMessage({
    //         type: "success",
    //         message: "¡Producto modificado con éxito!",
    //       });
    //       this.$emit("actualizarTabla");
    //       this.cerrar();
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // },

    // deshabilitarBtnGuardar() {
    //   if (
    //     this.form.nombre == null ||
    //     this.form.nombre == "" ||
    //     this.form.precio == null ||
    //     this.form.precio == 0 ||
    //     this.form.precio == "" ||
    //     this.form.stock == null ||
    //     this.form.stock == 0 ||
    //     this.form.stock == ""
    //   ) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // },
  },
};
</script>

<style></style>
