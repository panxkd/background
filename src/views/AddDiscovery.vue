<template>
  <h2>添加发现</h2>
  <el-form
    ref="newForm"
    :model="news"
    label-width="100px"
    style="max-width: 600px; margin: 20px auto;"
    @submit.native.prevent
  >
    <el-form-item label="标题" prop="title" :rules="[{ required: true, message: '请输入标题', trigger: 'blur' }]">
      <el-input v-model="news.title" placeholder="请输入标题" class="input-left"></el-input>
    </el-form-item>
    <el-form-item label="内容" prop="content" :rules="[{ required: true, message: '请输入内容', trigger: 'blur' }]">
      <el-input type="textarea" v-model="news.content" placeholder="请输入内容" class="input-left"></el-input>
    </el-form-item>
    <el-form-item label="图片类型" prop="type" :rules="[{ required: true, message: '请选择图片类型', trigger: 'change' }]">
      <el-select v-model="news.type" placeholder="请选择图片类型" class="input-left">
        <el-option label="text" value="text"></el-option>
        <el-option label="single_image" value="single_image"></el-option>
        <el-option label="three_images" value="three_images"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="addNew">添加发现</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      news: {
        title: '',
        content: '',
        type: ''
      }
    };
  },
  methods: {
    addNew() {
      this.$refs.newForm.validate((valid) => {
        if (valid) {
          axios.post('/api/api/news', this.news, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(response => {
            this.$message.success('添加成功');
            this.resetForm();
          })
          .catch(error => {
            this.$message.error('添加失败，请稍后重试');
          });
        } else {
          this.$message.error('请填写完整的信息');
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.newForm.resetFields();
      this.news = {
        title: '',
        content: '',
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
