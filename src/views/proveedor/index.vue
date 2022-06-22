<template>
  <main>
    <el-card>
      <template #header>
        <h1>Proveedores</h1>          
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
        <el-table :data="proveedores" fixed v-loading="loading">
          <!-- Nombre -->
          <el-table-column            
            label="Nombre" 
            prop="nombre"           
          >
              <template #default="props">
                <span>{{ props.row.proveedor_nombre }}</span>
              </template>
          </el-table-column>

          <!-- Razon social -->
          <el-table-column            
            label="Razón social" 
            prop="razonsocial"           
          >
              <template #default="props">
                <span>{{ props.row.proveedor_razonsocial }}</span>
              </template>
          </el-table-column>
          
          <!-- Codigo -->
          <el-table-column            
            label="Código" 
            prop="codigo"           
          >
              <template #default="props">
                <span>{{ props.row.proveedor_codigo }}</span>
              </template>
          </el-table-column>
          
          <!-- CUIT -->
          <el-table-column 
            label="CUIT" 
            prop="cuit"             
          >
              <template #default="props">
                <span>{{ props.row.proveedor_cuit }}</span>
              </template>
          </el-table-column>
          

          <!-- Email -->
          <el-table-column 
            label="Email" 
            prop="email"             
          >
              <template #default="props">
                <span>{{ props.row.proveedor_email }}</span>
              </template>
          </el-table-column>

          <!-- Activo -->
          <el-table-column 
            label="Activo" 
            prop="activo"             
          >
              <template #default="props">
                <span v-if="props.row.proveedor_activo == 1">
                  <el-tag class="ml-2" type="success">SI</el-tag>
                </span>
                <span v-else>
                  <el-tag class="ml-2" type="danger">NO</el-tag>
                </span>
              </template>
          </el-table-column>

          <!-- Aregar rubro -->
          <el-table-column 
            label="Rubro" 
            prop="editar" 
            header-align="right" 
            align="right"
            width="90px"
          >
              <template #default="props">
                <el-button 
                  type="primary" 
                  circle
                  @click="$refs.modalRubro.abrir(props.row.proveedor_auto)"
                >
                  <span class="material-icons">sell</span>
                </el-button>
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

  <modal-rubro
    ref="modalRubro"
  ></modal-rubro>
</template>

<script>
  import ModalNuevo from './modales/nuevo.vue'
  import ModalModificar from './modales/modificar.vue'
  import ModalEliminar from './modales/eliminar.vue'
  import ModalRubro from './modales/rubro.vue'

  export default {
    components:{
      ModalNuevo,
      ModalModificar,
      ModalEliminar,
      ModalRubro
    },
    
    data() {
      return {
        url: 'http://localhost:8000/api/articulo/',
        proveedores: [],
        loading: false,
      }
    },

    mounted(){
        this.obtenerTodos()
      },

    methods: {
      async obtenerTodos(){
        this.loading = true
        await this.axios.get("/api/proveedor/obtenerTodos")
          .then(response =>{
            this.proveedores = response.data;   
            console.log(this.proveedores);
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