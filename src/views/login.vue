<template>
  <div class="login-container">
    <div class="login-content">
      <h1 class="titel">助农购物后台管理</h1>
      <el-card class="login-card" shadow="hover">
        <h2 class="login-title">登录</h2>
        <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-width="100px" class="login-form">
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="loginForm.username"
              type="text"
              size="large"
              auto-complete="off"
              placeholder="账号"
            />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              size="large"
              auto-complete="off"
              placeholder="密码"
              @keyup.enter="handleLogin"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleLogin">登录</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const loginForm = reactive({
  username: '',
  password: ''
});

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
};

const loginFormRef = ref(null);
const router = useRouter();

const handleLogin = () => {
  loginFormRef.value.validate((valid) => {
    if (valid) {
      // 在这里执行登录逻辑
      ElMessage.success('登录成功');
      // 登录成功后跳转到home页面
      router.push('/home');
    } else {
      ElMessage.error('请填写完整信息');
      return false;
    }
  });
};
</script>

<style scoped>
.titel {
  margin-bottom: 100px;
  margin-top:50px;
  text-align: center;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
}

.login-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  
}

.login-card {
  width: 100%;
  padding: 20px;
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
}

.login-form {
  width: 100%;
}
</style>
