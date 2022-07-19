<template>
  <main>
    <el-card>
      <template #header>
        <h1>Proveedores</h1>          
      </template>

      <!-- <el-button 
        type="primary" 
        @click="$refs.modalNuevo.abrir()"
        class="btnElement"
        style="margin-left: 10px"
      > 
        Nuevo
      </el-button>     -->

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
                  <!-- Filtro por codigo -->
                  <el-input
                    v-model="filtroCuit"
                    placeholder="Buscar por cuit"
                    clearable 
                    :controls="false"
                    style="width: 100%"
                  ></el-input>
                </el-col>  

                <!-- <el-col :span="8">
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
                </el-col> -->
              </el-row>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>   

      <!-- Tabla para mostrar los datos -->
      <div class="contenedor-tabla">
        <el-table
          :data="
            proveedoresNuevo.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize
            )
          "
          fixed
          v-loading="loading"
        >
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
          <!-- <el-table-column            
            label="Razón social" 
            prop="razonsocial"           
          >
              <template #default="props">
                <span>{{ props.row.proveedor_razonsocial }}</span>
              </template>
          </el-table-column> -->
          
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
          <!-- <el-table-column 
            label="Email" 
            prop="email"             
          >
              <template #default="props">
                <span>{{ props.row.proveedor_email }}</span>
              </template>
          </el-table-column> -->

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

          <!-- Ver datos -->
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
                  @click="$refs.modalModificar.abrir(props.row.proveedor_id)"
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
                  @click="$refs.modalDetalle.abrir(props.row.proveedor_id)"
                >
                  <span class="material-icons">visibility</span>
                </el-button>
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
                  @click="$refs.modalRubro.abrir(props.row.proveedor_id)"
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

        <div class="contenedor-paginator">
          <el-pagination
            layout="prev, pager, next, sizes, total, jumper"
            :page-sizes="[10, 20, 30]"
            :page-size="pageSize"
            :total="proveedores.length"
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

  <modal-detalle
    ref="modalDetalle"
  ></modal-detalle>

  <modal-rubro
    ref="modalRubro"
  ></modal-rubro>
</template>

<script>
  import ModalNuevo from './modales/nuevo.vue'
  import ModalModificar from './modales/modificar.vue'
  import ModalEliminar from './modales/eliminar.vue'
  import ModalDetalle from './modales/detalle.vue'
  import ModalRubro from './modales/rubro.vue'

  export default {
    components:{
      ModalNuevo,
      ModalModificar,
      ModalEliminar,
      ModalRubro,
      ModalDetalle
    },
    
    data() {
      return {
        url: 'http://localhost:8000/api/articulo/',
        proveedores: [],
        proveedoresNuevo: [],
        loading: false,
        pageSize: 20,
        currentPage: 1,

        // filtros
        filtroNombre: '',
        filtroCodigo: null,
        filtroCuit: '',
        filtroRubro: '',
        rubrosSelect: [],

      }
    },

    mounted(){
      this.obtenerTodos()
      this.obtenerTodosRubro()
    },

    watch: {
      filtroNombre(val) {
        if(val == ''){
          this.proveedoresNuevo = this.proveedores
        }else{
          this.proveedoresNuevo = this.buscarNombre(val)
        }
      },

      filtroCodigo(val) {
        if(val == null){
          this.proveedoresNuevo = this.proveedores
        }else{
          this.proveedoresNuevo = this.buscarCodigo(val)
        }
      },


      filtroCuit(val) {
        if(val == null){
          this.proveedoresNuevo = this.proveedores
        }else{
          this.proveedoresNuevo = this.buscarCuit(val)
        }
      },

      filtroRubro(val) {
        if(val == ''){
          this.proveedoresNuevo = this.proveedores
        }else{
          this.proveedoresNuevo = this.buscarRubro(val)
        }
      }
    },

    methods: {
      async obtenerTodos(){
        this.loading = true
        await this.axios.get("/api/proveedor/obtenerTodos")
          .then(response =>{
            this.proveedores = this.proveedoresNuevo = response.data;   
            console.log(this.proveedores);
        })    
        this.loading = false    
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
        console.log("entra buscar");
        return this.proveedores.filter(item =>{
          let nombreLower = item.proveedor_nombre.toLowerCase()
          let keywordsLower = keywords.toLowerCase()
          if(nombreLower.includes(keywordsLower)){
            console.log("retorna");
            return item
          }
        })
      },

      buscarCodigo(keywords) {
        return this.proveedores.filter(item =>{
          let codigoString = item.proveedor_codigo.toString()
          let keywordsString = keywords.toString()
          if(codigoString.includes(keywordsString)) {
            return item
          }
        })
      },

      buscarCuit(keywords) {
        return this.proveedores.filter(item =>{
          let codigoString = item.proveedor_cuit.toString()
          let keywordsString = keywords.toString()
          if(codigoString.includes(keywordsString)) {
            return item
          }
        })
      },

      buscarRubro(keywords) {
        return this.proveedores.filter(item =>{
          if(item.rubro_id == keywords){
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