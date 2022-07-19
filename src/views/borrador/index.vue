<template>
  <main>
    <el-card>
      <template #header>
        <h1>Borradores</h1>          
      </template>
        <!-- <el-button 
          type="primary" 
          @click="$refs.modalNuevo.abrir()"
          class="btnElement"
          style="margin-left: 10px"
        > 
          Nuevo
        </el-button>        -->

      <!-- Tabla para mostrar los datos -->
      <div class="contenedor-tabla" style="margin-top: 15px">
        <el-table 
          :data="borradorpresupuestaciones" 
          stripe 
          style="width: 100%"
          v-loading="loading"
        >
          <el-table-column prop="presupuestacion_id" label="Nro.">
            <template #default="props">
              {{ props.row.borrador_presupuestacion_id }}  
            </template>
          </el-table-column>

          <el-table-column prop="presupuestacion_plan_nombre" label="Fecha de creación">
            <template #default="props">
              {{ formatearFecha(props.row.borrador_presupuestacion_fecha_creacion) }}  
            </template>
          </el-table-column>
          
          <el-table-column prop="presupuestacion_plan_nombre" label="Plan">
            <template #default="props">
              {{ props.row.borrador_presupuestacion_plan_nombre }}  
            </template>
          </el-table-column>

          <!-- <el-table-column prop="presupuestacion_rubro_nombre" label="Rubro">
            <template #default="props">
              {{ props.row.borrador_presupuestacion_rubro_nombre }}  
            </template>
          </el-table-column> -->

          <el-table-column prop="presupuestacion_plan_nombre" label="Fecha de incio">
            <template #default="props">
              {{ formatearFecha(props.row.borrador_presupuestacion_fecha_incio) }}  
            </template>
          </el-table-column>

          <el-table-column prop="presupuestacion_plan_nombre" label="Fecha de fin">
            <template #default="props">
              {{ formatearFecha(props.row.borrador_presupuestacion_fecha_fin) }}  
            </template>
          </el-table-column>

          <el-table-column prop="borrador_presupuestado" label="Estado">
            <template #default="props">
              <span v-if="props.row.borrador_presupuestado == 0">
                <el-tag class="ml-2" type="warning">Borrador</el-tag>
              </span>
              <span v-if="props.row.borrador_presupuestado == 1">
                <el-tag class="ml-2" type="success">Presupuestado</el-tag>
              </span>
            </template>
          </el-table-column>

          <!-- Modificar -->
          <el-table-column 
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
                  @click="$refs.modalEditar.abrir(props.row.borrador_presupuestacion_id)"
                  :disabled="props.row.borrador_presupuestado == 1"
                >
                  <span class="material-icons">edit</span>
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
                  @click="$refs.modalDetalle.abrir(props.row.borrador_presupuestacion_id)"
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

  <modal-editar
    ref="modalEditar"
    @actualizarTabla="obtenerTodos"
  ></modal-editar>
  
  <modal-detalle
    ref="modalDetalle"
  ></modal-detalle>



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
  import ModalDetalle from './modales/detalle.vue'
  import ModalEditar from './modales/editar.vue'

  export default {
    components:{
      ModalDetalle,
      ModalEditar
    },
    
    data() {
      return {       
        loading: false,
        borradorpresupuestaciones: [],
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
        await this.axios.get("/api/borradorpresupuestacion/obtenerTodos")
          .then(response =>{
            console.log(response.data);
            this.borradorpresupuestaciones = response.data
            console.log("this.borradorpresupuestaciones");
            console.log(this.borradorpresupuestaciones);

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