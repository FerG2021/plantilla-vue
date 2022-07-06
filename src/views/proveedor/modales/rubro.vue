<template>
  <div>
    <modal 
        ref="modal" 
        titulo="Rubro proveedor" 
        :impedir-close="impedirClose"        
    >      
      <div 
        v-loading="loadingDetallesProv"
        v-if="datosProv != null" 
      >
        <el-descriptions
            title="Detalles del proveedor"
            direction="vertical"
            :column="4"
            :size="size"
            border
        >
            <el-descriptions-item label="Nombre">
              {{datosProv.proveedor_nombre}}
            </el-descriptions-item>

            <el-descriptions-item label="Razón social">
              {{datosProv.proveedor_razonsocial}}
            </el-descriptions-item>

            <el-descriptions-item label="Código">
              {{datosProv.proveedor_codigo}}
            </el-descriptions-item>

            <el-descriptions-item label="CUIT">
              {{datosProv.proveedor_cuit}}
            </el-descriptions-item>

            <!-- <el-descriptions-item label="Email">
              {{datosProv.proveedor_email}}
            </el-descriptions-item>

            <el-descriptions-item label="Activo">
              <span v-if="datosProv.proveedor_activo == 1">
                <el-tag class="ml-2" type="success">SI</el-tag>
              </span>
              <span v-else>
                <el-tag class="ml-2" type="danger">NO</el-tag>
              </span>
            </el-descriptions-item>         -->
        </el-descriptions>

        <!-- Agregar rubros al proveedor -->
        <h4 style="margin-top:10px; margin-bottom: 10px"><b>Rubros asociados al proveedor</b></h4>
        <el-row :gutter="10" >
          <el-col :span="24">
            <el-select 
              v-model="rubroProv" 
              class="m-2" 
              placeholder="Seleccione un rubro" 
              style="width: 100%" 
              v-loading="loadingSelect"
              filterable
              @change="obtenerDatosDesdeSelect()"
            >
              <el-option
                v-for="item in rubroSelect"
                :key="item.rubro_id"
                :label="item.rubro_nombre"
                :value="item.rubro_id"
                style="width: 100%"
              />
            </el-select>
            <!-- {{rubroProv}} -->
          </el-col>

          <!-- <el-col :span="4">
            <el-button
              type="primary"
              style="width: 100%"
              @click="agregarRubroElegido()"
            >
              Agregar
            </el-button>
          </el-col> -->
        </el-row>


        <!-- Tabla para mostrar los rubros seleccionados al proveedor -->
        <el-table :data="rubrosElegidos" stripe style="width: 100%; margin-top: 15px" v-loading="loadingRubrosElegidos">
          <el-table-column prop="nombre" label="Nombre">
            <template #default="props">
              {{props.row.rubro_nombre}}
            </template>
          </el-table-column>
          <el-table-column prop="eliminar" label="Eliminar" width="80px">
            <template #default="scope">
              <el-button
                type="danger"
                circle
                @click="eliminarRubroElegido(scope.$index)"
              >
                <span class="material-icons">delete</span>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-row style="margin-top: 15px">
        <el-col :span="3"></el-col>
        <el-col :span="3"></el-col>
        <el-col :span="3"></el-col>
        <el-col :span="3"></el-col>
        <el-col :span="3"></el-col>
        <el-col :span="3"></el-col>
        <el-col :span="3"></el-col>
        <el-col :span="3">
          <el-button
            type="primary"
            style="width: 100%"
            @click="onSubmit()"
          >
            Guardar
          </el-button>
        </el-col>

      </el-row>
      
    </modal>
  </div>
</template>

<script>
  import { ElMessage, ElMessageBox } from 'element-plus'

  name:'nuevaUnidadMedida'
  export default {
    data() {
      return {
        impedirClose: false,
        id: null,
        rubroSelect: [],
        rubroSeleccionado: null,
        rubrosElegidos: [],
        datosProv: {},
        rubroProv: null,
        loadingSelect: false,
        loadingDetallesProv: true,
        loadingRubrosElegidos: false,
        arrayRubroProveedorEnviar: [],
        datosRecibidos: [],
        form:{
          id: null,
          nombre: null,          
        },    
        
        rules: {
          id: [
            {
              required: true,
              message: "Por favor ingrese el id del rubro.",
              trigger: "change",
            },
          ],

          nombre: [
            {
              required: true,
              message: "Por favor ingrese el nombre del rubro.",
              trigger: "change",
            },
          ],
        },
      }
    },

    created() {
      this.rubroObtenerTodosSelect()

      this.obtenerDatos()
      this.obtenerDatosProveedor()

    },

    methods:{
      abrir(id){
        this.form.id = null
        this.form.nombre = null
        this.datosProv = null
        this.id = id
        this.loadingDetallesProv = false
        // this.rubroSelect = []
        this.rubroSeleccionado = null
        this.rubrosElegidos = []
        this.datosProv = {}
        this.rubroProv = null
        this.arrayRubroProveedorEnviar = []
        this.datosRecibidos = []

        this.$refs.modal.abrir()

      // this.obtenerDatos()
      this.obtenerDatosProveedor()
      },

      cerrar(){
        this.$refs.modal.cerrar()
      },

      async obtenerDatos(){
        this.loadingRubrosElegidos = true
        console.log("entra");
        const respuestaApi =  await this.axios.get("/api/proveedorxrubro/obtenerDatos/" + this.id)

        this.datosRecibidos = respuestaApi.data
        console.log("array datos recibidos");
        console.log(this.datosRecibidos);

        this.datosRecibidos.forEach((elemento) => {
          let fila = {
            rubro_id: elemento.rubro.rubro_id,
            rubro_nombre: elemento.rubro.rubro_nombre
          }
          
          this.rubrosElegidos.push(fila)
        })

        this.loadingRubrosElegidos = false
      },

      async obtenerDatosProveedor(){
        this.loadingDetallesProv = true;
        const respuestaApi =  await this.axios.get("/api/proveedor/obtenerDatos/" + this.id)

        this.datosProv = respuestaApi.data
        console.log(this.datosProv);

        this.loadingDetallesProv = false;

        this.obtenerDatos()
      },

      async rubroObtenerTodosSelect(){
        this.loadingSelect = true
        const respuestaApi = await this.axios.get("/api/rubro/obtenerTodosSelect")

        this.rubroSelect = respuestaApi.data;
        console.log("rubroSelect");
        console.log(this.rubroSelect);

        this.loadingSelect = false
      },

      obtenerDatosDesdeSelect(){
        console.log(this.rubroProv);

        this.rubroSelect.forEach((elemento) => {
          if (elemento.rubro_id == this.rubroProv) {
            this.rubroSeleccionado = elemento
          }
        })

        console.log(this.rubroSeleccionado);

        this.agregarRubroElegido()
      },

      agregarRubroElegido(){
        this.rubrosElegidos.push(this.rubroSeleccionado)
        console.log("array rubros elegidos");
        console.log(this.rubrosElegidos);
        this.rubroProv = null
      },

      eliminarRubroElegido(index){
        this.rubrosElegidos.splice(index, 1);
      },

      async onSubmit(){
        if (this.rubrosElegidos.length != 0) {
          // creo un nuevo array para agregar el id del proveedor
          this.rubrosElegidos.forEach((elemento) => {
            let fila = {
              proveedor_id: this.id,
              rubro_id: elemento.rubro_id
            }

            this.arrayRubroProveedorEnviar.push(fila)
          })

          let params = {
            arrProveedorRubro: JSON.stringify(this.arrayRubroProveedorEnviar)
          }

          await this.axios.post( "/api/proveedorxrubro/crear", params)
            .then(response => {
              ElMessage({
                  type: 'success',
                  message: '¡Relación proveedor rubro exitosa!',
              })
              this.cerrar()
            })
        } else {
          this.cerrar()
        }

      },

      deshabilitarBtnGuardar(){
        if (this.form.id == null ||
            this.form.id == "" ||
            this.form.id == 0 ||
            this.form.nombre == null || 
            this.form.nombre == ""
        ) 
        {
          return true    
        } else {
          return false
        }
      },
    }
  }
</script>

<style>

</style>