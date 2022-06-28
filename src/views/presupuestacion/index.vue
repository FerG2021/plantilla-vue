<template>
  <main>
    <el-card>
      <template #header>
        <h1>Presupuestación</h1>          
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
        
      </div>
    </el-card>
  </main>

  <modal-nuevo 
    ref="modalNuevo"
    @actualizarTabla="obtenerTodos"
  ></modal-nuevo>
  
  <!-- <modal-modificar 
    ref="modalModificar"
    @actualizarTabla="obtenerTodos"
  ></modal-modificar>
  
  <modal-eliminar 
    ref="modalEliminar"
    @actualizarTabla="obtenerTodos"
  ></modal-eliminar> -->
</template>

<script>
  import ModalNuevo from './modales/nuevo.vue'
//   import ModalModificar from './modales/modificar.vue'
//   import ModalEliminar from './modales/eliminar.vue'

  export default {
    components:{
      ModalNuevo,
    //   ModalModificar,
    //   ModalEliminar
    },
    
    data() {
      return {       
        loading: false,
      }
    },

    mounted(){
        this.obtenerTodos()
      },

    methods: {
      async obtenerTodos(){
        this.loading = true
        await this.axios.get(this.base_url + "/articulo/obtenerTodos")
          .then(response =>{
            this.articulos = response.data;   
        })    
        this.loading = false    
      }
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