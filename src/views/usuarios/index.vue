<template>
  <main class="about-page">
    <el-card>
      <template #header>
        <h1>Usuarios</h1>
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
        <el-table :data="usuarios" fixed v-loading="loading">
          <!-- Nombre -->
          <el-table-column            
            label="Nombre" 
            prop="nombre"           
          >
              <template #default="props">
                <span>{{ props.row.name }}</span>
              </template>
          </el-table-column>

          <!-- Email -->
          <el-table-column            
            label="Email" 
            prop="email"           
          >
              <template #default="props">
                <span>{{ props.row.email }}</span>
              </template>
          </el-table-column>

          <!-- Editar -->
          <el-table-column 
            label="Editar" 
            prop="editar" 
            header-align="right" 
            align="right"
            width="90px"
          >
              <template #default="props">
                <el-button 
                  v-if="props.row.id != $store.state.user.id"
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
            width="90px"
          >
              <template #default="props">
                <el-button
                  v-if="props.row.id != $store.state.user.id"
                  type="danger" 
                  circle 
                  @click="$refs.modalEliminar.abrir(props.row.id)"
                >
                  <span class="material-icons">delete</span>
                </el-button>
              </template>
          </el-table-column>
        </el-table>
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
    components: {
      ModalNuevo,
      ModalModificar,
      ModalEliminar,
    },

    data() {
      return {
        usuarios: [],
        loading: false,
      }
    },

    mounted() {
      this.obtenerTodos()
    },

    methods: {
      async obtenerTodos(){
        this.loading = true
        await this.axios.get("/api/usuario/obtenerTodos")
          .then(res => {
            this.usuarios = res.data;
            console.log(this.usuarios);
        })

        this.loading = false
      }
    },
  }
</script>

<style>

</style>