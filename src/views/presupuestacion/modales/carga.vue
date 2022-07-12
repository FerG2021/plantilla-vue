<template>
  <div>
    <modal
      ref="modal"
      titulo="Carga de los productos según proveedor"
      :impedir-close="impedirClose"
      width="70%"
    >
      <!-- <el-descriptions
        title="Información de la presupuestación"
        direction="vertical"
        :column="4"
        :size="size"
        border
        v-loading="loading"
      >
        <div v-if="datos != null">
          <el-descriptions-item label="Nro. presupuestación">
            {{ datos.presupuestacion_id }}
          </el-descriptions-item>

          <el-descriptions-item label="Fecha de creación">
            {{ formatearFecha(datos.presupuesto_fecha_creacion) }}
          </el-descriptions-item>

          <el-descriptions-item label="Plan">
            {{ datos.presupuestacion_plan_nombre }}
          </el-descriptions-item>

          <el-descriptions-item label="Incio de presupuestación">
            {{ formatearFecha(datos.presupuestacion_fecha_incio) }}
          </el-descriptions-item>

          <el-descriptions-item label="Fin de presupuestación">
            {{ formatearFecha(datos.presupuestacion_fecha_fin) }}
          </el-descriptions-item>

          <el-descriptions-item label="Rubro">
            <el-tag class="ml-2" type="success">{{
              datos.presupuestacion_rubro_nombre
            }}</el-tag>
          </el-descriptions-item>
        </div>
      </el-descriptions>

      <h3 style="margin-top: 15px"><b>Productos</b></h3>
      <div v-if="datosProductos">
        <el-table
          :data="datosProductos"
          stripe
          style="width: 100%"
          v-loading="loadingProductos"
        >
          <el-table-column prop="nombre" label="Nombre">
            <template #default="props">
              <span>{{ props.row.producto_nombre }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="nombre" label="Rubro">
            <template #default="props">
              <span>{{ props.row.producto_rubro_nombre }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="cantidad" label="Cantidad a comprar">
            <template #default="props">
              <span>{{ props.row.producto_cantidad_real_a_comprar }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <h3 style="margin-top: 15px"><b>Proveedores</b></h3>
      <div v-if="datosProveedores">
        <el-table
          :data="datosProveedores"
          stripe
          style="width: 100%"
          v-loading="loadingProductos"
        >
          <el-table-column prop="nombre" label="Nombre">
            <template #default="props">
              <span>{{ props.row.proveedor_nombre }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="nombre" label="Mail">
            <template #default="props">
              <span>{{ props.row.proveedor_mail }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div> -->


      <div v-loading="loadingInformacionParaCarga">
        <div v-for="item in datosProveedores" :key="item.index">
          <el-row style="margin-top: 10px">
            <h3><b>Proveedor: {{item.proveedor_nombre}}</b></h3>
          </el-row>
          <div v-for="itemProducto in arrayInformacionParaCarga" :key="itemProducto.index">
            <div v-if="item.proveedor_id == itemProducto.proveedor_id">
              <!-- <el-row>
                <el-col>{{itemProducto.producto_nombre}}</el-col>
                <el-col></el-col>
                <el-col></el-col>
              </el-row> -->

              <el-descriptions
                style="margin-top: 10px"
                direction="vertical"
                :column="4"
                :size="size"
                border
              >
                <!-- <el-descriptions-item label="Proveedor">
                  {{itemProducto.proveedor_id}} - {{itemProducto.proveedor_nombre}}
                </el-descriptions-item> -->

                <el-descriptions-item label="Producto">
                  {{itemProducto.producto_nombre}}
                </el-descriptions-item>
                
                <el-descriptions-item label="Cantidad a comprar">
                  {{itemProducto.producto_cantidad_real_a_comprar}}
                </el-descriptions-item>
              
                <el-descriptions-item label="Cantidad recibida">
                  <el-input-number
                    :controls="false"
                    v-model="itemProducto.producto_cantidad_proveedor"
                  >
                    {{itemProducto.producto_cantidad_proveedor}}
                  </el-input-number>
                </el-descriptions-item>
                
                <el-descriptions-item label="Precio">
                  <el-input-number
                    :controls="false"
                    v-model="itemProducto.producto_precio"
                  >
                    {{itemProducto.producto_precio}}
                  </el-input-number>
                </el-descriptions-item>
              </el-descriptions>



              


            </div>
          </div>
        </div>
      </div>

      <!-- <el-button
        type="primary"
        @click="guardar()"
      >
        Guardar
      </el-button> -->

      <div class="contenedorBtnSiguienteAtras">
        <!-- <el-button  
          type="info"    
          class="btnAtras"
          @click="active = 0"
        >
          Atrás
        </el-button> -->

        <el-button  
          type="primary"    
          class="btnSiguiente"
          @click="onSubmit()"

        >
          Guardar
        </el-button>
      </div>

      <!-- {{arrayInformacionParaCarga}} -->



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
      loading: false,
      loadingProductos: false,
      loadingProveedores: false,
      loadingInformacionParaCarga: false,
      datos: null,
      datosProductos: [],
      datosProveedores: [],

      arrayInformacionParaCarga: [],
      arrayProductosDesdeAPI: [],

    };
  },

  methods: {
    abrir(id) {
      this.loading = true;
      this.loadingProductos = true;
      this.loadingProveedores = true;
      this.loadingInformacionParaCarga = true;
      this.id = null;
      this.id = id;
      this.datos = null;
      this.datosProductos = [];
      this.datosProveedores = [];
      this.arrayInformacionParaCarga = [];
      this.arrayProductosDesdeAPI = [];


      this.$refs.modal.abrir();

      // limpio los campos
      this.getDatos();
    },

    cerrar() {
      this.$refs.modal.cerrar();
    },

    async getDatos() {
      await this.axios
        .get("/api/presupuestacion/obtenerDatos/" + this.id)
        .then((response) => {
          const respuestaApi = response;
          console.log(respuestaApi);

          if (respuestaApi != null) {
            this.datos = respuestaApi.data;
            console.log(this.datos);
            this.loading = false;

            this.datosProductos = respuestaApi.data.productos;
            this.loadingProductos = false;

            this.datosProveedores = respuestaApi.data.proveedores;
            this.loadingProveedores = false;

            
            this.mostrarInformacionParaCargar();


            console.log("this.arrayInformacionParaCarga");
            console.log(this.arrayInformacionParaCarga);
            

          } else {
            this.cerrar();
          }
        });
    },

    // primero genero el array con todos los productos de la presupuestacion
    mostrarInformacionParaCargar(){
      this.datosProveedores.forEach((elemento) => {
        this.datosProductos.forEach((ele) => {
          let fila = {
            presupuestacion_productos_proveedores_id: 0,
            presupuestacion_plan_id: this.datos.presupuestacion_plan_id,
            presupuestacion_id: this.datos.presupuestacion_id,
            presupuestacion_producto_id: ele.presupuestacion_producto_id,
            presupuestacion_rubro_id: this.datos.presupuestacion_rubro_id,
	          presupuestacion_rubro_nombre: this.datos.presupuestacion_rubro_nombre,
            proveedor_id: elemento.proveedor_id,
            proveedor_nombre: elemento.proveedor_nombre,
            proveedor_mail: elemento.proveedor_mail,
            producto_id: ele.producto_id,
            producto_nombre: ele.producto_nombre,
            producto_cantidad_real_a_comprar: ele.producto_cantidad_real_a_comprar,
            producto_cantidad_proveedor: 0,
            producto_precio: 0,
            ya_agregado: 0,
          }

          this.arrayInformacionParaCarga.push(fila)
        })
      })

      this.completarArrayConProductosAgregados();
    },

    // luego busco los productos que ya tengo creados y los reemplazo en el array
    async completarArrayConProductosAgregados(){
        await this.axios.get("/api/presupuestacionproductosproveedor/obtenerTodos/" + this.id)
          .then(response =>{
            console.log("completarArrayConProductosAgregados");
            console.log(response.data);
            this.arrayProductosDesdeAPI = response.data
        })  
        
        
        this.arrayInformacionParaCarga.forEach((elemento) => {
          this.arrayProductosDesdeAPI.forEach((ele) => {
            console.log("*******************");
            console.log("presupuestacion_producto_id de Info carga");
            console.log(elemento.presupuestacion_producto_id );
            console.log("presupuestacion_producto_id de API");
            console.log(ele.presupuestacion_producto_id);
            console.log("*******************");

            if (elemento.presupuestacion_producto_id == ele.presupuestacion_producto_id && elemento.proveedor_id == ele.proveedor_id) {
              elemento.presupuestacion_productos_proveedores_id = ele.presupuestacion_productos_proveedores_id,
              elemento.presupuestacion_productos_proveedores_id = ele.presupuestacion_productos_proveedores_id
              elemento.presupuestacion_producto_id = ele.presupuestacion_producto_id
              elemento.presupuestacion_id = ele.presupuestacion_id
              elemento.presupuestacion_plan_id = ele.presupuestacion_plan_id
              elemento.presupuestacion_rubro_id = ele.presupuestacion_rubro_id
              elemento.presupuestacion_rubro_nombre = ele.presupuestacion_rubro_nombre
              elemento.proveedor_id = ele.proveedor_id
              elemento.proveedor_nombre = ele.proveedor_nombre
              elemento.proveedor_mail = ele.proveedor_mail
              elemento.producto_id = ele.producto_id
              elemento.producto_nombre = ele.producto_nombre
              elemento.producto_cantidad_real_a_comprar = ele.producto_cantidad_a_comprar
              elemento.producto_cantidad_proveedor = ele.producto_cantidad_proveedor
              elemento.producto_precio = ele.producto_precio_proveedor
              elemento.ya_agregado = 1
            }
          })
        })

        console.log("this.arrayInformacionParaCarga despues de API");
        console.log(this.arrayInformacionParaCarga);

        this.loadingInformacionParaCarga = false;

    },

    async onSubmit(){
      console.log("this.arrayInformacionParaCargaGuardar");
      console.log(this.arrayInformacionParaCarga);


      let params = {
        arrProductosProveedores: JSON.stringify(this.arrayInformacionParaCarga)
      }

      await this.axios.post("/api/presupuestacionproductosproveedor/crear", params)
          .then(response => {
            console.log(response);

            if (response) {
              ElMessage({
                type: 'success',
                message: '¡Carga realizada con éxito!',
              })
              // this.$emit('actualizarTabla')
              this.cerrar()
            }
          })


    },

    formatearFecha(fecha) {
      let fecha1 = new Date(fecha);
      let fecha2 = fecha1.toLocaleDateString();
      return fecha2;
    },

    // async categoriaObtenerTodosSelect() {
    //   await this.axios
    //     .get(this.base_url + "/categoria/obtenerTodosSelect")
    //     .then((response) => {
    //       this.categoriasSelect = response.data;
    //       console.log(this.categoriasSelect);
    //     });
    // },

    // async unidadMedidaObtenerTodosSelect() {
    //   await this.axios
    //     .get(this.base_url + "/unidad-medida/obtenerTodosSelect")
    //     .then((response) => {
    //       this.unidadMedidaSelect = response.data;
    //       console.log(this.categoriasSelect);
    //     });
    // },

    // cambiarValorIDUnMed() {
    //   this.form.idUnidadMedida = this.form.unidadMedida;
    // },

    // cambiarValorIDCategoria() {
    //   this.form.idCategoria = this.form.categoria;
    // },

    // onSubmit() {
    //   let params = {
    //     id: this.id,
    //     descripcion: this.form.nombre,
    //     precio: this.form.precio,
    //     stock: this.form.stock,
    //     idCategoria: this.form.idCategoria,
    //     idUnidadMedida: this.form.idUnidadMedida,
    //   };

    //   this.axios
    //     .put(this.base_url + "/articulo/actualizar/" + this.id, params)
    //     .then((response) => {
    //       ElMessage({
    //         type: "success",
    //         message: "¡Producto modificado con éxito!",
    //       });
    //       this.$emit("actualizarTabla");
    //       this.cerrar();
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // },

    // deshabilitarBtnGuardar() {
    //   if (
    //     this.form.nombre == null ||
    //     this.form.nombre == "" ||
    //     this.form.precio == null ||
    //     this.form.precio == 0 ||
    //     this.form.precio == "" ||
    //     this.form.stock == null ||
    //     this.form.stock == 0 ||
    //     this.form.stock == ""
    //   ) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // },
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
