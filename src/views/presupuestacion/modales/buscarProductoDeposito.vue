<template>
  <div>
    <modal
      ref="modal"
      titulo="Buscar producto en depósito"
      :impedir-close="impedirClose"
    >
      <div>
        <!-- <h3>Buscar producto en depósito</h3> -->

        <!-- Tabla para mostrar por deposito -->
        <el-table :data="datosDeposito" v-loading="loading" stripe style="width: 100%">
          <el-table-column prop="date" label="Depósito" >
            <template #default="props">
              <span><b>{{ props.row.deposito.deposito_nombre }}</b></span>
            </template>
          </el-table-column>

          <el-table-column prop="date" label="Producto" >
            <template #default="props">
              <span>{{ props.row.producto_nombre }}</span>
            </template>
          </el-table-column>

          <!-- <el-table-column prop="date" label="Estado" >
            <template #default="props">
              <span v-if="props.row.producto_activo == 1">
                <el-tag class="ml-2" type="success">Activo</el-tag>
              </span>
              <span v-else>
                <el-tag class="ml-2" type="danger">Inactivo</el-tag>
              </span>
            </template>
          </el-table-column> -->

          <el-table-column prop="date" label="Stock" >
            <template #default="props">
              <span>{{ props.row.producto_stock }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="cantidadAUtilizar" label="Cant. a utilizar">
            <template #default="scope">
              <el-input-number 
                v-model="scope.row.cantidadAUtilizar" 
                :max="scope.row.producto_stock"
                :controls="false" 
                align="center" 
                text-align="center"
                style="width: 100%"
                @change="sumardatosSacarDeposito(scope.row.cantidadAUtilizar)"
              />
              
            </template>
          </el-table-column>
          
        </el-table>

        <!-- {{cantidadTotalDeposito}} -->

        <el-row :gutter="10" style="margin-top: 15px">
          <el-col :span="3"></el-col>
          <el-col :span="3"></el-col>
          <el-col :span="3"></el-col>
          <el-col :span="3"></el-col>
          <el-col :span="3"></el-col>
          <el-col :span="3"></el-col>
          <el-col :span="2"></el-col>
          <el-col :span="3">
            <el-button
              type="primary"
              style="width: 100%"
              @click="enviarCantidadAUtilizarDeposito()"
            >
              Agregar
            </el-button>
          </el-col>
          <el-col :span="1"></el-col>
        </el-row>

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
      indice: null,
      datosDeposito: [],
      loading: false,
      cantidadTotalDeposito: 0,
      datosSacarDeposito: null,
    };
  },

  methods: {
    abrir(scope) {
      this.$refs.modal.abrir();
      this.id = scope.row.producto_id;
      this.indice = scope.$index
      this.datosDeposito = []
      this.cantidadTotalDeposito = 0
      this.datosSacarDeposito = null
      console.log(scope);
      console.log("id: " + scope.row.producto_id);
      console.log("indice: " + scope.$index);
      this.getDatos();
    },

    cerrar() {
      this.$refs.modal.cerrar();
    },

    async getDatos(){
      this.loading = true
      await this.axios.get("/api/depositoArticulo/obtenerDatos/" + this.id)
        .then(response =>{
            this.datosDeposito = response.data;   
            console.log(this.datosDeposito);
        })    
      this.loading = false
    },

    sumardatosSacarDeposito(cantidadSacada){
      this.cantidadTotalDeposito = this.cantidadTotalDeposito + cantidadSacada
    },

    enviarCantidadAUtilizarDeposito(){
      this.datosSacarDeposito = {
        indice: this.indice,
        cantidadUsar: this.cantidadTotalDeposito
      }
      this.$emit("update:cantidadSacarDeposito", this.datosSacarDeposito);
      this.cerrar()
    }
  },
};
</script>

<style></style>
