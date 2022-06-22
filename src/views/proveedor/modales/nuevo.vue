<template>
  <div>
    <modal ref="modal" titulo="Nuevo proveedor" :impedir-close="impedirClose">
      
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

        <!-- Código -->
        <el-form-item label="Código" prop="codigo">
          <el-input-number 
            v-model="form.codigo"
            :controls="false"
            style="width: 100%"
          ></el-input-number>
        </el-form-item>

        <!-- Nombre -->
        <el-form-item label="Nombre" prop="nombre">
          <el-input v-model="form.nombre"></el-input>
        </el-form-item>

        <!-- Razón social -->
        <el-form-item label="Razón social" prop="razonSocial">
          <el-input v-model="form.razonSocial"></el-input>
        </el-form-item>

        <!-- CUIT -->
        <el-form-item label="CUIT" prop="cuit">
          <el-input-number 
            v-model="form.cuit"
            :controls="false"
            style="width: 100%"
          ></el-input-number>
        </el-form-item>

        <!-- Email -->
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>

        <!-- Activo -->
        <el-form-item label="Activo" prop="activo">
          <el-switch 
            v-model="form.activo" 
            active-text="SI"
            inactive-text="NO"
          />
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
        form:{
          id: null,
          codigo: null,
          nombre: null,
          razonSocial: null,
          cuit: null, 
          email: null,
          activo: false,
        },

        rules: {
          id: [
            {
              required: true,
              message: "Por favor ingrese el id del proveedor.",
              trigger: "change",
            },
          ],

          codigo: [
            {
              required: true,
              message: "Por favor ingrese el código del proveedor.",
              trigger: "change",
            },
          ],

          nombre: [
            {
              required: true,
              message: "Por favor ingrese el nombre del proveedor.",
              trigger: "change",
            },
          ],

          razonSocial: [
            {
              required: true,
              message: "Por favor ingrese la razon social del proveedor.",
              trigger: "change",
            },
          ],

          cuit: [
            {
              required: true,
              message: "Por favor ingrese el cuit del proveedor.",
              trigger: "change",
            },
          ],

          email: [
            {
              required: true,
              message: "Por favor ingrese el mail del proveedor.",
              trigger: "change",
            },
          ],         
        },
      }
    },

    created() {
      this.categoriaObtenerTodosSelect()
      this.unidadMedidaObtenerTodosSelect()
    },

    methods:{
      abrir(){
        this.form.id = null
        this.form.codigo = null
        this.form.nombre = null
        this.form.razonSocial = null
        this.form.cuit = null
        this.form.email = null
        this.form.activo = false

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

      async onSubmit(){
        let params = {
          id: this.form.id,
          codigo: this.form.codigo,
          nombre: this.form.nombre,
          razonSocial: this.form.razonSocial,
          cuit: this.form.cuit, 
          email: this.form.email,
          activo: this.form.activo,
        }

        const respuestaApi = await this.axios.post("/api/proveedor/crear", params)

        console.log(respuestaApi);

        if (respuestaApi.data.code == 200) {
          ElMessage({
            type: 'success',
            message: '¡Proveedor añadido con éxito!',
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
            this.form.codigo == null ||
            this.form.codigo == "" ||
            this.form.codigo == 0 ||
            this.form.nombre == null ||
            this.form.nombre == "" ||
            this.form.razonSocial == null ||
            this.form.razonSocial == "" ||
            this.form.cuit == null ||
            this.form.cuit == "" ||
            this.form.cuit == 0 ||
            this.form.email == null ||
            this.form.email == "" ||
            this.form.activo == null
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