<template>
  <div>
    <modal 
        ref="modal" 
        titulo="Nuevo rubro" 
        :impedir-close="impedirClose"        
    >      
      <el-form
        label-width="120px"
        ref="form"
        :model="form"
        :rules="rules"
        status-icon
      >
        <!-- ID -->
        <el-form-item label="ID" prop="id">
          <el-input-number 
            v-model="form.id"
            :controls="false"
            style="width: 100%"
          ></el-input-number>
        </el-form-item>

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
          id: null,
          nombre: null,          
        },    
        
        rules: {
          id: [
            {
              required: true,
              message: "Por favor ingrese el id del rubro.",
              trigger: "change",
            },
          ],

          nombre: [
            {
              required: true,
              message: "Por favor ingrese el nombre del rubro.",
              trigger: "change",
            },
          ],
        },
      }
    },

    methods:{
      abrir(){
        this.form.id = null
        this.form.nombre = null

        this.$refs.modal.abrir()
      },

      cerrar(){
        this.$refs.modal.cerrar()
      },

      async onSubmit(){
        let params = {
          id: this.form.id,
          nombre: this.form.nombre,          
        }

        const respuestaApi = await this.axios.post("/api/rubro/crear", params)

        if (respuestaApi.data.code == 200) {
          ElMessage({
            type: 'success',
            message: '¡Rubro añadido con éxito!',
          })
          this.$emit('actualizarTabla')
          this.cerrar()
        } else {
          if (respuestaApi.data.code == 400) {
            let erroresMostrar = "// ";
            let erorres = Object.values(respuestaApi.data.data)

            erorres.forEach((elemento) => {                
              erroresMostrar = erroresMostrar + " " + elemento + " //";
            })

            ElMessage({
              type: 'error',
              grouping: true,
              message: erroresMostrar,
              duration: 5000,
            })
          }
        }
        

      },

      deshabilitarBtnGuardar(){
        if (this.form.id == null ||
            this.form.id == "" ||
            this.form.id == 0 ||
            this.form.nombre == null || 
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