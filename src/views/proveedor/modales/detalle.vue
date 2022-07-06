<template>
  <div>
    <modal ref="modal" titulo="Detalle del proveedor" :impedir-close="impedirClose">
      <div v-loading="loadingDetallesProv" v-if="datosProv != null">
        <el-descriptions
          title="Detalles del proveedor"
          direction="vertical"
          :column="4"
          :size="size"
          border
        >
          <el-descriptions-item label="Nombre">
            {{ datosProv.proveedor_nombre }}
          </el-descriptions-item>

          <el-descriptions-item label="Razón social">
            {{ datosProv.proveedor_razonsocial }}
          </el-descriptions-item>

          <el-descriptions-item label="Código">
            {{ datosProv.proveedor_codigo }}
          </el-descriptions-item>

          <el-descriptions-item label="CUIT">
            {{ datosProv.proveedor_cuit }}
          </el-descriptions-item>

          <el-descriptions-item label="Email">
            {{ datosProv.proveedor_email }}
          </el-descriptions-item>

          <el-descriptions-item label="Activo">
            <span v-if="datosProv.proveedor_activo == 1">
              <el-tag class="ml-2" type="success">SI</el-tag>
            </span>
            <span v-else>
              <el-tag class="ml-2" type="danger">NO</el-tag>
            </span>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </modal>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from "element-plus";

name: "nuevaUnidadMedida";
export default {
  data() {
    return {
      impedirClose: false,
      id: null,
      rubroSelect: [],
      rubroSeleccionado: null,
      rubrosElegidos: [],
      datosProv: {},
      rubroProv: null,
      loadingSelect: false,
      loadingDetallesProv: true,
      form: {
        id: null,
        nombre: null,
      },

      rules: {
        id: [
          {
            required: true,
            message: "Por favor ingrese el id del rubro.",
            trigger: "change",
          },
        ],

        nombre: [
          {
            required: true,
            message: "Por favor ingrese el nombre del rubro.",
            trigger: "change",
          },
        ],
      },
    };
  },

  created() {
    this.rubroObtenerTodosSelect();
  },

  methods: {
    abrir(id) {
      this.form.id = null;
      this.form.nombre = null;
      this.datosProv = null;
      this.id = id;
      this.loadingDetallesProv = false;
      // this.rubroSelect = []
      this.rubroSeleccionado = null;
      this.rubrosElegidos = [];
      this.datosProv = {};
      this.rubroProv = null;

      this.$refs.modal.abrir();

      this.obtenerDatosProveedor();
    },

    cerrar() {
      this.$refs.modal.cerrar();
    },

    async obtenerDatosProveedor() {
      this.loadingDetallesProv = true;
      const respuestaApi = await this.axios.get(
        "/api/proveedor/obtenerDatos/" + this.id
      );

      this.datosProv = respuestaApi.data;
      console.log(this.datosProv);

      this.loadingDetallesProv = false;
    },

    async rubroObtenerTodosSelect() {
      this.loadingSelect = true;
      const respuestaApi = await this.axios.get(
        "/api/rubro/obtenerTodosSelect"
      );

      this.rubroSelect = respuestaApi.data;
      console.log("rubroSelect");
      console.log(this.rubroSelect);

      this.loadingSelect = false;
    },

    obtenerDatosDesdeSelect() {
      console.log(this.rubroProv);

      this.rubroSelect.forEach((elemento) => {
        if (elemento.rubro_id == this.rubroProv) {
          this.rubroSeleccionado = elemento;
        }
      });

      console.log(this.rubroSeleccionado);
    },

    agregarRubroElegido() {
      this.rubrosElegidos.push(this.rubroSeleccionado);
    },

    eliminarRubroElegido(index) {
      this.rubrosElegidos.splice(index, 1);
    },

    async onSubmit() {
      let params = {
        id: this.form.id,
        nombre: this.form.nombre,
      };

      const respuestaApi = await this.axios.post("/api/rubro/crear", params);

      if (respuestaApi.data.code == 200) {
        ElMessage({
          type: "success",
          message: "¡Rubro añadido con éxito!",
        });
        this.$emit("actualizarTabla");
        this.cerrar();
      } else {
        if (respuestaApi.data.code == 400) {
          let erroresMostrar = "// ";
          let erorres = Object.values(respuestaApi.data.data);

          erorres.forEach((elemento) => {
            erroresMostrar = erroresMostrar + " " + elemento + " //";
          });

          ElMessage({
            type: "error",
            grouping: true,
            message: erroresMostrar,
            duration: 5000,
          });
        }
      }
    },

    deshabilitarBtnGuardar() {
      if (
        this.form.id == null ||
        this.form.id == "" ||
        this.form.id == 0 ||
        this.form.nombre == null ||
        this.form.nombre == ""
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style>
</style>