<template>
  <main>
    <el-card>
      <template #header>
        <h1>Rubros</h1>          
      </template>
        <!-- <el-button 
          type="primary" 
          @click="$refs.modalNuevo.abrir()"
          class="btnElement"
          style="margin-left: 10px"
        > 
          Nuevo
        </el-button>        -->

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
                    v-model="filtroID"
                    placeholder="Buscar por ID"
                    clearable 
                    :controls="false"
                    style="width: 100%"
                  ></el-input>
                </el-col>  

                <el-col :span="8">
                  <el-input
                    v-model="filtroCodigo"
                    placeholder="Buscar por código"
                    clearable 
                  ></el-input>
                </el-col>
              </el-row>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>


      <!-- Tabla para mostrar los datos -->
      <div class="contenedor-tabla">
        <el-table :data="
            rubrosNuevo.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize
            )
          " fixed v-loading="loading">
          <!-- Nombre -->
          <el-table-column            
            label="Nombre" 
            prop="nombre"           
          >
              <template #default="props">
                <span>{{ props.row.rubro_nombre }}</span>
              </template>
          </el-table-column>

          <!-- ID -->
          <el-table-column            
            label="ID" 
            prop="id"           
          >
              <template #default="props">
                <span>{{ props.row.rubro_id }}</span>
              </template>
          </el-table-column>

          <!-- Codigo -->
          <el-table-column            
            label="Código" 
            prop="codigo"           
          >
              <template #default="props">
                <span>{{ props.row.rubro_codigo }}</span>
              </template>
          </el-table-column>
          
          <!-- Editar -->
          <!-- <el-table-column 
            label="Editar" 
            prop="editar" 
            header-align="right" 
            align="right"
            width="90px"
          >
              <template #default="props">
                <el-button 
                  type="primary" 
                  circle
                  @click="$refs.modalModificar.abrir(props.row.id)"
                >
                  <span class="material-icons">edit</span>
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
            :total="rubros.length"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            style="text-align: center; margin-top: 1%"
          >
          </el-pagination>
        </div>

      </div>
    </el-card>
  </main>

  <modal-nuevo 
    ref="modalNuevo"
    @actualizarTabla="obtenerTodos"
  ></modal-nuevo>
  
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
  import ModalNuevo from './modales/nuevo.vue'
  import ModalModificar from './modales/modificar.vue'
  import ModalEliminar from './modales/eliminar.vue'

  export default {
    components:{
      ModalNuevo,
      ModalModificar,
      ModalEliminar
    },
    
    data() {
      return {
        rubros: [],
        rubrosNuevo: [],

        loading: false,
        pageSize: 20,
        currentPage: 1,

        // filtros
        filtroNombre: '',
        filtroID: null,
        filtroCodigo: '',
      }
    },

    mounted(){
      this.obtenerTodos()
    },

    watch: {
      filtroNombre(val) {
        if(val == ''){
          this.rubrosNuevo = this.rubros
        }else{
          this.rubrosNuevo = this.buscarNombre(val)
        }
      },

      filtroID(val) {
        if(val == null){
          this.rubrosNuevo = this.rubros
        }else{
          this.rubrosNuevo = this.buscarID(val)
        }
      },

      filtroCodigo(val) {
        if(val == ''){
          this.rubrosNuevo = this.rubros
        }else{
          this.rubrosNuevo = this.buscarCodigo(val)
        }
      },
    },

    methods: {
      async obtenerTodos(){
        this.loading = true
        await this.axios.get("/api/rubro/obtenerTodos")
          .then(response =>{
            this.rubros = this.rubrosNuevo = response.data;   
            // console.log(this.rubros);
        })    
        this.loading = false    
      },

      handleCurrentChange: function (cpage) {
        this.$data.currentPage = cpage;
      },
      handleSizeChange: function (psize) {
        this.$data.pageSize = psize;
      },

      buscarNombre(keywords){
        return this.rubros.filter(item =>{
          let nombreLower = item.rubro_nombre.toLowerCase()
          let keywordsLower = keywords.toLowerCase()
          if(nombreLower.includes(keywordsLower)){
            return item
          }
        })
      },

      buscarID(keywords) {
        return this.rubros.filter(item =>{
          let codigoString = item.rubro_id.toString()
          let keywordsString = keywords.toString()
          if(codigoString.includes(keywordsString)) {
            return item
          }
        })
      },

      buscarCodigo(keywords){
        return this.rubros.filter(item =>{
          let nombreLower = item.rubro_codigo.toLowerCase()
          let keywordsLower = keywords.toLowerCase()
          if(nombreLower.includes(keywordsLower)){
            return item
          }
        })
      },
    },

  }
</script>

<style>
  .contenedor-tabla{
    overflow: hidden;
    position: relative;
    float: right;
    width: 99%;
  }

  .material-icons{
    font-size: 24px;
  }

  .contenedor-paginator{
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>