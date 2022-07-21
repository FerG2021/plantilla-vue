<template>
  <div>
    <modal
      ref="modal"
      titulo="Comparativa de productos"
      :impedir-close="impedirClose"
      width="95%"
    >
      <div v-loading="loadingTabla">
        <el-table
          :data="arraySoloProductos"
          border
          stripe
          style="width: 100%;"
          show-summary
          @sort-change="sortChange()"
          @cell-click="cellClick"
          :summary-method="getSummaries"
          ref="tablaComparativa"
          :cell-style="classChecker"
        >
          <el-table-column
            label="Productos"
            align="center"
            style="background-color: red"
          >
            <el-table-column prop="date" label="ID" align="center">
              <template #default="props">
                {{ props.row.producto_id }}
              </template>
            </el-table-column>

            <el-table-column prop="date" label="Nombre" align="center">
              <template #default="props">
                {{ props.row.producto_nombre }}
              </template>
            </el-table-column>

            <el-table-column
              prop="date"
              label="Cantidad a comprar"
              align="center"
            >
              <template #default="props">
                {{ props.row.cantidad_a_comprar }}
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
            <!-- <el-checkbox v-model="a" label="" size="large" /> -->
              <!-- <el-table-column type="selection" width="55" /> -->
              <el-table-column 
                label="PP" 
                align="center"
                @select="seleccionar(param)"
                style="background-color: red;"
                prop="pp"
              >
                <template #default="scope" >
                  <el-checkbox 
                    v-model="item.productos[scope.$index].productoSeleccionado" 
                    :label="parseFloat(item.productos[scope.$index].precio_pp)" 
                    size="large" 
                    @change="cambiarSeleccionProductoSegmentado(scope, item.productos[scope.$index])"
                    style="margin-left: 20px; color: black"
                  />
                  
                  <!-- {{ parseFloat(item.productos[scope.$index].precio_pp) }} -->
                  <!-- <el-button
                    type="primary"
                    @click="agregar(scope, item.productos[scope.$index] ,item.productos[index].precio_pp, index)"
                  >
                    agregar
                  </el-button> -->
                </template>

                <!-- <template #default="scope">
                  <el-button
                    type="primary"
                    @click="agregar(scope, item.productos[scope.$index] ,item.productos[index].precio_pp, index)"
                  >

                    agregar
                  </el-button>
                </template> -->

                <!-- <template #default="props">
                    {{props.row.proveedor_monto_total_homogeneo}}
                  </template> -->
              </el-table-column>
            </el-table-column>
          </el-table-column>
        </el-table>

        <el-table 
          :data="arrayTotal"
          style="margin-top: 15px"
        >
          <el-table-column label=""></el-table-column>
          <el-table-column label="Total homogéneo" align="center">
            <template #default="props">
              {{props.row.totalHomogeneo}}
            </template>
          </el-table-column>
          <el-table-column label=""></el-table-column>
          <el-table-column v-for="(item, index) in arrayPrecioPPProveedores" :key="index" label="Total por proveedor" align="center">
             <!-- <template #default="scope"> -->
              {{item.totalPP}}
             <!-- </template> -->
          </el-table-column>

        </el-table>
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
      arrayPrecioPPProveedores: []
    };
  },

  methods: {
    abrir(id) {
      this.id = null;
      this.id = id;

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


      this.$refs.modal.abrir();

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
            let fila = {
              presupuestacion_id: elemento.presupuestacion_id ,
              presupuestacion_plan_id: elemento.presupuestacion_plan_id ,
              proveedor_id: elemento.proveedor_id ,
              proveedor_nombre: elemento.proveedor_nombre ,
              proveedor_rubro_id: elemento.proveedor_rubro_id ,
              totalPP: 0 ,
            }

            this.arrayPrecioPPProveedores.push(fila)
          })



          
        });

      this.crearArraySoloProductos();
      this.calcularTotalHomogeneo()
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
        totalHomogeneo: this.totalHomogeneo.toFixed(2),
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

    cellClick(param){
      console.log("param celdas");
      console.log(param);

    },

    getSummaries(param) {
      const  tabla = this.$refs.tablaComparativa
      const { columns, data } = param;
      const sums = [];
      let ind = 3

      this.datosAPI.forEach((elemento, index) => {
        if (index == 0) {
          sums[index] = 'Total'          
        }
        sums[ind] = 0
        elemento.productos.forEach((ele) => {
          sums[ind] = sums[ind] + ele.precio_pp
        })
        ind++
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
      console.log("*******************************");
      console.log("rowIndex de classchecker");
      console.log(rowIndex);

      console.log("columnIndex de classchecker");
      console.log(columnIndex);

      console.log("column de classchecker");
      console.log(column);

      if (columnIndex == 3) {
        return {'background': '#4b86b4' , 'color': 'black'}
      }

      if (columnIndex == 4) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 5) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 6) {
        return {'background': '#63ace5' , 'color': 'black'}
      }

      
      if (columnIndex == 7) {
        return {'background': '#4b86b4' , 'color': 'black'}
      }

      if (columnIndex == 8) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 9) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 10) {
        return {'background': '#63ace5' , 'color': 'black'}
      }

      
      if (columnIndex == 11) {
        return {'background': '#4b86b4' , 'color': 'black'}
      }

      if (columnIndex == 12) {
        return {'background': '#adcbe3' , 'color': 'black'}
      }

      if (columnIndex == 13) {
        return {'background': '#e7eff6' , 'color': 'black'}
      }

      if (columnIndex == 14) {
        return {'background': '#63ace5' , 'color': 'black'}
      }

    }
    
  },

  headerStyle() {
   return 'blueClass'
  }
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
</style>
