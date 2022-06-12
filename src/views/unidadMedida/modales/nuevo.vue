<template>
  <div>
    <modal 
        ref="modal" 
        titulo="Nueva unidad de medida" 
        :impedir-close="impedirClose"        
    >      
      <el-form
        label-width="120px"
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
        > Guardar</el-button>
      </template>
    
    </modal>
  </div>
</template>

<script>
  import { ElMessage, ElMessageBox } from 'element-plus'

  name:'nuevaUnidadMedida'
  export default {
    data() {
      return {
        impedirClose: false,
        form:{
          nombre: null,          
        },        
      }
    },

    methods:{
      abrir(){
        this.form.nombre = null,        

        this.$refs.modal.abrir()
      },

      cerrar(){
        this.$refs.modal.cerrar()
      },

      onSubmit(){
        let params = {
          nombre: this.form.nombre,          
        }

        this.axios.post(this.base_url + "/unidad-medida/crear", params)
          .then(response => {
            ElMessage({
                type: 'success',
                message: '¡Unidad de medida añadida con éxito!',
            })
            this.$emit('actualizarTabla')
            this.cerrar()
          })
      },

      deshabilitarBtnGuardar(){
        if (this.form.nombre == null || 
            this.form.nombre == ""
        ) 
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