<template>
  <div>
    <modal ref="modal" titulo="Eliminar producto" :impedir-close="impedirClose">
      <div>
        <h3>¿Desea eliminar el producto?</h3>
            <div style="float:right">
                <el-button 
                    type="danger"
                    @click="cerrar()"
                >
                    Cancelar
                </el-button>
                <el-button 
                    type="primary"
                    @click="eliminar()"
                >
                    Confirmar
                </el-button>
            </div>
      </div>
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
          precio: null,
          stock: null,
        },
        id: null,
        articulos: [],
      }
    },

    methods:{
      abrir(id){
        this.id = null
        this.$refs.modal.abrir()
        this.id = id
      },

      cerrar(){
        this.$refs.modal.cerrar()
      },

      async eliminar(){
        await this.axios.delete(this.base_url + "/articulo/eliminar/" + this.id)
            .then(response =>{
                ElMessage({
                    message: 'Producto eliminado con éxito',
                    type: 'success',
                })    
                this.$emit('actualizarTabla')
                this.cerrar()
            }
        )   
      },
      
    }
  }
</script>

<style>

</style>