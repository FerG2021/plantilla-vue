<template>
  <div>
    <modal 
      ref="modal" 
      titulo="Nueva presupuestación" 
      :impedir-close="impedirClose"
      width="80%"
    >
      <el-steps
        :active="active"
        finish-status="success"
        simple
        style="margin-top: 5px; margin-bottom: 5px"
      >
        <el-step title="Paso 1"></el-step>
        <el-step title="Paso 2"></el-step>
        <el-step title="Paso 3"></el-step>
        <el-step title="Paso 4"></el-step>
      </el-steps>

      <!-- Paso 1 -->
      <div v-show="active == 0" style="padding: 30px">
        <el-form
          label-width="120px"
        >
          <!-- Nombre -->
          <el-form-item label="Nombre obra" prop="nombreObra">
            <el-select v-model="form.nombreObra" placeholder="Seleccione un plan" style="width: 100%" @change="tomarValorPlan(form.nombreObra)">
              <el-option
                v-for="item in planesSelect"
                :key="item.plan_id"
                :label="item.plan_nombre"
                :value="item.plan_id"
                :disabled="item.disabled"
                style="width: 100%"
                
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="Nombre obra" prop="nombreObra">
            <el-input v-model="form.nombreObra"></el-input>
          </el-form-item> -->

          <!-- Fecha de inicio y de fin -->
          <el-form-item label="Fecha de obra" style="width:100%;" >
            <el-row :gutter="10" style="width:100%;">
              <el-col :span="12" style="width:100%;">
                <el-input 
                  style="width: 100%" 
                  v-model="form.fDesde"
                  disabled
                  placeholder="Fecha de inicio"
                  v-loading="loadingDesdeSelectPlan"
                ></el-input>
              </el-col>
              <el-col :span="12" style="width:100%;">
                <el-input 
                  style="width: 100%" 
                  v-model="form.fHasta"
                  disabled
                  placeholder="Fecha de fin"
                  v-loading="loadingDesdeSelectPlan"
                ></el-input>
              </el-col>
            </el-row>
          </el-form-item>

          <!-- Cantidad de meses -->
          <el-form-item label="Meses totales">
            <el-input 
              style="width: 100%"
              v-model="form.cantMeses"
              disabled
              placeholder="Cantidad de meses"
              v-loading="loadingDesdeSelectPlan"
            ></el-input>
          </el-form-item>

          <!-- Fecha a presupuestar -->
          <el-form-item label="Fecha a presup.">
            <el-date-picker
              v-model="form.fechaaPresupuestar"
              type="monthrange"
              range-separator="a"
              start-placeholder="Mes de inicio"
              end-placeholder="Mes de fin"
              style="width: 100%"
              @change="cantidadMeses()"
              :disabled="deshabilitarSelectFechaaPresupuestar()"
            />
          </el-form-item>

          <!-- Meses a presupuestar -->
          <el-form-item label="Meses a presup.">
            <el-input 
              style="width: 100%"
              v-model="form.mesesaPresupuestar"
              disabled
              placeholder="Cantidad de meses"
            ></el-input>
          </el-form-item>

          <el-form-item label="Rubro a presup.">
            <el-select 
              v-model="filtroRubro" 
              placeholder="Seleccionar por rubro"
              filterable
              clearable
              style="width: 100%"
              @change="limpiarFilaProductoSeleccionado()"
            >
              <el-option
                v-for="item in rubrosSelect"
                :key="item.rubro_id"
                :label="item.rubro_nombre"
                :value="item.rubro_id"
              />
            </el-select>
          </el-form-item>




          <!-- Seleccion de materiales -->
          <!-- <h4 style="margin-top: 10px"><b>Selección de materiales</b></h4>
          
          <el-row 
            :gutter="10" 
            style="margin-top: 10px"
            v-loading="cargando"
          >
            <el-col :span="7">
              <span>Nombre del producto</span>
              <el-select 
                v-model="nombreProducto" 
                placeholder="Seleccione un producto" 
                filterable
                style="width: 100%"
                @change="tomarValor(nombreProducto)"
              >
                <el-option
                  v-for="item in planesSelect"
                  :key="item.plan_id"
                  :label="item.plan_nombre"
                  :value="item.plan_id"
                  style="width: 100%"
                />
              </el-select>
            </el-col>

            <el-col :span="6">
              <span>Unidad medida</span>
              <el-input 
                v-model="unidadMedidaProducto" 
                disabled
                style="width: 100%"
              />
            </el-col> 

            <el-col :span="6">
              <span>Categoría</span>
              <el-input 
                v-model="categoriaProducto" 
                disabled
                style="width: 100%"
              />
            </el-col>   

            <el-col :span="3">
              <span>Cantidad nec.</span>
              <el-input-number 
                v-model="cantidadNecesariaProducto" 
                :controls="false"
                style="width: 100%"
              />
            </el-col> 

            <el-col :span="2">
              <span style="color: white">Cantidad</span>
              <el-button 
                type="primary" 
                style="width: 100%"
                @click="agregarProducto()"
                :disabled="deshabilitarBtnAgregarProductosArrMatUtilizar()"
              >
                +
              </el-button>
            </el-col>            
          </el-row> -->

          <!-- Tabla para mostrar los productos necesarios con sus cantidades -->
          <!-- <div style="margin-top: 10px">
            <el-table :data="arrMaterialesAUsar" stripe style="width: 100%">
              <el-table-column prop="nombre" label="Nombre">
                <template #default="props">
                  <span>{{ props.row.nombre }}</span>
                </template>
              </el-table-column>

              <el-table-column prop="unidadMedida" label="Un. medida">
                   <template #default="props">
                  <span>{{ props.row.unidadMedida }}</span>
                </template>
              </el-table-column>

              <el-table-column prop="categoria" label="Categoria" >
                   <template #default="props">
                  <span>{{ props.row.categoria }}</span>
                </template>
              </el-table-column>

              <el-table-column prop="cantNecesaria" label="Cantidad nec." >
                   <template #default="props">
                  <span>{{ props.row.cantidadNecesaria }}</span>
                </template>
              </el-table-column>

              <el-table-column label="Eliminar" width="120">
                <template #default="scope">
                  <el-button                    
                    type="danger"                    
                    circle 
                    @click="eliminar(scope.$index)"
                  >
                    <span class="material-icons">delete</span>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div> -->


        </el-form>

        <div class="contenedorBtnSiguienteAtras">            
          <el-button  
            type="primary"    
            class="btnSiguiente"
            @click="activar1YRecargar()"
          >
            Siguiente
          </el-button>
        </div>
      </div>

      <!-- Precio y stock -->
      <div v-show="active == 1" style="padding: 30px">
        <!-- mostrar los datos de la seccion anterior -->
        <el-row :gutter="10">
          <el-col :span="6">
            <span>Incio presupuestación</span>
            <el-input
              v-model="mostrarFechaIncioPresupuestacion"
              disabled
            ></el-input>
          </el-col>
          <el-col :span="6">
            <span>Fin presupuestación</span>
            <el-input
              v-model="mostrarFechaFinPresupuestacion"
              disabled
            ></el-input>
          </el-col>
          <el-col :span="6">
            <span>Cantidad de meses</span>
            <el-input
              v-model="mostrarCantidadMesesPresupuestacion"
              disabled
            ></el-input>
          </el-col>
          <el-col :span="6">
            <span>Rubro</span>
            <el-input
              v-model="mostrarRubroPresupuestacion"
              disabled
            ></el-input>
          </el-col>
        </el-row>


        <!-- fila para seleccionar el producto -->
        <el-row :gutter="10" style="margin-top: 15px">
          <el-col :span="10">
            <span>Producto</span>
            <el-select 
              v-model="productoSeleccionado" 
              placeholder="Seleccionar producto"
              filterable
              clearable
              style="width: 100%"
              @change="seleccionarRubroProductoSeleccionado()"
            >
              <el-option
                v-for="item in productosNuevo"
                :key="item.producto_id"
                :label="item.producto_nombre"
                :value="item.producto_id"
              />
            </el-select>
          </el-col>

          <el-col :span="6">
            <span>Rubro</span>
            <el-input
              v-model="rubroProductoSeleccionado"
              disabled
              style="width: 100%"
            ></el-input>
          </el-col>

          <el-col :span="2">
            <span>Unidad</span>
            <el-input
              v-model="unidadProductoSeleccionado"
              disabled
              style="width: 100%"
            ></el-input>
          </el-col>

          <el-col :span="4">
            <span>Cantidad a comprar</span>
            <el-input-number
              v-model="cantidadAComprarProductoSeleccionado"
              :controls="false"
              style="width: 100%"
            ></el-input-number>
          </el-col>

          <el-col :span="2">
            <span style="color: white">btn</span>
            <el-button
              type="primary"
              style="width: 100%"  
              @click="agregarProductoAComprar()"   
            >
              +
            </el-button>
          </el-col>
        </el-row>

        <!-- tabla para mostrar los productos a comprar -->
        <el-table :data="arrayProductosAComprar" stripe style="width: 100%">
          <el-table-column prop="nombre" label="Nombre">
            <template #default="props">
              <span>{{ props.row.producto_nombre }}</span>
            </template>
          </el-table-column>
         
          <el-table-column prop="codigo" label="Código">
            <template #default="props">
              <span>{{ props.row.producto_codigo }}</span>
            </template>
          </el-table-column>
         
          <el-table-column prop="unidad" label="Unidad">
            <template #default="props">
              <span>{{ props.row.producto_unidad }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="rubro" label="Rubro">
            <template #default="props">
              <span>{{ props.row.rubro_nombre }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="cantidad" label="Cant. a comprar">
            <template #default="props">
              <span>{{ props.row.cantidadAComprar }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="cantidadDeposito" label="Cant. depósito">
            <template #default="scope">
              <el-input-number 
                v-model="scope.row.cantidadDeposito" 
                :max="scope.row.cantidadAComprar"
                :controls="false" 
                align="center" 
                text-align="center"
                style="width: 100%"
              />
              
            </template>
          </el-table-column>

          <el-table-column prop="cantidadDeposito" label="">
            <template #default="props">
              <el-button
                type="primary"
                style="width: 10%; margin-bottom: 3px; margin-left: 3px"
                @click="$refs.modalBuscarProductoDeposito.abrir(props.row.producto_id)"
              >
                <span class="material-icons">search</span>
              </el-button>

            </template>
          </el-table-column>


          
          <el-table-column prop="cantidadReal" label="Cant. real a comprar">
            <template #default="scope">
              <el-input-number 
                v-model="scope.row.cantidadRealAComprar" 
                :max="scope.row.cantidadAComprar"
                :controls="false" 
                align="center" 
                text-align="center"
                style="width: 100%"
              />
            </template>
          </el-table-column>

          <el-table-column label="Eliminar" width="120">
            <template #default="scope">
              <el-button                    
                type="danger"                    
                circle 
                @click="eliminarItemArrayProductosAComprar(scope.$index)"
              >
                <span class="material-icons">delete</span>
              </el-button>
            </template>
          </el-table-column>
        
        </el-table>


        <div class="contenedorBtnSiguienteAtras">
          <el-button  
            type="info"    
            class="btnAtras"
            @click="active = 0"
          >
            Atrás
          </el-button>

          <el-button  
            type="primary"    
            class="btnSiguiente"
            @click="active = 2"

          >
            Siguiente
          </el-button>
        </div>
      </div>

      <!-- Fraccionable -->
      <div v-show="active == 2" style="padding: 30px">


          <div class="contenedorBtnSiguienteAtras">
            <el-button  
              type="info"    
              class="btnAtras"
              @click="active = 1"
            >
              Atrás
            </el-button>
            <el-button  
              type="primary"    
              class="btnSiguiente"
              @click="active = 3"

            >
              Siguiente
            </el-button>
          </div>
      </div>

      <!-- Promocion -->
      <div v-show="active == 3" style="padding: 30px">


          <div class="contenedorBtnSiguienteAtras">
            <el-button  
              type="info"    
              class="btnAtras"
              @click="active = 2"
            >
              Atrás
            </el-button>
            <el-button  
              type="primary"    
              class="btnSiguiente"
              @click="active = 4"

            >
              Guardar
            </el-button>
          </div>
      </div>
    </modal>
  </div>

  <modal-buscar-producto-deposito
    ref="modalBuscarProductoDeposito"
  ></modal-buscar-producto-deposito>
</template>

<script>
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { createElementVNode } from '@vue/runtime-core'
  import ModalBuscarProductoDeposito from './buscarProductoDeposito.vue'

  name:'nuevoProducto'
  export default {
    components: {
      ModalBuscarProductoDeposito
    },
    data() {
      return {
        form:{
          nombreObra: null,
          montoObra: null,
          fechaObra: null,
          producto: null,
          fDesde: null,
          fHasta: null,
          cantMeses: null,
          fechaaPresupuestar: [],
          mesesaPresupuestar: null,
          rubroaPresupuestar: null,
        },

        cargando: false,
        loadingDesdeSelectPlan: false,
        rubrosSelect: [],
        active: 0,

        // valores para tomar los datos del plan
        planesSelect: [],
        datosPlanSeleccionado: [],
        arrayMeses: [],


        // PASO 2
        mostrarFechaIncioPresupuestacion: null,
        mostrarFechaFinPresupuestacion: null,
        mostrarCantidadMesesPresupuestacion: null,
        mostrarRubroPresupuestacion: null,
        filtroRubro: '',
        productos: [],
        productosNuevo: [],

          // fila para seleccionar el producto y agregarlo a la lista
          productoSeleccionado: null,
          rubroProductoSeleccionado: null,
          unidadProductoSeleccionado: null,
          cantidadAComprarProductoSeleccionado: null,

          // array para guardar los productos a comprar
          arrayProductosAComprar: [],
        


      }
    },

    created() {
      this.obtenerPlanesSelect()
      this.obtenerRubrosSelect()
      this.obtenerProductosSelect()
    },

    watch: {
      filtroRubro(val) {
        if(val == ''){
          this.productosNuevo = this.productos
        }else{
          this.productosNuevo = this.buscarRubro(val)
        }
      },
      
    },


    methods:{
      abrir(){      
        // formulario
        this.form.nombreObra = null
        this.form.montoObra = null
        this.form.fechaObra = null
        this.form.producto = null
        this.form.fDesde = null
        this.form.fHasta = null
        this.form.cantMeses = null
        this.form.fechaaPresupuestar = []
        this.form.mesesaPresupuestar = null
        this.form.rubroaPresupuestar = null

        this.cargando = false
        this.loadingDesdeSelectPlan = false
        // this.rubrosSelect = []
        this.active = 0

        // valores para tomar los datos del plan
        this.planesSelect = []
        this.datosPlanSeleccionado = []
        this.arrayMeses = []


        // PASO 2
        this.mostrarFechaIncioPresupuestacion = null
        this.mostrarFechaFinPresupuestacion = null
        this.mostrarCantidadMesesPresupuestacion = null
        this.mostrarRubroPresupuestacion = null
        this.filtroRubro = ''
        // this.productos = []
        // this.productosNuevo = []

          // fila para seleccionar el producto y agregarlo a la lista
          this.productoSeleccionado = null
          this.rubroProductoSeleccionado = null
          this.unidadProductoSeleccionado = null
          this.cantidadAComprarProductoSeleccionado = null

          // array para guardar los productos a comprar
          this.arrayProductosAComprar = []

        this.$refs.modal.abrir()
        this.obtenerPlanesSelect()
      },

      cerrar(){
        this.$refs.modal.cerrar()
      },

      activar1YRecargar(){
        this.active = 1
        console.log("recargar");
      },

      buscarRubro(keywords) {
        return this.productos.filter(item =>{
          if(item.rubro_id == keywords){
            return item
          }
        })
      },

      async obtenerPlanesSelect(){
        this.cargando = true
        await this.axios.get("/api/plan/obtenerTodosSelect")
          .then(response => {
            this.planesSelect = response.data
            console.log(this.planesSelect)
          })
        this.cargando = false        
      },

      async obtenerRubrosSelect(){
        await this.axios.get("/api/rubro/obtenerTodosSelect").then((response) => {
          this.rubrosSelect = response.data;          
        });
      },

      async obtenerProductosSelect(){
        await this.axios.get("/api/producto/obtenerTodos").then((response) => {
          this.productos = this.productosNuevo = response.data.datos;          
        });
      },

      async tomarValorPlan(id){
        this.loadingDesdeSelectPlan = true
         await this.axios.get("/api/plan/obtenerDatos/" + id)
          .then(response => {
            this.datosPlanSeleccionado = response.data
            this.form.fDesde = this.datosPlanSeleccionado.plan_fdesde
            this.form.fHasta = this.datosPlanSeleccionado.plan_fhasta
            this.form.cantMeses = this.datosPlanSeleccionado.plan_plazo

            let fecha = new Date(2021, 8, 28)

            for (let index = 0; index < this.form.cantMeses; index++) {
              let fila = {
                // nombre: new Date(fecha.setMonth(fecha.getMonth() + 1))
                nombre: fecha
              }
              this.arrayMeses.push(fila)
              fecha = new Date(fecha.setMonth(fecha.getMonth() + 1))

            }

            console.log(this.datosPlanSeleccionado)
          })       

          this.loadingDesdeSelectPlan = false

      },

      tomarValor(id){
        this.planesSelect.forEach((elemento) =>{
          if (elemento.id == id) {
            console.log(elemento)
            this.idProducto = elemento.id
            this.nombreProducto = elemento.descripcion
            this.unidadMedidaProducto = elemento.unidadMedida.nombre
            this.categoriaProducto = elemento.categoria.nombre
          }
        })
      },

      deshabilitarSelectFechaaPresupuestar(){
        if (this.form.nombreObra == null) {
          return true
        } else {
          return false
        }
      },

      seleccionarRubroPresupuestar(){
        this.rubrosSelect.forEach((elemento) => {
          // console.log(this.rubrosSelect);
          // console.log(this.form.rubroaPresupuestar);
          if (elemento.rubro_id == this.filtroRubro) {
            this.mostrarRubroPresupuestacion = elemento.rubro_nombre
          }
        })
      },

      cantidadMeses(){
        // console.log(this.form.mesesaPresupuestar[0].getMonth()+1);
        // console.log(this.form.mesesaPresupuestar[1].getMonth()+1);
        // console.log(this.form.mesesaPresupuestar[0].getMonth()+1);
        // console.log("----");
        // console.log(this.form.mesesaPresupuestar[0].getDate());
        // console.log(this.form.mesesaPresupuestar[0].getMonth()+1);
        // console.log(this.form.mesesaPresupuestar[0].getFullYear());
        // console.log("----");
        // console.log(this.form.mesesaPresupuestar[1].getDate());
        // console.log(this.form.mesesaPresupuestar[1].getMonth()+1);
        // console.log(this.form.mesesaPresupuestar[1].getFullYear());

        // console.log(this.form.mesesaPresupuestar[1].getMonth() - this.form.mesesaPresupuestar[0].getMonth());

        let meses = this.form.fechaaPresupuestar[1].getMonth() - this.form.fechaaPresupuestar[0].getMonth() + (12 * (this.form.fechaaPresupuestar[1].getFullYear() - this.form.fechaaPresupuestar[0].getFullYear()))

        this.form.mesesaPresupuestar = meses

        
        // declaro los valores para mostrar en el paso 2
        let mostrarFechaIncio = this.form.fechaaPresupuestar[0].getDate() + "/" + this.form.fechaaPresupuestar[0].getMonth() + "/" + this.form.fechaaPresupuestar[0].getFullYear();

        let mostrarFechaFin = this.form.fechaaPresupuestar[1].getDate() + "/" + this.form.fechaaPresupuestar[1].getMonth() + "/" + this.form.fechaaPresupuestar[1].getFullYear();

        this.mostrarFechaIncioPresupuestacion = mostrarFechaIncio
        this.mostrarFechaFinPresupuestacion = mostrarFechaFin
        this.mostrarCantidadMesesPresupuestacion = meses
      },

      limpiarFilaProductoSeleccionado(){
        this.productoSeleccionado = null
        this.rubroProductoSeleccionado = null
        this.unidadProductoSeleccionado = null
        this.cantidadAComprarProductoSeleccionado = null

        this.seleccionarRubroPresupuestar()

      },

      seleccionarRubroProductoSeleccionado(){
        this.productosNuevo.forEach((elemento) => {
          if (elemento.producto_id == this.productoSeleccionado) {
            this.rubroProductoSeleccionado = elemento.rubro.rubro_nombre
            this.unidadProductoSeleccionado = elemento.producto_unidad
          }
        })
      },

      agregarProductoAComprar(){
        if (this.rubroProductoSeleccionado == null ||
            this.rubroProductoSeleccionado == "" ||
            this.unidadProductoSeleccionado == null ||
            this.unidadProductoSeleccionado == "" ||
            this.cantidadAComprarProductoSeleccionado == null ||
            this.cantidadAComprarProductoSeleccionado == "" ||
            this.cantidadAComprarProductoSeleccionado == 0
        ) {
          ElMessage({
            message: '¡Se deben completar todos los campos!',
            type: 'error',
          })    
        } else {
          this.productosNuevo.forEach((elemento) => {
            if (elemento.producto_id == this.productoSeleccionado) {
              let fila = {
                producto_auto: elemento.producto_auto,
                producto_id: elemento.producto_id,
                producto_codigo: elemento.producto_codigo,
                producto_nombre: elemento.producto_nombre,
                producto_puc: elemento.producto_puc,
                producto_fpuc: elemento.producto_fpuc,
                producto_unidad: elemento.producto_unidad,
                producto_activo: elemento.producto_activo,
                rubro_id: elemento.rubro_id,
                rubro_nombre: elemento.rubro.rubro_nombre,
                cantidadAComprar: this.cantidadAComprarProductoSeleccionado
              }

              this.arrayProductosAComprar.push(fila)

              // limpio los campos
              this.productoSeleccionado = null
              this.rubroProductoSeleccionado = null
              this.unidadProductoSeleccionado = null
              this.cantidadAComprarProductoSeleccionado = null

              // console.log(this.arrayProductosAComprar);
            }
          })
        }

        
      },

      eliminarItemArrayProductosAComprar(index){
        this.arrayProductosAComprar.splice(index, 1);
      }

    }
  }
</script>

<style scoped>
  .contenedorBtnSiguienteAtras {
    display: flex;
    width: 100%;
    margin-top: 10px;
  }

  .btnSiguiente {
    margin: auto;
    margin-right: 10px;
  }

</style>