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
        <el-step title="Obra"></el-step>
        <el-step title="Materiales"></el-step>
        <el-step title="Proveedores"></el-step>
        <el-step title="Resumen"></el-step>
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
          <!-- {{form.nombreObra}} -->
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
            :disabled="deshabilitarBtnSiguientePaso1()"
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
            <span>Inicio presupuestación</span>
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
              v-loading="loadingCantidadAComprar"
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

          <el-table-column prop="cantidad" label="Cant. a comp.">
            <template #default="props">
              <span>{{ props.row.cantidadAComprar }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="cantidadDeposito" label="Cant. depósito">
            <!-- <template #default="scope">
              <el-input-number 
                v-model="scope.row.cantidadDeposito" 
                :max="scope.row.cantidadAComprar"
                :controls="false" 
                align="center" 
                text-align="center"
                style="width: 100%"
              />
            </template> -->
            <template #default="props">
              <span>{{ props.row.cantidadDeposito }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="cantidadDeposito" label="">
            <template #default="scope">
              <el-button
                type="primary"
                style="width: 10%; margin-bottom: 3px; margin-left: 3px"
                @click="$refs.modalBuscarProductoDeposito.abrir(scope)"
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
        <!-- {{arrayProductosAComprar}} -->
        <!-- {{arrayRubrosAComprar}} -->


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
            @click="activar2yTraerProveedoresxRubro()"

          >
            Siguiente
          </el-button>
        </div>
      </div>

      <!-- Fraccionable -->
      <div v-show="active == 2" style="padding: 30px" v-loading="loadingProveedoresParaMail">

        <div v-for="(item, index) in arrayRubrosAComprar" :key="index">
          <!-- <div><h3><b>{{item.rubro_nombre}}</b></h3></div> -->
          <el-checkbox 
            v-model="item.rubro_elegido"
            @change="cambiarSeleccionSubItemsRubroElegido(item)"
          >
            <h3><b>{{item.rubro_nombre}}</b></h3>
          </el-checkbox>
          
          <div 
            v-for="(item1, index1) in arrayProveedoresMostrar" :key="index1"
          >
            <div 
              v-if="item1.rubro.rubro_id == item.rubro_id" style="margin-bottom: 5px"
            >
              
              <!-- {{item1.proveedor.proveedor_nombre}}  -->
              <el-checkbox 
                v-model="item1.proveedor_elegido" 
                size="large" 
                border
              >
                {{item1.proveedor.proveedor_nombre}} - 
                {{item1.proveedor.proveedor_email}}
              </el-checkbox>
            </div>
          </div>
        </div>

        <!-- {{arrayProveedoresMostrar}} -->

        <!-- <hr>
        <hr>
        <hr> -->

       

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

      <!-- Resumen -->
      <div v-show="active == 3" style="padding: 30px">
        <h1 style="text-align: center; margin: 0px"><u><b>Resumen de presupuestación</b></u></h1>

        <el-row :gutter="10" style="margin-top: 10px">
          <el-col :span="12">
            <h3><b>Productos</b></h3>
            <!-- {{arrayProductosAComprar}} -->


            <div v-for="(item, index) in arrayRubrosAComprar" :key="index">
              <h4 style="margin-top: 10px">
                <b>{{item.rubro_nombre}}</b>
              </h4>

              <div 
                v-for="(item1, index1) in arrayProductosAComprar" :key="index1"
              >
                <ul>
                  <div 
                    v-if="item1.rubro_id == item.rubro_id" style="margin-bottom: 5px"
                  >
                    <li>{{item1.producto_nombre}}</li>
                  </div>
                </ul>
              </div>
            </div>

          </el-col>
          
          <el-col :span="12">
            <h3><b>Proveedores</b></h3>

            <div v-for="(item, index) in arrayRubrosAComprar" :key="index">
              <!-- <div><h3><b>{{item.rubro_nombre}}</b></h3></div> -->
              
                <h4 style="margin-top: 10px">
                  <b>{{item.rubro_nombre}}</b>
                </h4>
              
              <div 
                v-for="(item1, index1) in arrayProveedoresMostrar" :key="index1"
              >
                <ul>
                  <div 
                    v-if="item1.rubro.rubro_id == item.rubro_id" style="margin-bottom: 5px"
                  >
                    
                    <!-- {{item1.proveedor.proveedor_nombre}}  -->
                    <div v-if="item1.proveedor_elegido == true">
                      <li>
                        {{item1.proveedor.proveedor_nombre}} - 
                        {{item1.proveedor.proveedor_email}}
                      </li>
                    </div>
                      
                  </div>
                </ul>
              </div>
            </div>
          </el-col>

        </el-row>


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
    @update:cantidadSacarDeposito="cantidadSacadaDeposito($event)"
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

          // array para guardar los rubros a comprar
          arrayRubrosAComprar: [],
          b: 0,
          arrayRubrosAComprarEnviar: [],

          // array para mandar datos para buscar la cantidad de la prevision del producto
          arrayDatosParaCantidadPresupestacion: [],
          loadingCantidadAComprar: false,

        // PASO 3
        loadingProveedoresParaMail: false,
        arrayProveedoresRecibidos: [],
        arrayProveedoresMostrar: [],
        checked2: null,

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

          // array para guardar los rubros a comprar
          this.arrayRubrosAComprar = []
          this.b = 0
          this.arrayRubrosAComprarEnviar = []

          // array para mandar datos para buscar la cantidad de la prevision del producto
          this.arrayDatosParaCantidadPresupestacion = []

        // PASO 3
        this.arrayProveedoresRecibidos = []
        this.arrayProveedoresMostrar = []
        this.checked2 = null


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

      deshabilitarBtnSiguientePaso1(){
        if (this.form.fechaaPresupuestar.length == 0
        ) {
          return true
        } else {
          return false
        }
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

        let meses = this.form.fechaaPresupuestar[1].getMonth() - this.form.fechaaPresupuestar[0].getMonth() + (12 * (this.form.fechaaPresupuestar[1].getFullYear() - this.form.fechaaPresupuestar[0].getFullYear())) + 1

        this.form.mesesaPresupuestar = meses

        
        // declaro los valores para mostrar en el paso 2
        let mostrarFechaIncio = this.form.fechaaPresupuestar[0].getDate() + "/" + (this.form.fechaaPresupuestar[0].getMonth() + 1) + "/" + this.form.fechaaPresupuestar[0].getFullYear();

        let mostrarFechaFin = this.form.fechaaPresupuestar[1].getDate() + "/" + (this.form.fechaaPresupuestar[1].getMonth() + 1) + "/" + this.form.fechaaPresupuestar[1].getFullYear();

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
        this.arrayDatosParaCantidadPresupestacion = []
        this.productosNuevo.forEach((elemento) => {
          if (elemento.producto_id == this.productoSeleccionado) {
            console.log("datos del producto seleccionado");
            console.log(elemento);
            this.rubroProductoSeleccionado = elemento.rubro.rubro_nombre
            this.unidadProductoSeleccionado = elemento.producto_unidad

            let fila = {
              fechaDesdePresupuestacion: this.form.fechaaPresupuestar[0],
              fechaHastaPresupuestacion: this.form.fechaaPresupuestar[1],
              plan_id: this.form.nombreObra,
              rubro_id: elemento.rubro_id,
              producto_id: elemento.producto_id,
              producto_nombre: elemento.producto_nombre
            }

            console.log("fila");
            console.log(fila);

            this.arrayDatosParaCantidadPresupestacion.push(fila)

            this.buscarCantidadPrevision()

          }
        })

        

        // 
      },

      async buscarCantidadPrevision(){
        this.loadingCantidadAComprar = true

        let params = {
          arrayDatosParaCantidadPresupestacion: JSON.stringify(this.arrayDatosParaCantidadPresupestacion)
        }
        
        await this.axios.post( "/api/prevision/obtenerCantidad", params)
          .then(response => {
            console.log("respuesta");
            console.log(response.data);

            this.cantidadAComprarProductoSeleccionado = response.data.cantidadPresupuestar
          
          })
        
        this.loadingCantidadAComprar = false
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
                cantidadAComprar: this.cantidadAComprarProductoSeleccionado,
                cantidadDeposito: null,
                cantidadRealAComprar: null,
              }

              this.arrayProductosAComprar.push(fila)

              let filaRubro = {
                rubro_id: fila.rubro_id,
                rubro_nombre: fila.rubro_nombre
              }


              // pregunto si el rubro ya esta agregado
              this.b = 0
              let yaExisteElemento = false
              // if (this.arrayRubrosAComprar.length == 0) {
              //   this.arrayRubrosAComprar.push(filaRubro);
              // } else {
                // this.arrayRubrosAComprar.forEach((elemento) => {
                //   if (elemento.rubro_id == fila.rubro_id) {
                //     this.b = 0
                //   } else {
                //     this.b = 1
                //   }
                // })

                yaExisteElemento = this.arrayRubrosAComprar.filter(x => x.rubro_id == filaRubro.rubro_id)
                console.log("yaExisteElemento");
                console.log(yaExisteElemento);


              // }

              if (yaExisteElemento.length == 0) {
                this.arrayRubrosAComprar.push(filaRubro);
              }


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
        this.arrayRubrosAComprar.splice(index, 1);
      },

      cantidadSacadaDeposito(elemento){
        console.log("elemento desde modal" );
        console.log(elemento);

        if (this.arrayProductosAComprar[elemento.indice].cantidadAComprar < elemento.cantidadUsar) {
          ElMessage({
            message: '¡Cantidad extraída de los depositos mayor que la cantidad a presupuestar, por favor seleccione otra cantidad!',
            type: 'error',
          })    
        } else {
          this.arrayProductosAComprar[elemento.indice].cantidadDeposito = elemento.cantidadUsar;

          this.arrayProductosAComprar[elemento.indice].cantidadRealAComprar = this.arrayProductosAComprar[elemento.indice].cantidadAComprar - elemento.cantidadUsar
        }
      },

      // deshabilitarBtnSiguientePaso2(){
      //   this.arrayProductosAComprar.forEach((elemento) => {
      //     if (elemento.cantidadRealAComprar == null) {
      //       return true
      //     } 
      //   })
      // },

      activar2yTraerProveedoresxRubro(){
        this.active = 2
        this.obtenerProveedorxRubro()
      },

      async obtenerProveedorxRubro(){
        this.arrayProveedoresMostrar = []
        console.log("array prov al inicio");
        console.log(this.arrayProveedoresMostrar);
        this.loadingProveedoresParaMail = true

        this.arrayRubrosAComprarEnviar = []

        this.arrayRubrosAComprar.forEach((elemento) => {
          let fila = {
            rubro_id: elemento.rubro_id,
            rubro_nombre: elemento.rubro_nombre,
            rubro_elegido: null,
          }
          this.arrayRubrosAComprarEnviar.push(fila);
        })

        console.log("this.arrayRubrosAComprarEnviar");
        console.log(this.arrayRubrosAComprarEnviar);


        let params = {
          arrRubrosAComprar: JSON.stringify(this.arrayRubrosAComprarEnviar)
        }

        await this.axios.post( "/api/proveedorxrubro/obtenerProveedorxRubro", params)
          .then(response => {
            console.log(response.data);
            this.arrayProveedoresRecibidos = response.data
           
          })

          this.arrayRubrosAComprarEnviar.forEach((elemento) => {
            this.arrayProveedoresRecibidos.forEach((ele) => {
              if (elemento.rubro_id == ele.rubro_id) {
                let fila = {
                  rubro: {
                    rubro_id: elemento.rubro_id,
                    rubro_nombre: elemento.rubro_nombre
                  },
                  proveedor: ele.proveedor,
                  proveedor_elegido: null,
                }

                this.arrayProveedoresMostrar.push(fila);
              }
            })
          })

          console.log("this.arrayProveedoresMostrar");
          console.log(this.arrayProveedoresMostrar);

          this.loadingProveedoresParaMail = false
        
      },

      cambiarSeleccionSubItemsRubroElegido(item){
        console.log(item);

        this.arrayProveedoresMostrar.forEach((elemento) => {
          if (elemento.rubro.rubro_id == item.rubro_id) {
            if (item.rubro_elegido == true) {
              elemento.proveedor_elegido = true
            } else {
              elemento.proveedor_elegido = false
            }
          }
        })
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