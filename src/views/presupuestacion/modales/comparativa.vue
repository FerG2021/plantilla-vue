<template>
  <div>
    <modal
      ref="modal"
      titulo="Comparativa de productos"
      :impedir-close="impedirClose"
      width="99%"
    >
      <div v-loading="loadingTabla">
        <el-scrollbar @setScrollLeft="scrollLeft" :scroll="scroll">
          <div class="scrollbar-flex-content">
            <!-- {{datosAPI}} -->
                
            <!-- :summary-method="getSummaries" -->
            <div id="tabla1">
              <el-table
                :data="arraySoloProductos"
                border
                stripe
                style="width: 100%;"
                show-summary
                @sort-change="sortChange()"
                @cell-click="cellClick"
                ref="tablaComparativa"
                :cell-style="classChecker"
                :header-cell-style="headerStylePrincipalTable"
              >
                <el-table-column
                  label="Productos"
                  align="center"
                  style="background-color: red"
                  fixed
                >
                  <!-- <el-table-column prop="date" label="ID" align="center" fixed>
                    <template #default="props">
                      {{ props.row.producto_id }}
                    </template>
                  </el-table-column> -->

                  <el-table-column 
                    prop="date" 
                    label="Nombre" 
                    align="center"
                    fixed
                  >
                    <template #default="props">
                      {{ props.row.producto_nombre }}
                    </template>
                  </el-table-column>

                  <el-table-column
                    prop="date"
                    label="Cant. a comprar"
                    align="center"
                    fixed
                  >
                    <template #default="props">
                      <!-- {{props.row.cantidad_a_comprar}} -->
                      <el-input-number
                        v-model="props.row.cantidad_a_comprar"
                        style="width: 100%"
                        :controls="false"
                        @change="cambiarCantidad(props)"
                      ></el-input-number>
                    </template>
                  </el-table-column>
                </el-table-column>

                <el-table-column label="Proveedores" align="center">
                  <el-table-column
                    v-for="(item, index) in datosAPI"
                    :key="index"
                    :label="item.proveedor_nombre"
                    align="center"
                    :column-key="item.proveedor_id"
                    :cell-style="colorColumnas(index)"
                  > 
                  <template #header>
                    <el-checkbox 
                      v-model="item.proveedorSeleccionado" 
                      :label="item.proveedor_nombre" 
                      size="large" 
                      @change="cambiarProveedorSeleccionado(item)"
                    />
                    <el-button
                      type="primary"
                      size="small"
                      circle
                      style="margin-left: 5px"
                      @click="$refs.modalCargaPorProveedorMostrar.abrir(item.proveedor_id, item.presupuestacion_id)"
                    >
                      <!-- <span class="material-icons">info</span> -->
                      i
                    </el-button>
                  </template>

                    <!-- Factor -->
                    <el-table-column 
                      label="Factor" 
                      align="center"
                      prop="factor"
                      width="75px"
                    >
                      <template #default="scope" >
                        <el-input-number
                          v-model="item.productos[scope.$index].factor"
                          :controls="false"
                          style="width: 100%"
                          @change="cambiarCantidadFactor(item.productos[scope.$index], scope)"
                        ></el-input-number>
                      </template>
                    </el-table-column>

                    <!-- Cantidad proveedor -->
                    <el-table-column 
                      label="Cant" 
                      align="center"
                      prop="cantProv"
                      width="60px"
                    >
                      <template #default="scope" >
                        {{parseFloat(item.productos[scope.$index].cantidad_proveedor)}}
                      </template>
                    </el-table-column>    
                    
                    <!-- PNG -->
                    <el-table-column 
                      label="PNG" 
                      align="center"
                      prop="png"
                      width="55px"
                    >
                      <template #default="scope" >
                        {{parseFloat(item.productos[scope.$index].precio_png)}}
                      </template>
                    </el-table-column>

                    <!-- IVA -->
                    <el-table-column 
                      label="IVA" 
                      align="center"
                      prop="iva"
                      width="55px"
                    >
                      <template #default="scope" >
                        {{parseFloat(item.productos[scope.$index].iva)}}
                      </template>
                    </el-table-column>

                    <!-- PU -->
                    <el-table-column 
                      label="PU" 
                      align="center"
                      prop="pu"
                      width="65px"
                    >
                      <template #default="scope" >
                        {{parseFloat(item.productos[scope.$index].precio_pu)}}
                      </template>
                    </el-table-column>
                    
                    <!-- PP -->
                    <el-table-column 
                      label="PP" 
                      align="center"
                      @select="seleccionar(param)"
                      style="background-color: red;"
                      prop="pp"
                      width="90px"
                      size="small"
                    >
                      <template #default="scope" >
                        <el-checkbox 
                          v-model="item.productos[scope.$index].productoSeleccionado" 
                          :label="parseFloat(item.productos[scope.$index].precio_pp)" 
                          size="small" 
                          @change="cambiarSeleccionProductoSegmentado(scope, item.productos[scope.$index])"
                          style="color: black"
                        />
                      </template>
                    </el-table-column>


                  </el-table-column>
                </el-table-column>
              </el-table>
            </div>

            <!-- muestro la informacion de los proveedores -->
            <!-- {{arrayInfoProveedores}} -->
            <el-table
              stripe
              :data="arrayTotal"
              :cell-style="classChecker"
              :header-cell-style="headerStyle"
              id="tabla2"
            >
              <el-table-column></el-table-column>
              <el-table-column></el-table-column>
              <el-table-column v-for="(item, index) in arrayInfoProveedores" :key="index" align="center">
                <!-- <template #default="scope"> -->
                <el-table-column width="75px" label="F.P." align="center">
                  {{item.proveedor_forma_de_pago}}
                </el-table-column>
                <el-table-column width="60px" label="Fact. A" align="center">
                  <span v-if="item.proveedor_factura_A == 0">
                    No
                  </span>

                  <span v-if="item.proveedor_factura_A == 1">
                    Si
                  </span>
                  <!-- {{item.proveedor_factura_A}} -->
                </el-table-column>
                <el-table-column width="55px" label="Monto" align="center">
                  {{item.proveedor_monto_factura_A}}
                </el-table-column>
                <el-table-column width="55px" label="Flete" align="center">
                  {{item.proveedor_monto_flete}}
                </el-table-column>
                <el-table-column width="65px" label="DyB" align="center">
                  {{item.proveedor_monto_descuentos_bonificaciones}}
                </el-table-column>
                <el-table-column width="90px" label="Total" align="center">
                  <!-- {{item.proveedor_monto_totalPP}} -->
                  {{item.proveedor_monto_total_homogeneo}}
                </el-table-column>
                <!-- </template> -->
              </el-table-column>
            </el-table>

            
            
            <!-- muestro el total -->
            <el-table 
              :data="arrayTotal"
              style="margin-top: 15px"
            >
              <!-- <el-table-column label=""></el-table-column> -->
              <el-table-column label="Total homog." align="center">
                <template #default="props">
                  {{props.row.totalHomogeneo}}
                </template>
              </el-table-column>
              <el-table-column label=""></el-table-column>
              <el-table-column v-for="(item, index) in arrayPrecioPPProveedores" :key="index" :label="item.titulo" align="center">
                <!-- <template #default="scope"> -->
                  {{item.totalPP}}
                <!-- </template> -->
              </el-table-column>

            </el-table>
          </div>
        </el-scrollbar>

        <!-- {{arrayPrecioPPProveedores}} -->
      </div>
    </modal>
  </div>

  <modal-carga-por-proveedor-mostrar
    ref="modalCargaPorProveedorMostrar"
  ></modal-carga-por-proveedor-mostrar>


</template>

<script>
import { ElMessage, ElMessageBox } from "element-plus";
import modalCargaPorProveedorMostrar from './cargaPorProveedorMostrar.vue'


name: "nuevoProducto";
export default {
  components: {
    modalCargaPorProveedorMostrar
  },
  data() {
    return {
      id: null,
      datosAPI: [],
      arraySoloProductos: [],
      arrAux: [],
      mostrarTabla: false,
      loadingTabla: false,
      arrayTodosProductos: [],
      arrayProductos: [],
      longitudProveedores: null,
      totalHomogeneo: 0,
      arrayTotal: [],
      arrayPrecioPPProveedores: [],
      arrayInfoProveedores: [],
    };
  },

  methods: {
    abrir(id) {
      this.id = null;
      this.id = id;
      console.log("id que mando");
      console.log(this.id);

      this.datosAPI = [];
      this.arraySoloProductos = [];
      this.arrAux = [];
      this.arrayTodosProductos = []
      this.arrayProductos = []
      this.longitudProveedores = null;

      this.mostrarTabla = false;
      this.loadingTabla = true;
      this.totalHomogeneo = 0
      this.arrayPrecioPPProveedores = []
      this.arrayInfoProveedores = []


      this.$refs.modal.abrir();


      let t1 = document.querySelector('#tabla1');
      console.log("t1");
      console.log(t1);

      // let t2 = document.querySelector('#tabla2');

      // t1.addEventListener('scroll', () => {
      //   t2.scrollLeft = box1.scrollLeft;
      // });

      // limpio los campos
      this.getDatos();
    },

    cerrar() {
      this.$refs.modal.cerrar();
    },

    async getDatos() {
      await this.axios
        .get("/api/presupuestacionproductosproveedor/obtenerTodos/" + this.id)
        .then((response) => {

          this.arrAux = response.data;

          this.arrAux.forEach((elemento) => {
            let fila = {
              presupuestacion_id: elemento.presupuestacion_id ,
              presupuestacion_plan_id: elemento.presupuestacion_plan_id ,
              presupuestacion_proveedor_id: elemento.presupuestacion_proveedor_id ,
              // productos: elemento.productos , 
              proveedor_factura_A: elemento.proveedor_factura_A ,
              proveedor_forma_de_pago: elemento.proveedor_forma_de_pago ,
              proveedor_id: elemento.proveedor_id ,
              proveedor_mail: elemento.proveedor_mail , 
              proveedor_monto_descuentos_bonificaciones: elemento.proveedor_monto_descuentos_bonificaciones , 
              proveedor_monto_flete: elemento.proveedor_monto_flete , 
              proveedor_monto_totalPP: Number(elemento.proveedor_monto_totalPP) , 
              proveedor_monto_total_homogeneo: elemento.proveedor_monto_total_homogeneo , 
              proveedor_nombre: elemento.proveedor_nombre , 
              proveedor_rubro_id: elemento.proveedor_rubro_id , 
              proveedorSeleccionado: false,
            }

            let auxProd = [];

            elemento.productos.forEach((ele) => {
              let filaProd = {
                created_at: ele.created_at ,
                iva: ele.iva ,
                precio_png: ele.precio_png ,
                precio_pp: Number(ele.precio_pp) ,
                precio_pu: ele.precio_pu ,
                presupuestacion_id: ele.presupuestacion_id ,
                presupuestacion_plan_id: ele.presupuestacion_plan_id ,
                presupuestacion_producto_id: ele.presupuestacion_producto_id ,
                presupuestacion_productos_proveedores_id: ele.presupuestacion_productos_proveedores_id ,
                presupuestacion_rubro_id: ele.presupuestacion_rubro_id ,
                presupuestacion_rubro_nombre: ele.presupuestacion_rubro_nombre ,
                producto_cantidad_a_comprar: ele.producto_cantidad_a_comprar ,
                producto_id: ele.producto_id ,
                producto_nombre: ele.producto_nombre ,
                proveedor_id: ele.proveedor_id ,
                proveedor_mail: ele.proveedor_mail ,
                proveedor_nombre: ele.proveedor_nombre ,
                updated_at: ele.updated_at ,
                productoSeleccionado: false,
                factor: ele.factor,
                cantidad_proveedor: ele.cantidad_proveedor
              }

              auxProd.push(filaProd)
            })

            fila.productos = auxProd
            
            this.datosAPI.push(fila)
            
          })
          
          this.mostrarTabla = true

          // this.datosAPI = response.data;
          console.log("this.datosAPI");
          console.log(this.datosAPI);

          this.longitudProveedores = this.datosAPI.length
          console.log("this.longitudProveedores");
          console.log(this.longitudProveedores);

          this.datosAPI.forEach((elemento) => {
            let fila1 = {}
            this.arrayPrecioPPProveedores.push(fila1)
            this.arrayPrecioPPProveedores.push(fila1)
            this.arrayPrecioPPProveedores.push(fila1)
            this.arrayPrecioPPProveedores.push(fila1)



            let fila = {
              presupuestacion_id: elemento.presupuestacion_id ,
              presupuestacion_plan_id: elemento.presupuestacion_plan_id ,
              proveedor_id: elemento.proveedor_id ,
              proveedor_nombre: elemento.proveedor_nombre ,
              proveedor_rubro_id: elemento.proveedor_rubro_id ,
              titulo: "Total x prov.",
              totalPP: 0 ,
            }

            this.arrayPrecioPPProveedores.push(fila)
          })


          console.log("this.arrayPrecioPPProveedores");
          console.log(this.arrayPrecioPPProveedores);

          
        });

      this.crearArraySoloProductos();
      this.calcularTotalHomogeneo();
      this.getDatosProveedores();
    },

    crearArraySoloProductos() {
      this.datosAPI[0].productos.forEach((elemento) => {
        // console.log(elemento);

        let fila = {
          producto_id: elemento.producto_id,
          producto_nombre: elemento.producto_nombre,
          producto_rubro_id: elemento.presupuestacion_rubro_id,
          producto_rubro: elemento.presupuestacion_rubro_nombre,
          cantidad_a_comprar: elemento.producto_cantidad_a_comprar,
        };

        this.arraySoloProductos.push(fila);
      });

      // let fila1 = {}
      // this.arraySoloProductos.push(fila1)

      // console.log("this.arraySoloProductos");
      // console.log(this.arraySoloProductos);

      this.loadingTabla = false;

      this.crearArrayTodosProductos();

    },

    crearArrayTodosProductos(){
      this.datosAPI.forEach((elemento) => {
        // console.log("elemento todos los productos");
        // console.log(elemento.productos);
        this.arrayTodosProductos.push(elemento.productos)
      })

      console.log("this.arraySoloProductos");
      console.log(this.arraySoloProductos);

      console.log("this.arrayTodosProductos");
      console.log(this.arrayTodosProductos);


      this.arrayTodosProductos.forEach((elemento) => {
        // console.log("elemento array");
        // console.log(elemento);
        elemento.forEach((ele) => {
          // console.log("ele array");
          // console.log(ele);
          this.arrayProductos.push(ele)
        })
      })

      console.log("this.arrayProductos");
      console.log(this.arrayProductos);

      let yaExisteElemento;

      this.arraySoloProductos.forEach((elemento) => {
        yaExisteElemento = this.arrayProductos.filter(
          (x) => x.producto_id == elemento.producto_id
        );
        // console.log("yaExisteElemento");
        // console.log(yaExisteElemento);

        let min = yaExisteElemento[0].precio_pp
        let producto;

        // console.log("min");
        // console.log(min);

        
        yaExisteElemento.forEach((ele) => {
          // console.log("ele");
          // console.log(ele);

          if (ele.precio_pp <= min) {
            min = ele.precio_pp
            producto = ele
          }
        })

        // console.log("producto");
        // console.log(producto);

        this.datosAPI.forEach((elemento) => {
          elemento.productos.forEach((ele) => {
            // console.log("ele para datos API");
            // console.log(ele);

            if (ele.producto_id == producto.producto_id && ele.proveedor_id == producto.proveedor_id) {
              ele.productoSeleccionado = true
            }
          })
        })
      })
      


      
    },

    cambiarCantidad(props){
      console.log("props");
      console.log(props);

      console.log("this.datosAPI");
      console.log(this.datosAPI);

      this.datosAPI.forEach((elemento) => {
        elemento.productos.forEach((ele) => {
          if (props.row.producto_id == ele.producto_id) {
            console.log("ele");
            console.log(ele);

            ele.cantidad_proveedor = props.row.cantidad_a_comprar * ele.factor
            let precio = ele.cantidad_proveedor * ele.precio_pu
            ele.precio_pp = precio.toFixed(2)
          }
        })     
      })

      this.actualizarPrecioTotal()
    },

    actualizarPrecioTotal(){
      // console.log("props");
      // console.log(props);


      console.log("llamando a precio total");
      console.log("this.datosAPI");
      console.log(this.datosAPI);

      console.log("this.arrayInfoProveedores");
      console.log(this.arrayInfoProveedores);


      this.datosAPI.forEach((elemento) => {
        let ppParcial = 0
        let proveedor_id = null
        elemento.productos.forEach((ele) => {
          let precioPPParcial = Number(ele.precio_pp)
          let cantidad = Number(ele.cantidad_proveedor)
          let numero = precioPPParcial
          console.log("ele.precio_pp");
          console.log(ele.precio_pp);
          console.log("ppParcial antes de sunar");
          console.log(ppParcial);
          ppParcial = ppParcial + numero
          console.log("ppParcial despues de sunar");
          console.log(ppParcial);
          proveedor_id = ele
        })

        console.log("ppParcial");
        console.log(ppParcial);

        console.log("proveedor@@@@@");
        console.log(proveedor_id);
        
        this.arrayInfoProveedores.forEach((elemento1) => {
          if (elemento1.proveedor_id == elemento.proveedor_id) {

            console.log("ppParcial");
            console.log(ppParcial);

            console.log("proveedor_id");
            console.log(proveedor_id);

            console.log("elemento1");
            console.log(elemento1);

            let parcial = 0
            parcial = ppParcial + Number(elemento1.proveedor_monto_descuentos_bonificaciones) + Number(elemento1.proveedor_monto_factura_A) + Number(elemento1.proveedor_monto_flete )+ Number(elemento1.proveedor_monto_descuentos_bonificaciones)

            elemento1.proveedor_monto_total_homogeneo = Number(parcial).toFixed(2)
            console.log( "elemento1.proveedor_monto_total_homogeneo");
            console.log( elemento1.proveedor_monto_total_homogeneo);

          }
        })

      })


    },

    cambiarCantidadFactor(item, scope){
      console.log("item cantidad factor");
      console.log(item);

      console.log("scope.row");
      console.log(scope.row);

      item.cantidad_proveedor = scope.row.cantidad_a_comprar * item.factor

      this.actualizarPrecioTotal()
    },

    agregar(scope, item, precio, index) {
      console.log("scope");
      console.log(scope);

      console.log("item");
      console.log(item);

      console.log("precio");
      console.log(precio);

      console.log("index");
      console.log(index);
    },

    mostrarLabel(prov) {
      return prov;
    },

    

    sortChange(sortProps){
      this.headerClick(sortProps.column,event) //optional: trigger header-click event
    },

    headerClick(param){
      console.log(param)

      // console.log("nombre");
      // console.log(param.label);
      
      let estadoProveedor = false
      let estadoOtrosProveedores = false
      let indexSeleccionado
      this.datosAPI.forEach((elemento, index) => {
        
        if (param.label == elemento.proveedor_nombre) {
          console.log(elemento);
          indexSeleccionado = index
          // pregunto si el proveedor tiene estado de seleccionado o no
          if (elemento.proveedorSeleccionado == true) {
            elemento.proveedorSeleccionado = false
            estadoProveedor = false
          } else {
            elemento.proveedorSeleccionado = true
            estadoProveedor = true
          }

          // a cada uno de sus productos los pongo en el mismo estado del proveedor
          elemento.productos.forEach((ele) => {
            if (ele.productoSeleccionado == false) {
              ele.productoSeleccionado = estadoProveedor              
            } else {
              ele.productoSeleccionado = estadoProveedor    
            }
          })
        } else {
          // pongo a los otros proveedores en falso
          elemento.proveedorSeleccionado = false

          // pongo a cada uno de los productos del resto de los proveedores en falso
          elemento.productos.forEach((ele) => {
            ele.productoSeleccionado = false
          })

        }
        console.log("indexSeleccionado");
        console.log(indexSeleccionado);
      })
    },

    

    cambiarProveedorSeleccionado(item){
      console.log("this.datosAPI");
      console.log(this.datosAPI);

      console.log("item");
      console.log(item);


      
      let estadoProveedor = false
      let estadoOtrosProveedores = false
      let indexSeleccionado

      this.datosAPI.forEach((elemento, index) => {
        if (item.proveedor_id == elemento.proveedor_id) {
          if (item.proveedorSeleccionado == true) {
            elemento.proveedorSeleccionado = true

            elemento.productos.forEach((ele) => {
              ele.productoSeleccionado = true
            })
          } else {
            elemento.proveedorSeleccionado = false

            elemento.productos.forEach((ele) => {
              ele.productoSeleccionado = false
            })
          }
        } else {
          if (item.proveedorSeleccionado == true) {
            elemento.proveedorSeleccionado = false
            elemento.productos.forEach((ele) => {
              ele.productoSeleccionado = false
            })
          }
        }
      })

      this.calcularTotalHomogeneo()
    },

    calcularTotalHomogeneo(){
      this.totalHomogeneo = 0

      this.datosAPI.forEach((elemento) => {
        elemento.productos.forEach((ele) => {
          if (ele.productoSeleccionado == true) {
            this.totalHomogeneo = this.totalHomogeneo + ele.precio_pp
          }
        })
      })

      this.arrayTotal = []

      let fila = {
        aux: null,
        totalHomogeneo: Number(this.totalHomogeneo).toFixed(2),
        aux2: null
      }

      this.arrayTotal.push(fila)

      this.calcularPrecioPPProveedores()
    },

    calcularPrecioPPProveedores(){
      let precioPPParcial = 0
      this.datosAPI.forEach((elemento) => {
        elemento.productos.forEach((ele) => {
          if (ele.productoSeleccionado == true) {
            precioPPParcial = precioPPParcial + ele.precio_pp
          }
        })

        this.arrayPrecioPPProveedores.forEach((elementoArrayProv) => {
          if (elementoArrayProv.proveedor_id == elemento.proveedor_id) {
            elementoArrayProv.totalPP = precioPPParcial.toFixed(2)
          }
        })

        precioPPParcial = 0
      })
    },

    // traigo los datos de cada uno de los proveedores para mostrar la informacion de la factura, la forma de pago, etc
    async getDatosProveedores(){
      await this.axios
        .get("/api/presupuestacionproductosproveedor/obtenerTodosProveedores/" + this.id)
        .then((response) => {
          const respuestaApi = response;
          // console.log("respuestaApi de getDatos");
          // console.log(respuestaApi.data);

          if (respuestaApi != null) {
            this.arrayInfoProveedores = respuestaApi.data
            console.log("this.arrayInfoProveedores");
            console.log(this.arrayInfoProveedores);

          }
      })
    },


    cellClick(param){
      console.log("param celdas");
      // console.log(param);

    },

    getSummaries(param) {
      console.log("param de getSummaries");
      console.log(param);

      const  tabla = this.$refs.tablaComparativa
      const { columns, data } = param;
      const sums = [];
      let ind = 7

      this.datosAPI.forEach((elemento, index) => {
        if (index == 0) {
          sums[index] = 'Total'          
        }
        sums[ind] = 0
        elemento.productos.forEach((ele) => {
          sums[ind] = sums[ind] + ele.precio_pp
        })

        sums[ind] = sums[ind].toFixed(2)

        ind=ind+6
      })

      console.log("sums");
      console.log(sums);

      return sums;
    },

    cambiarSeleccionProductoSegmentado(scope, producto){
      console.log("cambio seleccionado");
      console.log(scope);
      let index = scope.$index
      console.log("index");
      console.log(index);

      let cellIndex = scope.cellIndex
      console.log("cellIndex");
      console.log(cellIndex);


      console.log("productos");
      console.log(producto);

      this.datosAPI.forEach((elemento, index) => {
        elemento.productos.forEach((ele, ind) => {
          if (ele.producto_id == producto.producto_id && ele.proveedor_id != producto.proveedor_id) {
            ele.productoSeleccionado = false
          }
        })
      })

      this.calcularTotalHomogeneo()
      
    },

    scroll(scrollLeft, scrollTop){
      console.log("scrollLeft");
      console.log(scrollLeft);

      console.log("scrollTop");
      console.log(scrollTop);

    },

    scrollLeft(){

    },

    headerStylePrincipalTable(row, column, rowIndex, columnIndex){
      // P1
      if (row.rowIndex == 1 && row.columnIndex == 2) {
        return { background: "#4b86b4", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 0) {
        return { background: "#4b86b4", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 1) {
        return { background: "#4b86b4", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 2) {
        return { background: "#4b86b4", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 3) {
        return { background: "#4b86b4", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 4) {
        return { background: "#4b86b4", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 5) {
        return { background: "#4b86b4", color: "#000000" }
      }

      
      // P2
      if (row.rowIndex == 1 && row.columnIndex == 3) {
        return { background: "#adcbe3", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 6) {
        return { background: "#adcbe3", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 7) {
        return { background: "#adcbe3", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 8) {
        return { background: "#adcbe3", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 9) {
        return { background: "#adcbe3", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 10) {
        return { background: "#adcbe3", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 11) {
        return { background: "#adcbe3", color: "#000000" }
      }


      // P3
      if (row.rowIndex == 1 && row.columnIndex == 4) {
        return { background: "#e7eff6", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 12) {
        return { background: "#e7eff6", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 13) {
        return { background: "#e7eff6", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 14) {
        return { background: "#e7eff6", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 15) {
        return { background: "#e7eff6", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 16) {
        return { background: "#e7eff6", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 17) {
        return { background: "#e7eff6", color: "#000000" }
      }


      // P4
      if (row.rowIndex == 1 && row.columnIndex == 5) {
        return { background: "#63ace5", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 18) {
        return { background: "#63ace5", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 19) {
        return { background: "#63ace5", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 20) {
        return { background: "#63ace5", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 21) {
        return { background: "#63ace5", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 22) {
        return { background: "#63ace5", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 23) {
        return { background: "#63ace5", color: "#000000" }
      }


      // P5
      if (row.rowIndex == 1 && row.columnIndex == 6) {
        return { background: "#4b86b4", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 24) {
        return { background: "#4b86b4", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 25) {
        return { background: "#4b86b4", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 26) {
        return { background: "#4b86b4", color: "#000000" }
      }

      if (row.rowIndex == 2 && row.columnIndex == 27) {
        return { background: "#4b86b4", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 28) {
        return { background: "#4b86b4", color: "#000000" }
      }
      
      if (row.rowIndex == 2 && row.columnIndex == 29) {
        return { background: "#4b86b4", color: "#000000" }
      }
    },

    headerStyle(row, column, rowIndex, columnIndex) {
      // console.log("row de headerStyle");
      // console.log(row);
      
      // console.log("column de headerStyle");
      // console.log(column);

      // console.log("rowIndex de headerStyle");
      // console.log(rowIndex);

      // console.log("columnIndex de headerStyle");
      // console.log(columnIndex);

      // P1
      if (row.rowIndex == 0 && row.columnIndex == 2) {
        return { background: "#4b86b4", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 0) {
        return { background: "#4b86b4", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 1) {
        return { background: "#4b86b4", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 2) {
        return { background: "#4b86b4", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 3) {
        return { background: "#4b86b4", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 4) {
        return { background: "#4b86b4", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 5) {
        return { background: "#4b86b4", color: "#000000" }
      }


      // P2
      if (row.rowIndex == 0 && row.columnIndex == 3) {
        return { background: "#adcbe3", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 6) {
        return { background: "#adcbe3", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 7) {
        return { background: "#adcbe3", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 8) {
        return { background: "#adcbe3", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 9) {
        return { background: "#adcbe3", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 10) {
        return { background: "#adcbe3", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 11) {
        return { background: "#adcbe3", color: "#000000" }
      }


      // P3
      if (row.rowIndex == 0 && row.columnIndex == 4) {
        return { background: "#e7eff6", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 12) {
        return { background: "#e7eff6", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 13) {
        return { background: "#e7eff6", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 14) {
        return { background: "#e7eff6", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 15) {
        return { background: "#e7eff6", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 16) {
        return { background: "#e7eff6", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 17) {
        return { background: "#e7eff6", color: "#000000" }
      }


      // P4
      if (row.rowIndex == 0 && row.columnIndex == 5) {
        return { background: "#63ace5", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 18) {
        return { background: "#63ace5", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 19) {
        return { background: "#63ace5", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 20) {
        return { background: "#63ace5", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 21) {
        return { background: "#63ace5", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 22) {
        return { background: "#63ace5", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 23) {
        return { background: "#63ace5", color: "#000000" }
      }


      // P4
      if (row.rowIndex == 0 && row.columnIndex == 6) {
        return { background: "#4b86b4", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 24) {
        return { background: "#4b86b4", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 25) {
        return { background: "#4b86b4", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 26) {
        return { background: "#4b86b4", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 27) {
        return { background: "#4b86b4", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 28) {
        return { background: "#4b86b4", color: "#000000" }
      }

      if (row.rowIndex == 1 && row.columnIndex == 29) {
        return { background: "#4b86b4", color: "#000000" }
      }

      

      

      
    },

    headerCellStyle({ row, column, rowIndex, columnIndex }){
      if (column.label == "PP") {
        // console.log("row de cell style");
        // console.log(row);

        // console.log("column de cell style");
        // console.log(column);

        // console.log("rowIndex de cell style");
        // console.log(rowIndex);

        // console.log("columnIndex de cell style");
        // console.log(columnIndex);


        if (columnIndex == 2) {
          return {'background' : 'lightblue'}
        }

        if (columnIndex == 3) {
          return {'background' : 'lightgreen'}
        }
        
      }

      if (column.label == "Proveedores") {
        console.log("row de cell style en Proveedores");
        console.log(row);

        console.log("column de cell style en Proveedores");
        console.log(column);

        console.log("rowIndex de cell style en Proveedores");
        console.log(rowIndex);

        console.log("columnIndex de cell style en Proveedores");
        console.log(columnIndex);

        return {'background' : 'blue'}
      }


    },

    filterTag(value, row) {
      let value1 = value;
      console.log("value1");
      console.log(value1);

      console.log("row");
      console.log(row);

      return row
    },

    click(){
      console.log("e");
    },

    yellowBg (row, column, rowIndex, columnIndex) {
      console.log("entra a yellow");
      return {
        background: ''
      }
    },

    seleccionar(param){
      console.log("paramSeleccionar");
      console.log(param);

    },

    colorColumnas(columnas){
      // console.log("color columnas");
      // console.log(columnas);

      return {
          background: '#eceb3c'
        }

    },

    classChecker({ row, column, rowIndex, columnIndex }) {
      // console.log("*******************************");
      // console.log("rowIndex de classchecker");
      // console.log(rowIndex);

      // console.log("columnIndex de classchecker");
      // console.log(columnIndex);

      // console.log("column de classchecker");
      // console.log(column);
      
      // Proveedor1
      if (columnIndex == 2) {
        return {'background': '#4b86b4' , 'color': 'black'}
      }
      
      if (columnIndex == 3) {
        return {'background': '#4b86b4' , 'color': 'black'}
      }
      
      if (columnIndex == 4) {
        return {'background': '#4b86b4' , 'color': 'black'}
      }
     
      if (columnIndex == 5) {
        return {'background': '#4b86b4' , 'color': 'black'}
      }
      
      if (columnIndex == 6) {
        return {'background': '#4b86b4' , 'color': 'black'}
      }
      
      if (columnIndex == 7) {
        return {'background': '#4b86b4' , 'color': 'black'}
      }

      // P2
      if (columnIndex == 8) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 9) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 10) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 11) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }
      
      if (columnIndex == 12) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 13) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      // P3
      if (columnIndex == 14) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 15) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 16) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 17) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 18) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 19) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      // P4
      if (columnIndex == 20) {
        return {'background': '#63ace5' , 'color': 'black'}
      }

      if (columnIndex == 21) {
        return {'background': '#63ace5' , 'color': 'black'}
      }
      
      if (columnIndex == 22) {
        return {'background': '#63ace5' , 'color': 'black'}
      }

      if (columnIndex == 23) {
        return {'background': '#63ace5' , 'color': 'black'}
      }

      if (columnIndex == 24) {
        return {'background': '#63ace5' , 'color': 'black'}
      }

      if (columnIndex == 25) {
        return {'background': '#63ace5' , 'color': 'black'}
      }


      //P5
      if (columnIndex == 26) {
        return {'background': '#4b86b4' , 'color': 'black'}
      }

      if (columnIndex == 27) {
        return {'background': '#4b86b4' , 'color': 'black'}
      }

      if (columnIndex == 28) {
        return {'background': '#4b86b4' , 'color': 'black'}
      }

      if (columnIndex == 29) {
        return {'background': '#4b86b4' , 'color': 'black'}
      }
      
      if (columnIndex == 30) {
        return {'background': '#4b86b4' , 'color': 'black'}
      }

      if (columnIndex == 31) {
        return {'background': '#4b86b4' , 'color': 'black'}
      }
      
      //P5
      if (columnIndex == 32) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 33) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 34) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 35) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 36) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 37) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      // P6
      if (columnIndex == 38) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 39) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 40) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }      

      if (columnIndex == 41) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 42) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 43) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      // P7
      if (columnIndex == 44) {
        return {'background': '#63ace5' , 'color': 'black'}
      }

      if (columnIndex == 45) {
        return {'background': '#63ace5' , 'color': 'black'}
      }

      if (columnIndex == 46) {
        return {'background': '#63ace5' , 'color': 'black'}
      }

      if (columnIndex == 47) {
        return {'background': '#63ace5' , 'color': 'black'}
      }

      if (columnIndex == 48) {
        return {'background': '#63ace5' , 'color': 'black'}
      }

      if (columnIndex == 49) {
        return {'background': '#63ace5' , 'color': 'black'}
      }

      //P8
      if (columnIndex == 50) {
        return {'background': '#4b86b4' , 'color': 'black'}
      }

      if (columnIndex == 51) {
        return {'background': '#4b86b4' , 'color': 'black'}
      }

      if (columnIndex == 52) {
        return {'background': '#4b86b4' , 'color': 'black'}
      }

      if (columnIndex == 53) {
        return {'background': '#4b86b4' , 'color': 'black'}
      }

      if (columnIndex == 54) {
        return {'background': '#4b86b4' , 'color': 'black'}
      }

      if (columnIndex == 55) {
        return {'background': '#4b86b4' , 'color': 'black'}
      }

      // P9
      if (columnIndex == 56) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 57) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 58) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 59) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 60) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 61) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      // P10
      if (columnIndex == 62) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 63) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 64) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 65) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 66) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 67) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      // P11
      if (columnIndex == 68) {
        return {'background': '#63ace5' , 'color': 'black'}
      }

      if (columnIndex == 69) {
        return {'background': '#63ace5' , 'color': 'black'}
      }

      if (columnIndex == 70) {
        return {'background': '#63ace5' , 'color': 'black'}
      }

      if (columnIndex == 71) {
        return {'background': '#63ace5' , 'color': 'black'}
      }

      if (columnIndex == 72) {
        return {'background': '#63ace5' , 'color': 'black'}
      }

      if (columnIndex == 73) {
        return {'background': '#63ace5' , 'color': 'black'}
      }

    }
    
  },

  
};
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

  .el-table .blueClass {
    background: #0090ff !important;
  }
  .redClass {
    color: red;
  }

  .my-header {
    background: blue !important; 
  }

  .scrollbar-flex-content {
    display: block;
  }
</style>
