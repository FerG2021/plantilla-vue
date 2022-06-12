<template>
  <div>
    <modal 
      ref="modal" 
      titulo="Nueva planificación" 
      :impedir-close="impedirClose"
      width="1100px"
    >
      <el-steps
        :active="active"
        finish-status="success"
        simple
        style="margin-top: 5px; margin-bottom: 5px"
      >
        <el-step title="Paso 1"></el-step>
        <el-step title="Paso 2"></el-step>
        <el-step title="Paso 3"></el-step>
        <el-step title="Paso 4"></el-step>
      </el-steps>

      <!-- Paso 1 -->
      <div v-show="active == 0" style="padding: 30px">
        <el-form
          label-width="120px"
        >
          <!-- Nombre -->
          <el-form-item label="Nombre obra" prop="nombreObra">
            <el-input v-model="form.nombreObra"></el-input>
          </el-form-item>

          <!-- Monto -->  
          <el-form-item label="Monto" prop="montoObra">
            <el-input-number 
              v-model="form.montoObra" 
              :step="0.1" 
              :controls="false"
              style="width:100%; align: left"
            ></el-input-number>
          </el-form-item>

          <!-- Mes de inicio y fin -->
          <el-form-item label="Fecha" prop="fechaObra">
            <el-date-picker
              v-model="form.fechaObra"
              type="monthrange"
              range-separator="A"
              start-placeholder="Mes inicio"
              end-placeholder="Mes fin"
            />
          </el-form-item>
          <!-- {{form.fechaObra}} -->

          <!-- Seleccion de materiales -->
          <h4 style="margin-top: 10px"><b>Selección de materiales</b></h4>
          
          <el-row 
            :gutter="10" 
            style="margin-top: 10px"
            v-loading="cargando"
          >
            <el-col :span="7">
              <span>Nombre del producto</span>
              <el-select 
                v-model="nombreProducto" 
                placeholder="Seleccione un producto" 
                filterable
                style="width: 100%"
                @change="tomarValor(nombreProducto)"
              >
                <el-option
                  v-for="item in productosSelect"
                  :key="item.id"
                  :label="item.descripcion"
                  :value="item.id"
                  style="width: 100%"
                />
              </el-select>
            </el-col>

            <el-col :span="6">
              <span>Unidad medida</span>
              <el-input 
                v-model="unidadMedidaProducto" 
                disabled
                style="width: 100%"
              />
            </el-col> 

            <el-col :span="6">
              <span>Categoría</span>
              <el-input 
                v-model="categoriaProducto" 
                disabled
                style="width: 100%"
              />
            </el-col>   

            <el-col :span="3">
              <span>Cantidad nec.</span>
              <el-input-number 
                v-model="cantidadNecesariaProducto" 
                :controls="false"
                style="width: 100%"
              />
            </el-col> 

            <el-col :span="2">
              <span style="color: white">Cantidad</span>
              <el-button 
                type="primary" 
                style="width: 100%"
                @click="agregarProducto()"
                :disabled="deshabilitarBtnAgregarProductosArrMatUtilizar()"
              >
                +
              </el-button>
            </el-col>            
          </el-row>

          <!-- Tabla para mostrar los productos necesarios con sus cantidades -->
          <div style="margin-top: 10px">
            <el-table :data="arrMaterialesAUsar" stripe style="width: 100%">
              <!-- Nombre -->
              <el-table-column prop="nombre" label="Nombre">
                <template #default="props">
                  <span>{{ props.row.nombre }}</span>
                </template>
              </el-table-column>

              <!-- Unidad de medida -->
              <el-table-column prop="unidadMedida" label="Un. medida">
                   <template #default="props">
                  <span>{{ props.row.unidadMedida }}</span>
                </template>
              </el-table-column>

              <!-- Categoria -->
              <el-table-column prop="categoria" label="Categoria" >
                   <template #default="props">
                  <span>{{ props.row.categoria }}</span>
                </template>
              </el-table-column>

              <!-- Cantidad necesaria -->
              <el-table-column prop="cantNecesaria" label="Cantidad nec." >
                   <template #default="props">
                  <span>{{ props.row.cantidadNecesaria }}</span>
                </template>
              </el-table-column>

              <!-- Eliminar -->
              <el-table-column label="Eliminar" width="120">
                <template #default="scope">
                  <el-button                    
                    type="danger"                    
                    circle 
                    @click="eliminar(scope.$index)"
                  >
                    <span class="material-icons">delete</span>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>


        </el-form>

        <div class="contenedorBtnSiguienteAtras">            
          <el-button  
            type="primary"    
            class="btnSiguiente"
            @click="active = 1"
          >
            Siguiente
          </el-button>
        </div>
      </div>

      <!-- Precio y stock -->
      <div v-show="active == 1" style="padding: 30px">
        <!-- Tabla para mostrar los productos necesarios con sus cantidades -->
        <div style="margin-top: 10px">
          <el-table :data="arrMaterialesAUsar" stripe style="width: 100%">
            <!-- Nombre -->
            <el-table-column prop="nombre" label="Nombre">
              <template #default="props">
                <span>{{ props.row.nombre }}</span>
              </template>
            </el-table-column>

            <!-- Unidad de medida -->
            <el-table-column prop="unidadMedida" label="Un. medida">
                  <template #default="props">
                <span>{{ props.row.unidadMedida }}</span>
              </template>
            </el-table-column>

            <!-- Categoria -->
            <el-table-column prop="categoria" label="Categoria" >
                  <template #default="props">
                <span>{{ props.row.categoria }}</span>
              </template>
            </el-table-column>

            <!-- Cantidad necesaria -->
            <el-table-column prop="cantNecesaria" label="Cantidad nec." >
                  <template #default="props">
                <span>{{ props.row.cantidadNecesaria }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

          <div class="contenedorBtnSiguienteAtras">
            <el-button  
              type="info"    
              class="btnAtras"
              @click="active = 0"
            >
              Atrás
            </el-button>

            <el-button  
              type="primary"    
              class="btnSiguiente"
              @click="active = 2"

            >
              Siguiente
            </el-button>
          </div>
      </div>

      <!-- Fraccionable -->
      <div v-show="active == 2" style="padding: 30px">


          <div class="contenedorBtnSiguienteAtras">
            <el-button  
              type="info"    
              class="btnAtras"
              @click="active = 1"
            >
              Atrás
            </el-button>
            <el-button  
              type="primary"    
              class="btnSiguiente"
              @click="active = 3"

            >
              Siguiente
            </el-button>
          </div>
      </div>

      <!-- Promocion -->
      <div v-show="active == 3" style="padding: 30px">


          <div class="contenedorBtnSiguienteAtras">
            <el-button  
              type="info"    
              class="btnAtras"
              @click="active = 2"
            >
              Atrás
            </el-button>
            <el-button  
              type="primary"    
              class="btnSiguiente"
              @click="active = 4"

            >
              Guardar
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
          nombreObra: null,
          montoObra: null,
          fechaObra: null,
          producto: null,
        },

        cargando: false,
        active: 0,

        // valores para tomar el producto del select y agregarlos al array
        idProducto: null,
        nombreProducto: null,
        unidadMedidaProducto: null,
        categoriaProducto: null,
        cantidadNecesariaProducto: null,

        productosSelect: [],
        arrMaterialesAUsar: [],


      }
    },

    created() {
      this.obtenerProductosSelect()
    },


    methods:{
      abrir(){      
        // formulario
        this.form.nombreObra = null
        this.form.montoObra = null
        this.form.fechaObra = null
        this.form.producto = null
        
        // Seleccion de materiales
        this.idProducto = null
        this.nombreProducto = null
        this.unidadMedidaProducto = null
        this.categoriaProducto = null
        this.cantidadProducto = null
        this.$refs.modal.abrir()
      },

      cerrar(){
        this.$refs.modal.cerrar()
      },

      async obtenerProductosSelect(){
        this.cargando = true
        await this.axios.get(this.base_url + "/articulo/obtenerTodos")
          .then(response => {
            this.productosSelect = response.data
            console.log(this.productosSelect)
          })
        this.cargando = false        
      },

      tomarValor(id){
        this.productosSelect.forEach((elemento) =>{
          if (elemento.id == id) {
            console.log(elemento)
            this.idProducto = elemento.id
            this.nombreProducto = elemento.descripcion
            this.unidadMedidaProducto = elemento.unidadMedida.nombre
            this.categoriaProducto = elemento.categoria.nombre
          }
        })
      },

      deshabilitarBtnAgregarProductosArrMatUtilizar(){
        if (
          this.idProducto == null ||
          this.nombreProducto == null ||
          this.nombreProducto == "" || 
          this.unidadMedidaProducto == null ||
          this.unidadMedidaProducto == "" ||
          this.categoriaProducto == null ||
          this.categoriaProducto == "" || 
          this.cantidadNecesariaProducto == null ||
          this.cantidadNecesariaProducto == "" || 
          this.cantidadNecesariaProducto == 0
        ) {
          return true
        } else {
          return false
        }
      },

      agregarProducto(){
        let fila = {
          id: this.idProducto,
          nombre: this.nombreProducto,
          unidadMedida: this.unidadMedidaProducto,
          categoria: this.categoriaProducto,
          cantidadNecesaria: this.cantidadNecesariaProducto,
        }

        this.arrMaterialesAUsar.push(fila)

        this.idProducto = null
        this.nombreProducto = null
        this.unidadMedidaProducto = null
        this.categoriaProducto = null
        this.cantidadNecesariaProducto = null
      },

      eliminar(index){        
        this.arrMaterialesAUsar.splice(index, 1)
      },

      getParamsProducto(query){
        let params = {
          nombre: query,
        };
        return params;
      },
    }
  }
</script>

<style scoped>
  .contenedorBtnSiguienteAtras {
    display: flex;
    width: 100%;
    margin-top: 10px;
  }

  .btnSiguiente {
    margin: auto;
    margin-right: 10px;
  }

</style>