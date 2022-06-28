<template>
  <div>
    <modal
      ref="modal"
      titulo="Datos del producto"
      :impedir-close="impedirClose"
    >
        <el-descriptions
          title="Información del producto"
          direction="vertical"
          :column="4"
          :size="size"
          border
          v-loading="loading"
        >
          <div v-if="datos != null">
            <el-descriptions-item label="Código">
              {{ datos.producto_codigo }}
            </el-descriptions-item>
            
            <el-descriptions-item label="Nombre">
              {{ datos.producto_nombre }}
            </el-descriptions-item>
            
            <el-descriptions-item label="Rubro">
              {{ datos.rubro.rubro_nombre }}
            </el-descriptions-item>
            
            <el-descriptions-item label="Un. de medida">
              {{ datos.producto_unidad }}
            </el-descriptions-item>
            
            <el-descriptions-item label="Estado del producto">
              <span v-if="datos.producto_activo == 1">
                <el-tag size="small" type="success">Activo</el-tag>
              </span>
              <span v-else>
                <el-tag size="small" type="danger">Inactivo</el-tag>
              </span>
            </el-descriptions-item>
            
            <el-descriptions-item label="Fecha de ult. compra">
              {{ datos.producto_fpuc.split('-').reverse().join('/') }}
            </el-descriptions-item>

            <el-descriptions-item label="Precio de ult. compra">
              $ {{ datos.producto_puc }}
            </el-descriptions-item>
          </div>
        </el-descriptions>
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
      datos: null,
    };
  },

  methods: {
    abrir(id) {
      this.loading = true;
      this.id = null;
      this.id = id;
      this.datos = null

      this.$refs.modal.abrir();

      // limpio los campos
      this.getDatos();
      
    },

    cerrar() {
      this.$refs.modal.cerrar();
    },

    async getDatos() {
      await this.axios
        .get("/api/producto/obtenerDatos/" + this.id)
        .then((response) => {
          const respuestaApi = response;
          console.log(respuestaApi);

          if (respuestaApi != null) {
            this.datos = respuestaApi.data
            console.log(this.datos);

            this.loading = false;
          } else {
            this.cerrar();
          }
        });
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
