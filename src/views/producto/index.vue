<template>
  <main>
    <el-card>
      <h1>Productos</h1>
      <hr>
      <div style="margin-top: 5px">
        <el-button 
          type="primary" 
          @click="$refs.modalNuevo.abrir()"
          style="float: right"
          class="btnElement"
        > 
          Nuevo <span class="material-icons">add</span>
        </el-button>
      </div>

      <!-- Tabla para mostrar los datos -->
      <el-table :data="articulos" style="width: 100%">
        <!-- Nombre -->
        <el-table-column            
          label="Nombre" 
          prop="descripcion"           
        >
            <template #default="props">
              <span>{{ props.row.descripcion }}</span>
            </template>
        </el-table-column>

        <!-- Stock -->
        <el-table-column 
          label="Stock" 
          prop="stock" 
          header-align="right" 
          align="right"
        >
            <template #default="props">
              <span>{{ props.row.stock }}</span>
            </template>
        </el-table-column>

        <!-- Precio -->
        <el-table-column 
          label="Precio" 
          prop="precio" 
          header-align="right" 
          align="right"
        >
            <template #default="props">
              <span>${{ props.row.precio }}</span>
            </template>
        </el-table-column>

        <!--  Editar -->
        <el-table-column 
          label="Editar" 
          prop="editar" 
          header-align="right" 
          align="right"
        >
            <template #default="props">
              <el-button 
                type="primary" 
                circle @click="$refs.modalModificar.abrir(props.row.id)"
              >
                <span class="material-icons">edit</span>
              </el-button>
            </template>
        </el-table-column>
       
      </el-table>

    </el-card>
  </main>

  <modal-nuevo ref="modalNuevo"></modal-nuevo>
  <modal-modificar ref="modalModificar"></modal-modificar>
</template>

<script>
  import ModalNuevo from './modales/nuevo.vue'
  import ModalModificar from './modales/modificar.vue'
  export default {
    components:{
      ModalNuevo,
      ModalModificar
    },
    
    data() {
      return {
        url: 'http://localhost:8000/api/articulos/',
        articulos: [],
      }
    },

    mounted(){
        this.mostrarDatos()
      },

    methods: {
      

      async mostrarDatos(){
        await this.axios.get(this.url)
          .then(response =>{
            this.articulos = response.data;   
            console.log(this.articulos)
        })        
      }
    },

  }
</script>

<style>
  
</style>