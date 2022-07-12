<template>
  <div>
    <modal
      ref="modal"
      titulo="Comparativa de productos"
      :impedir-close="impedirClose"
      width="95%"
    >
      <!-- {{arrayProductosDesdeAPI}} -->
      <!-- {{arrayComparativa}} -->
      <!-- {{arrayProveedoresComparativaTotal}} -->
      <!-- {{arrayProveedoresComparativa}} -->
      <!-- {{arrayProveedoresComparativaConProductos}} -->

      <el-table :data="arrayComparativa" style="width: 100%" stripe>
        <el-table-column label="Producto" align="center">
          <el-table-column label="ID" prop="producto_id" align="center">
            <template #default="props">
              <span>{{ props.row.producto_id }}</span>
            </template>
          </el-table-column>

          <el-table-column label="Nombre" prop="nombre" align="center">
            <template #default="props">
              <span>{{ props.row.producto_nombre }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        
        <el-table-column v-for="item in arrayProveedoresProductoComparativa" :key="item.index" :label="item.proveedor_nombre" align="center">
          <el-table-column label="PNG" align="center">
            
          </el-table-column>
          <el-table-column label="IVA" align="center"></el-table-column>
          <el-table-column label="PU" align="center"></el-table-column>
          <el-table-column label="PP" align="center"></el-table-column>


        </el-table-column>
      </el-table>

      <!-- <el-table :data="arrayComparativa" style="width: 100%" stripe>
        <el-table-column label="Producto" align="center">
          <el-table-column label="ID" prop="producto_id" align="center">
            <template #default="props">
              <span>{{ props.row.producto_id }}</span>
            </template>
          </el-table-column>

          <el-table-column label="Nombre" prop="nombre" align="center">
            <template #default="props">
              <span>{{ props.row.producto_nombre }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        
        <el-table-column v-for="item in arrayProveedoresProductoComparativa" :key="item.index" :label="item.proveedor_nombre" align="center">
          <el-table-column v-for="item1 in item.arrayProdInterno" :key="item1.index" :label="PP">
            <template #default="props">
              <span>{{ props.row.producto_nombre }}</span>
            </template>
          </el-table-column>

          
          



        </el-table-column>
      </el-table> -->
      
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
      arrayProductosDesdeAPI: [],
      arrayComparativa: [],
      arrayProveedoresComparativa: [],
      arrayProveedoresProductoComparativa: [],
      arrayProveedoresComparativaTotal: [],
      arraySoloProductos: [],
      arrayProveedoresComparativaConProductos: [],
      arrayProveedores: [],

    };
  },

  methods: {
    abrir(id) {
      this.arrayProductosDesdeAPI = [];
      this.arrayComparativa = [];
      this.arrayProveedoresComparativa = [];
      this.arrayProveedoresComparativaTotal = [];
      this.arrayProveedoresProductoComparativa = [];
      this.arrayProveedoresComparativaConProductos = [];
      this.arrayProveedores = [];

      this.arraySoloProductos = [];
      this.id = null;
      this.id = id;

      this.$refs.modal.abrir();

      // limpio los campos
      this.getDatos();
    },

    cerrar() {
      this.$refs.modal.cerrar();
    },

    async getDatos(){
      await this.axios.get("/api/presupuestacionproductosproveedor/obtenerTodos/" + this.id)
          .then(response =>{
            this.arrayProductosDesdeAPI = response.data
            console.log("this.arrayProductosDesdeAPI");
            console.log(this.arrayProductosDesdeAPI);      
        })  
      
      this.getSoloProductos()

      
    },

    getSoloProductos(){
      this.arrayProductosDesdeAPI.forEach((elemento) => {
        if (this.arraySoloProductos.length == 0) {
          let fila = {
            producto_id: elemento.producto_id,
            producto_nombre: elemento.producto_nombre,
            rubro_id: elemento.rubro_id,
            rubro_nombre: elemento.rubro_nombre,
          }

          this.arraySoloProductos.push(fila);
         
        } else {
          let b = 0
          this.arraySoloProductos.forEach((ele) => {
            if (elemento.producto_id == ele.producto_id) {
              b = 1
            }
          })
          
          if (b == 0) {
            let fila = {
              producto_id: elemento.producto_id,
              producto_nombre: elemento.producto_nombre,
              rubro_id: elemento.rubro_id,
              rubro_nombre: elemento.rubro_nombre,
            }

            this.arraySoloProductos.push(fila);
          }
        }
      })

      console.log("this.arraySoloProductos");
      console.log(this.arraySoloProductos);

      this.getComparativa();
    },

    getComparativa(){
      this.arraySoloProductos.forEach((elemento) => {
        this.arrayProveedoresComparativa = [];
        let filaProducto = {
          producto_id: elemento.producto_id,
          producto_nombre: elemento.producto_nombre,
        }
        
        this.arrayProductosDesdeAPI.forEach((ele) => {
          if (elemento.producto_id == ele.producto_id) {
            let filaProveedor = {
              proveedor_id: ele.proveedor_id,
              proveedor_nombre: ele.proveedor_nombre,
              producto_id: ele.producto_id,
              producto_nombre: ele.producto_nombre,
              producto_cantidad_a_comprar: ele.producto_cantidad_a_comprar,
              producto_cantidad_proveedor: ele.producto_cantidad_proveedor,
              producto_precio_proveedor: ele.producto_precio_proveedor,
            }

            this.arrayProveedoresComparativa.push(filaProveedor);
            this.arrayProveedoresComparativaTotal.push(filaProveedor);

          }
        })

        let filaGeneral = {
          producto_id: filaProducto.producto_id,
          producto_nombre: filaProducto.producto_nombre,
          proveedor: this.arrayProveedoresComparativa,
        }

        this.arrayComparativa.push(filaGeneral);
      })

      console.log("this.arrayComparativa");
      console.log(this.arrayComparativa);

      this.getComparativaProveedores();
    },

    getComparativaProveedores(){
      // primero tomo los proveedores
      this.arrayProductosDesdeAPI.forEach((elemento) => {
        if (this.arrayProveedores.length == 0) {
          let fila = {
            proveedor_id: elemento.proveedor_id,
            proveedor_nombre: elemento.proveedor_nombre,
            proveedor_mail: elemento.proveedor_mail,
          }

          this.arrayProveedores.push(fila)
        } else {
          let b = 0
          this.arrayProveedores.forEach((ele) => {
            if (elemento.proveedor_id == ele.proveedor_id) {
              b = 1
            }
          })

          if (b == 0) {
            let fila = {
              proveedor_id: elemento.proveedor_id,
              proveedor_nombre: elemento.proveedor_nombre,
              proveedor_mail: elemento.proveedor_mail,
            }

            this.arrayProveedores.push(fila)
          }
        }
      })

      console.log("this.arrayProveedores");
      console.log(this.arrayProveedores);

      // completo el array con los datos de los productos segun el proveedor
      this.arrayProveedores.forEach((elemento) => {
        console.log("entre");
        let fila = {
          proveedor_id: elemento.proveedor_id,
          proveedor_nombre: elemento.proveedor_nombre,
          proveedor_mail: elemento.proveedor_mail,
        }
        let arrayProdInterno = []
        this.arrayProductosDesdeAPI.forEach((ele) => {
          if (elemento.proveedor_id == ele.proveedor_id) {
            let filaProducto = {
              proveedor_id: ele.proveedor_id,
              proveedor_nombre: ele.proveedor_nombre,
              producto_id: ele.producto_id,
              producto_nombre: ele.producto_nombre,
              producto_cantidad_a_comprar: ele.producto_cantidad_a_comprar,
              producto_cantidad_proveedor: ele.producto_cantidad_proveedor,
              producto_precio_proveedor: ele.producto_precio_proveedor,
            }

            arrayProdInterno.push(filaProducto)
          }
        })

        // let fila = {}

        // fila = arrayProdInterno
        fila.arrayProdInterno = arrayProdInterno

        this.arrayProveedoresProductoComparativa.push(fila)
      })

      console.log("this.arrayProveedoresProductoComparativa");
      console.log(this.arrayProveedoresProductoComparativa);


    },
    
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
</style>
