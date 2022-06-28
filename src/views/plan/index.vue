<template>
  <main>
    <el-card>
      <template #header>
        <h1>Planes</h1>
      </template>
      <!-- <el-button
        type="primary"
        @click="$refs.modalNuevo.abrir()"
        class="btnElement"
        style="margin-left: 10px"
      >
        Nuevo
      </el-button> -->

      <!-- Tabla para mostrar los datos -->
      <div class="contenedor-tabla">
        <el-table
          :data="
            planes.slice((currentPage - 1) * pageSize, currentPage * pageSize)
          "
          fixed
          v-loading="loading"
        >
          <!-- Nombre -->
          <el-table-column label="Nombre" prop="descripcion">
            <template #default="props">
              <span>{{ props.row.plan_nombre }}</span>
            </template>
          </el-table-column>

          <!-- Fecha inicio -->
          <el-table-column label="Fecha inicio" prop="fincio">
            <template #default="props">
              <span>{{ props.row.plan_fdesde }}</span>
            </template>
          </el-table-column>

          <!-- Fecha fin -->
          <el-table-column label="Fecha fin" prop="fincio">
            <template #default="props">
              <span>{{ props.row.plan_fhasta }}</span>
            </template>
          </el-table-column>

          <!-- Cantidad de meses -->
          <el-table-column label="Cant. meses" prop="fincio">
            <template #default="props">
              <span>{{ props.row.plan_plazo}}</span>
            </template>
          </el-table-column>

          <!-- Cantidad de meses -->
          <el-table-column label="Estado" prop="fincio">
            <template #default="props">
              <span v-if="props.row.plan_activo == 1">
                <el-tag size="small" type="success">Activo</el-tag>
              </span>
              <span v-else>
                <el-tag size="small" type="danger">Inactivo</el-tag>
              </span>
            </template>
          </el-table-column>



          <!-- Codigo -->
          <!-- <el-table-column label="Código" prop="codigo">
            <template #default="props">
              <span>{{ props.row.producto_codigo }}</span>
            </template>
          </el-table-column> -->

          <!-- Rubro -->
          <!-- <el-table-column label="Rubro" prop="rubro">
            <template #default="props">
              <span>{{ props.row.rubro.rubro_nombre }}</span>
            </template>
          </el-table-column> -->

          <!-- Editar -->
          <!-- <el-table-column
            label="Ver"
            prop="ver"
            header-align="center"
            align="center"
            width="75px"
          >
            <template #default="props">
              <el-button
                type="primary"
                circle
                @click="$refs.modalVer.abrir(props.row.producto_id)"
              >
                <span class="material-icons">visibility</span>
              </el-button>
            </template>
          </el-table-column> -->

          <!-- Eliminar -->
          <!-- <el-table-column 
            label="Eliminar" 
            prop="eliminar" 
            header-align="right" 
            align="right"
            width="90px"
          >
              <template #default="props">
                <el-button 
                  type="danger" 
                  circle 
                  @click="$refs.modalEliminar.abrir(props.row.id)"
                >
                  <span class="material-icons">delete</span>
                </el-button>
              </template>
          </el-table-column> -->
        </el-table>

        <div class="contenedor-paginator">
          <el-pagination
            layout="prev, pager, next, sizes, total, jumper"
            :page-sizes="[10, 20, 30]"
            :page-size="pageSize"
            :total="planes.length"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            style="text-align: center; margin-top: 1%"
          >
          </el-pagination>
        </div>
      </div>
    </el-card>
  </main>

  <modal-ver ref="modalVer"></modal-ver>

  <!-- <modal-nuevo ref="modalNuevo" @actualizarTabla="obtenerTodos"></modal-nuevo>

  <modal-modificar
    ref="modalModificar"
    @actualizarTabla="obtenerTodos"
  ></modal-modificar>

  <modal-eliminar
    ref="modalEliminar"
    @actualizarTabla="obtenerTodos"
  ></modal-eliminar> -->
</template>

<script>
import ModalVer from "./modales/ver.vue";
//   import ModalNuevo from "./modales/nuevo.vue";
//   import ModalModificar from "./modales/modificar.vue";
//   import ModalEliminar from "./modales/eliminar.vue";

export default {
  components: {
    ModalVer,
    //   ModalNuevo,
    //   ModalModificar,
    //   ModalEliminar,
  },

  data() {
    return {
      planes: [],
      paginas: {},
      fecha: Date,
      loading: false,
      pageSize: 20,
      currentPage: 1,
    };
  },

  mounted() {
    this.obtenerTodos();
  },

  methods: {
    async obtenerTodos() {
      this.loading = true;
      await this.axios.get("/api/plan/obtenerTodos").then((response) => {
        this.planes = response.data;
        this.paginas = response.data.pagina;
        this.fecha = response.data[0].plan_fdesde;
        console.log("fecha" + this.fecha);
        console.log(this.planes);
        console.log(this.paginas);
      });
      this.loading = false;
    },

    handleCurrentChange: function (cpage) {
      this.$data.currentPage = cpage;
    },
    handleSizeChange: function (psize) {
      this.$data.pageSize = psize;
    },
  },
};
</script>

<style>
.contenedor-tabla {
  overflow: hidden;
  position: relative;
  float: right;
  width: 99%;
}

.material-icons {
  font-size: 24px;
}

.contenedor-paginator {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
