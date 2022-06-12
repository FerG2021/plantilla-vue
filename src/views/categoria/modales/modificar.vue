<template>
  <div>
    <modal 
        ref="modal" 
        titulo="Modificar categoria" 
        :impedir-close="impedirClose"
    >
        <el-form
            label-width="120px"
            v-loading="loading"
            :rules="formRules"
        >
            <!-- Nombre -->
            <el-form-item label="Nombre" prop="nombre">
            <el-input v-model="form.nombre"></el-input>
            </el-form-item>
                    
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
        form:{
          nombre: null,          
        },
        id: null,
        categorias: [],
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

        this.getDatos()
        
      },

      cerrar(){
        this.$refs.modal.cerrar()
      },

      async getDatos(){
        await this.axios.get(this.base_url + "/categoria/obtenerDatos/" + this.id)
          .then(response =>{
            const respuestaApi = response.data
            console.log(respuestaApi)
           
            if (respuestaApi != null) {
              this.form.nombre = respuestaApi.nombre
              this.loading = false
            } else{
              this.cerrar()
            }
        })   
      },

      onSubmit(){
        let params = {
            id: this.id,
            nombre: this.form.nombre,           
        }

        this.axios.put(this.base_url + "/categoria/actualizar/" + this.id, params)
            .then(response => {
                ElMessage({
                    type: 'success',
                    message: '¡Categoria modificada con éxito!',
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
            this.form.nombre == "") 
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