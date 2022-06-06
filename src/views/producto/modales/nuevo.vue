<template>
  <div>
    <modal ref="modal" titulo="Nuevo producto" :impedir-close="impedirClose">
      <el-form
        label-width="120px"
      >
        <!-- Nombre -->
        <el-form-item label="Nombre" prop="nombre">
          <el-input v-model="form.nombre"></el-input>
        </el-form-item>

        <!-- Precio -->
        <el-form-item label="Precio" prop="precio">
          <el-input-number 
            v-model="form.precio" 
            :step="0.1" 
            :controls="false"
            style="width:100%; align: left"
          ></el-input-number>
        </el-form-item>

        <!-- Stock -->
        <el-form-item label="Stock" prop="stock">
          <el-input-number 
            v-model="form.stock"
            :controls="false"
            style="width:100%"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="onSubmit">Guardar</el-button>
      </template>
    </modal>
  </div>
</template>

<script>
  import { ElMessage, ElMessageBox } from 'element-plus'

  name:'nuevoProducto'
  export default {
    data() {
      return {
        url: 'http://localhost:8000/api/articulos/',
        form:{
          nombre: null,
          precio: null,
          stock: null,
        }
      }
    },

    methods:{
      abrir(){
        this.$refs.modal.abrir()
      },

      cerrar(){
        this.$refs.modal.cerrar()
      },

      onSubmit(){
        let params = {
          descripcion: this.form.nombre,
          precio: this.form.precio,
          stock: this.form.stock,
        }

        this.axios.post(this.url, params)
          .then(response => {
            ElMessage({
                type: 'success',
                message: '¡Producto añadido con éxito!',
            })
            this.cerrar()
          })
      }
    }
  }
</script>

<style>

</style>