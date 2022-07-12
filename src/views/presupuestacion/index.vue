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
      <div class="contenedor-tabla" style="margin-top: 15px">
        <el-table 
          :data="presupuestaciones" 
          stripe 
          style="width: 100%"
          v-loading="loading"
        >
          <el-table-column prop="presupuestacion_id" label="Nro."  />

          <el-table-column prop="presupuestacion_plan_nombre" label="Fecha de creación">
            <template #default="props">
              {{ formatearFecha(props.row.presupuestacion_fecha_creacion) }}  
            </template>
          </el-table-column>
          
          <el-table-column prop="presupuestacion_plan_nombre" label="Plan"  />

          <el-table-column prop="presupuestacion_rubro_nombre" label="Rubro">
            <template #default="props">
              {{ props.row.presupuestacion_rubro_nombre }}  
            </template>
          </el-table-column>

          

          <el-table-column prop="presupuestacion_plan_nombre" label="Fecha de incio">
            <template #default="props">
              {{ formatearFecha(props.row.presupuestacion_fecha_incio) }}  
            </template>
          </el-table-column>

          <el-table-column prop="presupuestacion_plan_nombre" label="Fecha de fin">
            <template #default="props">
              {{ formatearFecha(props.row.presupuestacion_fecha_fin) }}  
            </template>
          </el-table-column>

          <!-- Aregar rubro -->
          <el-table-column 
            label="Carga" 
            prop="editar" 
            header-align="right" 
            align="right"
            width="90px"
          >
              <template #default="props">
                <el-button 
                  type="primary" 
                  circle
                  @click="$refs.modalCarga.abrir(props.row.presupuestacion_id)"
                >
                  <span class="material-icons">add_shopping_cart</span>
                </el-button>
              </template>
          </el-table-column>

          <!-- Crear presupuestacion -->
          <el-table-column 
            label="Comparativa" 
            prop="comparativa" 
            header-align="center" 
            align="center"
            width="110px"
          >
              <template #default="props">
                <el-button 
                  type="primary" 
                  circle
                  @click="$refs.modalComparativa.abrir(props.row.presupuestacion_id)"
                >
                  <span class="material-icons">view_week</span>
                </el-button>
              </template>
          </el-table-column>

          <!-- Ver datos -->
          <el-table-column 
            label="Detalle" 
            prop="detalle" 
            header-align="right" 
            align="right"
            width="90px"
          >
              <template #default="props">
                <el-button 
                  type="primary" 
                  circle
                  @click="$refs.modalDetalle.abrir(props.row.presupuestacion_id)"
                >
                  <span class="material-icons">visibility</span>
                </el-button>
              </template>
          </el-table-column>

          

          <!-- <el-table-column prop="address" label="Address" /> -->
        </el-table>
      </div>
    </el-card>
  </main>

  <modal-nuevo 
    ref="modalNuevo"
    @actualizarTabla="obtenerTodos"
  ></modal-nuevo>
  
  <modal-carga
    ref="modalCarga"
  ></modal-carga>
  
  <modal-detalle
    ref="modalDetalle"
  ></modal-detalle>

  <modal-comparativa
    ref="modalComparativa"
  ></modal-comparativa>



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
  import ModalDetalle from './modales/detalle.vue'
  import ModalCarga from './modales/carga.vue'
  import ModalComparativa from './modales/comparativa.vue'
//   import ModalModificar from './modales/modificar.vue'
//   import ModalEliminar from './modales/eliminar.vue'

  export default {
    components:{
      ModalNuevo,
      ModalDetalle,
      ModalCarga,
      ModalComparativa,
    //   ModalModificar,
    //   ModalEliminar
    },
    
    data() {
      return {       
        loading: false,
        presupuestaciones: [],
        loading: false
      }
    },

    mounted(){
        this.obtenerTodos()
        this.obtenerTodosArticulo()
        
      },

    methods: {
      async obtenerTodos(){
        this.loading = true
        await this.axios.get("/api/presupuestacion/obtenerTodos")
          .then(response =>{
            console.log(response.data);
            this.presupuestaciones = response.data
        })   
        this.loading = false
      },

      async obtenerTodosArticulo(){
        this.loading = true
        await this.axios.get(this.base_url + "/articulo/obtenerTodos")
          .then(response =>{
            this.articulos = response.data;   
        })    
        this.loading = false    
      },

      formatearFecha(fecha){
        let fecha1 = new Date(fecha)
        // let fecha2 = fecha1.toLocaleString();
        let fecha2 = fecha1.toLocaleDateString();        
        return fecha2
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