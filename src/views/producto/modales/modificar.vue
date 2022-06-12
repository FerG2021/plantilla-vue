<template>
  <div>
    <modal ref="modal" titulo="Modificar producto" :impedir-close="impedirClose">
      <el-form
        label-width="120px"
        v-loading="loading"
        :rules="formRules"
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
          <el-select v-model="form.unidadMedida" class="m-2" placeholder="Seleccione una unidad de medida" style="width: 100%" @change="cambiarValorIDUnMed()">
            <el-option
              v-for="item in unidadMedidaSelect"
              :key="item.id"
              :label="item.nombre"
              :value="item.id"
              style="width: 100%"
            />
          </el-select>
        </el-form-item>
        <!-- {{form.idUnidadMedida}} -->

        <!-- Categoria -->
        <el-form-item label="Categoria" prop="categoria">
          <el-select v-model="form.categoria" class="m-2" placeholder="Seleccione una categoria" style="width: 100%" @change="cambiarValorIDCategoria()">
            <el-option
              v-for="item in categoriasSelect"
              :key="item.id"
              :label="item.nombre"
              :value="item.id"
              style="width: 100%"
            />
          </el-select>
        </el-form-item>
        <!-- {{form.idCategoria}} -->


      </el-form>
      <template #footer>
        <el-button 
          type="primary" 
          @click="onSubmit()"
          :disabled="deshabilitarBtnGuardar()"
        >Guardar</el-button>
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
          idUnidadMedida: null,
          categoria: null,
          idCategoria: null,
        },
        id: null,
        articulos: [],
        loading: false,


        // formRules: {
        //   nombre: [
        //     {
        //       required: true,
        //       message: "Por favor introduzca el nombre.",
        //       trigger: "change",
        //     },
        //   ],
          
        //   precio: [
        //     {
        //       required: true,
        //       message: "Por favor introduzca el precio.",
        //       trigger: "change",

        //     },
        //   ],

        //   stock: [
        //     {
        //       required: true,
        //       message: "Por favor introduzca el stock.",
        //       trigger: "change",            
        //     },
        //   ],
        // },
      }
    },

    methods:{
      abrir(id){
        this.loading = true
        this.id = null
        this.id = id

        this.$refs.modal.abrir()

        // limpio los campos
        this.form.nombre = null
        this.form.precio = null
        this.form.stock = null
        this.form.unidadMedida = null
        this.form.idUnidadMedida = null,
        this.form.categoria = null,
        this.form.idCategoria = null,
        

        this.getDatos()
        this.categoriaObtenerTodosSelect()
        this.unidadMedidaObtenerTodosSelect()
        
      },

      cerrar(){
        this.$refs.modal.cerrar()
      },

      async getDatos(){
        await this.axios.get(this.base_url + "/articulo/obtenerDatos/" + this.id)
          .then(response =>{
            const respuestaApi = response.data
            console.log(respuestaApi)
           
            if (respuestaApi != null) {
              this.form.nombre = respuestaApi.descripcion
              this.form.precio = respuestaApi.precio
              this.form.stock = respuestaApi.stock
              this.form.unidadMedida = respuestaApi.unidadMedida.nombre
              this.form.idUnidadMedida = respuestaApi.unidadMedida.id
              this.form.categoria = respuestaApi.categoria.nombre
              this.form.idCategoria = respuestaApi.categoria.id

              this.loading = false
            } else{
              this.cerrar()
            }
        })   
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

      cambiarValorIDUnMed(){
        this.form.idUnidadMedida = this.form.unidadMedida
      },

      cambiarValorIDCategoria(){
        this.form.idCategoria = this.form.categoria
      },

      onSubmit(){
        let params = {
            id: this.id,
            descripcion: this.form.nombre,
            precio: this.form.precio,
            stock: this.form.stock,
            idCategoria: this.form.idCategoria,
            idUnidadMedida: this.form.idUnidadMedida,
        }

        this.axios.put(this.base_url + "/articulo/actualizar/" + this.id, params)
            .then(response => {
                ElMessage({
                    type: 'success',
                    message: '¡Producto modificado con éxito!',
                })
                this.$emit('actualizarTabla')
                this.cerrar()
            })
            .catch(error => {
                console.log(error)
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
            this.form.stock == "") 
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