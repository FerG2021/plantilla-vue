<template>
  <main>
    <el-card>
      <template #header>
        <h1>Productos</h1>
      </template>
      <!-- <el-button
        type="primary"
        @click="$refs.modalNuevo.abrir()"
        class="btnElement"
        style="margin-left: 10px"
      >
        Nuevo
      </el-button> -->

      <!-- Collapse para filtros -->
      <div class="demo-collapse">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="Filtros" name="1">
            <template #title>
              <h4 style="color: #95989e">
                <span class="material-icons">manage_search</span>
              </h4>
            </template>
            <div>
              <el-row :gutter="10">
                <el-col :span="8">
                  <!-- Filtro por nombre -->
                  <el-input
                    v-model="filtroNombre"
                    placeholder="Buscar por nombre"
                    clearable 
                  ></el-input>
                </el-col>

                <el-col :span="8">
                  <!-- Filtro por codigo -->
                  <el-input
                    v-model="filtroCodigo"
                    placeholder="Buscar por código"
                    clearable 
                    :controls="false"
                    style="width: 100%"
                  ></el-input>
                </el-col>  

                <el-col :span="8">
                  <el-select 
                    v-model="filtroRubro" 
                    placeholder="Seleccionar por rubro"
                    filterable
                    clearable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in rubrosSelect"
                      :key="item.rubro_id"
                      :label="item.rubro_nombre"
                      :value="item.rubro_id"
                    />
                  </el-select>
                </el-col>
              </el-row>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>

      <!-- Tabla para mostrar los datos -->
      <div class="contenedor-tabla" style="margin-top: 10px">
        <el-table
          :data="
            productosNuevo.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize
            )
          "
          fixed
          v-loading="loading"
        >
          <!-- Nombre -->
          <el-table-column label="Nombre" prop="descripcion">
            <template #default="props">
              <span>{{ props.row.producto_nombre }}</span>
            </template>
          </el-table-column>

          <!-- Codigo -->
          <el-table-column            
            label="Código" 
            prop="codigo"
          >
              <template #default="props">
                <span>{{ props.row.producto_codigo }}</span>
              </template>
          </el-table-column>

          <!-- Rubro -->
          <el-table-column            
            label="Rubro" 
            prop="rubro"
          >
              <template #default="props">
                <span>{{ props.row.rubro.rubro_nombre }}</span>
              </template>
          </el-table-column>

          <!-- Editar -->
          <el-table-column 
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
          </el-table-column>

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
            :total="productos.length"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            style="text-align: center; margin-top: 1%"
          >
          </el-pagination>
        </div>
      </div>
    </el-card>
  </main>

  <modal-ver
    ref="modalVer"
  ></modal-ver>

  <modal-nuevo ref="modalNuevo" @actualizarTabla="obtenerTodos"></modal-nuevo>

  <modal-modificar
    ref="modalModificar"
    @actualizarTabla="obtenerTodos"
  ></modal-modificar>

  <modal-eliminar
    ref="modalEliminar"
    @actualizarTabla="obtenerTodos"
  ></modal-eliminar>
</template>

<script>
  import ModalVer from './modales/ver.vue'
  import ModalNuevo from "./modales/nuevo.vue";
  import ModalModificar from "./modales/modificar.vue";
  import ModalEliminar from "./modales/eliminar.vue";

  export default {
    components: {
      ModalVer,
      ModalNuevo,
      ModalModificar,
      ModalEliminar,
    },

    data() {
      return {
        productos: [],
        productosNuevo: [],        
        paginas: {},
        loading: false,
        pageSize: 20,
        currentPage: 1,

        filtroNombre: '',
        filtroCodigo: null,
        rubrosSelect: [],
        filtroRubro: '',
      };
    },

    mounted() {
      this.obtenerTodos();
      this.obtenerTodosRubro();
    },

    watch: {
      filtroNombre(val) {
        if(val == ''){
          this.productosNuevo = this.productos
        }else{
          this.productosNuevo = this.buscarNombre(val)
        }
      },

      filtroCodigo(val) {
        if(val == null){
          this.productosNuevo = this.productos
        }else{
          this.productosNuevo = this.buscarCodigo(val)
        }
      },

      filtroRubro(val) {
        if(val == ''){
          this.productosNuevo = this.productos
        }else{
          this.productosNuevo = this.buscarRubro(val)
        }
      }
    },

    methods: {
      async obtenerTodos() {
        this.loading = true;
        await this.axios.get("/api/producto/obtenerTodos").then((response) => {
          this.productos = this.productosNuevo = response.data.datos;
          this.paginas = response.data.pagina;
        });
        this.loading = false;
      },

      async obtenerTodosRubro(){
        await this.axios.get("/api/rubro/obtenerTodosSelect").then((response) => {
          this.rubrosSelect = response.data;          
        });
      },

      handleCurrentChange: function (cpage) {
        this.$data.currentPage = cpage;
      },
      handleSizeChange: function (psize) {
        this.$data.pageSize = psize;
      },

      buscarNombre(keywords){
        return this.productos.filter(item =>{
          let nombreLower = item.producto_nombre.toLowerCase()
          let keywordsLower = keywords.toLowerCase()
          if(nombreLower.includes(keywordsLower)){
            return item
          }
        })
      },

      buscarCodigo(keywords) {
        return this.productos.filter(item =>{
          let codigoString = item.producto_codigo.toString()
          let keywordsString = keywords.toString()
          if(codigoString.includes(keywordsString)) {
            return item
          }
        })
      },

      buscarRubro(keywords) {
        return this.productos.filter(item =>{
          if(item.rubro_id == keywords){
            return item
          }
        })
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

  .contenedor-paginator{
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
