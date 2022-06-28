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

          <el-table-column prop="date" label="Estado" >
            <template #default="props">
              <span v-if="props.row.producto_activo == 1">
                <el-tag class="ml-2" type="success">Activo</el-tag>
              </span>
              <span v-else>
                <el-tag class="ml-2" type="danger">Inactivo</el-tag>
              </span>
            </template>
          </el-table-column>

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
              />
              
            </template>
          </el-table-column>
          
        </el-table>

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
      datosDeposito: [],
      loading: false,
    };
  },

  methods: {
    abrir(id) {
      this.$refs.modal.abrir();
      this.id = id;
      this.datosDeposito = []
      console.log("id" + this.id);
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
  },
};
</script>

<style></style>
