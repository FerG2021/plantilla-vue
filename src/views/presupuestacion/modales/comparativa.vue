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
          @header-click="headerClick" 
          @cell-click="cellClick"
          :summary-method="getSummaries"
          ref="tablaComparativa"
          :cell-style="yellowBg"
          :header-cell-style="{
            'background-color': '#f7f7f7',
            color: '#6e6e6e',
            'font-weight': '400',
          }"
          :cell-class-name="classChecker"
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
            <!-- <el-checkbox v-model="a" label="" size="large" /> -->
              <!-- <el-table-column type="selection" width="55" /> -->
              <el-table-column 
                label="PP" 
                align="center"
                @select="seleccionar(param)"
                style="background-color: red;"
              >
                <template #default="scope" >
                  <el-checkbox 
                    v-model="item.productos[scope.$index].productoSeleccionado" label="" 
                    size="large" 
                    @change="cambiarSeleccionProductoSegmentado(scope, item.productos[scope.$index])"
                    style="margin-left: 20px"
                  />
                  
                  {{ parseFloat(item.productos[scope.$index].precio_pp) }}
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
      </div>
    </modal>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from "element-plus";

name: "nuevoProducto";
export default {
  data() {
    return {
      id: null,
      datosAPI: [],
      arraySoloProductos: [],
      arrAux: [],
      mostrarTabla: false,
      loadingTabla: false,
    };
  },

  methods: {
    abrir(id) {
      this.id = null;
      this.id = id;

      this.datosAPI = [];
      this.arraySoloProductos = [];
      this.arrAux = [];
      this.mostrarTabla = false;
      this.loadingTabla = true;


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
        });

      this.crearArraySoloProductos();
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

      console.log("this.arraySoloProductos");
      console.log(this.arraySoloProductos);

      this.loadingTabla = false;


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

      console.log("nombre");
      console.log(param.label);
      
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

     console.log("row");
     console.log(row);

      console.log("column");
      console.log(column);

      console.log("rowIndex");
      console.log(rowIndex);

      console.log("columnIndex");
      console.log(columnIndex);



      const val = row[column.property];
      console.log("val");
      console.log(val);

      if (val > 0) {
        return "blueClass";
      } else {
        return "redClass";
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
