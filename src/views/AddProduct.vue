<template>
  <h2>添加商品</h2>
  <el-form
    ref="productForm"
    :model="product"
    label-width="100px"
    style="max-width: 600px; margin: 20px auto;"
    @submit.native.prevent
  >
    <el-form-item label="商品名称" prop="name" :rules="[{ required: true, message: '请输入商品名称', trigger: 'blur' }]">
      <el-input v-model="product.name" placeholder="请输入商品名称" class="input-left"></el-input>
    </el-form-item>
    <el-form-item label="价格" prop="price" :rules="[{ required: true, message: '请输入商品价格', trigger: 'blur' }, { type: 'number', message: '价格必须为数字', trigger: 'blur' }]">
      <el-input v-model.number="product.price" placeholder="请输入商品价格" class="input-left"></el-input>
    </el-form-item>
    <el-form-item label="描述" prop="description">
      <el-input type="textarea" v-model="product.description" placeholder="请输入商品描述" class="input-left"></el-input>
    </el-form-item>
    <el-form-item label="商品类型" prop="type" :rules="[{ required: true, message: '请选择商品类型', trigger: 'change' }]">
      <el-select v-model="product.type" placeholder="请选择商品类型" class="input-left">
        <el-option label="家禽" value="家禽"></el-option>
        <el-option label="水产品" value="水产品"></el-option>
        <el-option label="肉类" value="肉类"></el-option>
        <el-option label="水果" value="水果"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="addProduct">添加商品</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      product: {
        name: '',
        price: null,
        description: '',
        type: ''
      }
    };
  },
  methods: {
    addProduct() {
      this.$refs.productForm.validate((valid) => {
        if (valid) {
          axios.post('/api/api/products', this.product, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(response => {
            this.$message.success('商品添加成功');
            this.resetForm();
          })
          .catch(error => {
            this.$message.error('添加失败，请稍后重试');
          });
        } else {
          this.$message.error('请填写完整的商品信息');
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.productForm.resetFields();
      this.product = {
        name: '',
        price: null,
        description: '',
        type: ''
      };
    }
  }
};
</script>

<style>
.input-left {
  text-align: left;
}
</style>
