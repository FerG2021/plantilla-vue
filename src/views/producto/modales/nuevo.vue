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

        <!-- Unidad de medida -->
        <el-form-item label="Unid. de medida" prop="unidadMedida">
          <el-select v-model="form.unidadMedida" class="m-2" placeholder="Seleccione una unidad de medida" style="width: 100%">
            <el-option
              v-for="item in unidadMedidaSelect"
              :key="item.id"
              :label="item.nombre"
              :value="item.id"
              style="width: 100%"
            />
          </el-select>
        </el-form-item>


        <!-- Categoria -->
        <el-form-item label="Categoria" prop="categoria">
          <el-select v-model="form.categoria" class="m-2" placeholder="Seleccione una categoria" style="width: 100%">
            <el-option
              v-for="item in categoriasSelect"
              :key="item.id"
              :label="item.nombre"
              :value="item.id"
              style="width: 100%"
            />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button 
          type="primary"
          @click="onSubmit()"
          :disabled="deshabilitarBtnGuardar()"
        > Guardar</el-button>
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
        url: 'http://localhost:8000/api/articulo/',
        form:{
          nombre: null,
          precio: null,
          stock: null,
          unidadMedida: null,
          categoria: null,
        },
        categoriasSelect: [],
        unidadMedidaSelect: [],

      }
    },

    created() {
      this.categoriaObtenerTodosSelect()
      this.unidadMedidaObtenerTodosSelect()
    },

    methods:{
      abrir(){
        this.form.nombre = null,
        this.form.precio = null,
        this.form.stock = null,
        this.form.unidadMedida = null,
        this.form.categoria = null,

        this.$refs.modal.abrir()
      },

      cerrar(){
        this.$refs.modal.cerrar()
      },

      async categoriaObtenerTodosSelect(){
        await this.axios.get(this.base_url + "/categoria/obtenerTodosSelect")
          .then(response => {
            this.categoriasSelect = response.data
            console.log(this.categoriasSelect)
          });
      },

      async unidadMedidaObtenerTodosSelect(){
        await this.axios.get(this.base_url + "/unidad-medida/obtenerTodosSelect")
          .then(response => {
            this.unidadMedidaSelect = response.data
            console.log(this.categoriasSelect)
          });
      },

      onSubmit(){
        let params = {
          descripcion: this.form.nombre,
          precio: this.form.precio,
          stock: this.form.stock,
          idUnidadMedida: this.form.unidadMedida,
          idCategoria: this.form.categoria
        }

        this.axios.post(this.base_url + "/articulo/crear", params)
          .then(response => {
            ElMessage({
                type: 'success',
                message: '¡Producto añadido con éxito!',
            })
            this.$emit('actualizarTabla')
            this.cerrar()
          })
      },

      deshabilitarBtnGuardar(){
        if (this.form.nombre == null || 
            this.form.nombre == "" ||
            this.form.precio == null ||
            this.form.precio == 0 ||
            this.form.precio == "" ||
            this.form.stock == null ||
            this.form.stock == 0 ||
            this.form.stock == "" ||
            this.form.categoria == null ||
            this.form.categoria == 0 ||
            this.form.categoria == "") 
        {
          return true    
        } else {
          return false
        }
      },
    }
  }
</script>

<style>

</style>