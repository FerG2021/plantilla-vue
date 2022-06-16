<template>
  <div class="background-login">
    <el-card class="card-login">
      <template #header >            
          <div style="font-size: 40px; text-align: center">Bienvenido a ModulAr</div>
      </template>
      <div class="contenedor-login">
        <div class="formulario">
          <div class="material-icons">account_circle</div>
          <span v-if="$store.state.auth">{{  $store.state.user.name }}</span>
          <el-card>
            <el-form 
              label-width="120px" 
              ref="form"
              :model="form"
              :rules="rules"
              status-icon
            >
              <!-- email -->
              <el-form-item label="Email" prop="email">
                <el-input v-model="form.email" placeholder="Ingrese su email..."/>
              </el-form-item>

              <!-- contrasena -->
              <el-form-item label="Contraseña" prop="password">
                <el-input v-model="form.password"  placeholder="Ingrese su contraseña..." type="password"/>
              </el-form-item>

              <el-form-item>
                <el-button 
                  class="btnEnviar" 
                  type="primary" 
                  @click="login()"
                  :disabled="deshabilitarBtnIngresar()"
                >
                  Ingresar
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>

    export default {
        data() {
            return {
                user: {},
                form: {
                    email: "",
                    password: "",
                },
                rules: {
                    email: [
                        {
                            required: true,
                            message: "Por favor ingrese su mail.",
                            trigger: "change",
                        },
                    ],
                    password: [
                        {
                            required: true,
                            message: "Por favor ingrese su contraseña.",
                            trigger: "change",
                        },
                    ],
                },
            }
        },
        methods: {
            async login(){
                await this.$store.dispatch("login", this.form)
                return this.$router.replace("/")
            },

            me(){
                this.axios.get(this.base_url + "/user")
                    .then(res => {
                        console.log(res.data)
                        this.user = res.data;
                    }
                )
            },

            deshabilitarBtnIngresar(){
              if (this.form.email == null ||
                  this.form.email == "" ||
                  this.form.password == null ||
                  this.form.password == ""
              ) {
                return true
              } else {
                return false
              }
            },
        },
    }
</script>

<style scoped>
    .background-login{
        height: 100vh;
        background-color: var(--dark);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .card-login{
        width: 65%;
        height: 65%;
    }

    .contenedor-login{
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .material-icons{        
        width: 100%;
        text-align: center;
        font-size: 150px;
        display: block;
        color: var(--dark);
    }

    .formulario{
        width: 50%;
        height: 200px;
        text-align: center;
        display: block;
    }

    .btnEnviar{
        width: 100%;
        text-align: center;
    }
</style>