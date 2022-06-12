<template>
  <main>
    <el-card>
      <template #header>
        <h1>Categorías</h1>          
      </template>
        <el-button 
          type="primary" 
          @click="$refs.modalNuevo.abrir()"
          class="btnElement"
          style="margin-left: 10px"
        > 
          Nuevo
        </el-button>       

      <!-- Tabla para mostrar los datos -->
      <div class="contenedor-tabla">
        <el-table :data="categorias" fixed v-loading="loading">
          <!-- Nombre -->
          <el-table-column            
            label="Nombre" 
            prop="descripcion"           
          >
              <template #default="props">
                <span>{{ props.row.nombre }}</span>
              </template>
          </el-table-column>

          <!-- Editar -->
          <el-table-column 
            label="Editar" 
            prop="editar" 
            header-align="right" 
            align="right"
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
          </el-table-column>

          <!-- Eliminar -->
          <el-table-column 
            label="Eliminar" 
            prop="eliminar" 
            header-align="right" 
            align="right"
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
          </el-table-column>        
        </el-table>       

        <!-- <el-select v-model="value" class="m-2" placeholder="Select" size="large" filterable>
          <el-option
            v-for="item in categoriasSelect"
            :key="item.id"
            :label="item.nombre"
            :value="item.id"
          />
        </el-select>
        {{value}}
        <el-button @click="mostrar">mostrar</el-button> -->
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
        categorias: [],
        categoriasSelect: [],
        loading: false,
        value: null,
      }
    },

    mounted(){
        this.obtenerTodos()
      },

    methods: {
      async obtenerTodos(){
        this.loading = true
        await this.axios.get(this.base_url + "/categoria/obtenerTodos")
          .then(response =>{
            this.categorias = response.data; 
            
            console.log(this.categorias)
        })    
        this.loading = false    
        this.obtenerTodosSelect()
      },

      async obtenerTodosSelect(){
        await this.axios.get(this.base_url + "/categoria/obtenerTodosSelect")
          .then(response => {
            this.categoriasSelect = response.data
            console.log(this.categoriasSelect)
          });
      },

      mostrar(){
        console.log(this.value.id)
      },

      obtenerLabel(item){
        console.log(item)
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
</style>