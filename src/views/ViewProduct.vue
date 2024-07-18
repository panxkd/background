<template>
  <div>
    <!-- 搜索框 -->
    <el-input v-model="searchKeyword" placeholder="请输入搜索关键字(商品名字)" style="width: 1200px; margin-bottom: 20px;" />

    <!-- 表格 -->
    <el-table :data="displayedTableData" stripe style="width: 100%" class="product-table">
      <el-table-column prop="id" label="商品 ID" width="170" align="center" />
      <el-table-column prop="name" label="商品名字" width="170" align="center"/>
      <el-table-column prop="price" label="商品价格" width="170" align="center" />
      <el-table-column prop="description" label="商品描述" width="170" align="center"/>
      <el-table-column prop="type" label="商品类型" width="170" align="center"/>
      <el-table-column label="商品图片" width="170" align="center">
        <template #default="scope">
          <el-carousel :interval="5000" type="card" height="100px">
            <el-carousel-item v-for="(image, index) in getImagesArray(scope.row.images)" :key="index">
              <el-image v-if="image" :src="image" fit="cover" style="width: 100px; height: 100px"></el-image>
            </el-carousel-item>
          </el-carousel>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="170" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">修改</el-button>
          <el-button link type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="itemsPerPage"
        :total="filteredTableData.length"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 自定义编辑框 -->
    <div v-if="editDialogVisible" class="edit-dialog">
      <div class="dialog-content">
        <h3>编辑商品</h3>
        <el-form @submit.prevent="handleSave">
          <el-form-item label="商品 ID:" :label-width="'100px'">
            <el-input v-model="editForm.id" disabled />
          </el-form-item>
          <el-form-item label="商品名字:" :label-width="'100px'">
            <el-input v-model="editForm.name" />
          </el-form-item>
          <el-form-item label="商品价格:" :label-width="'100px'">
            <el-input v-model="editForm.price" />
          </el-form-item>
          <el-form-item label="商品描述:" :label-width="'100px'">
            <el-input v-model="editForm.description" />
          </el-form-item>
          <el-form-item label="商品类型:" :label-width="'100px'">
            <el-select v-model="editForm.type" placeholder="请选择商品类型">
              <el-option
                v-for="(type, index) in typeOptions"
                :key="index"
                :label="type.label"
                :value="type.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="商品图片:" :label-width="'100px'">
            <div class="image-list">
              <div v-for="(image, index) in getImagesArray(editForm.images)" :key="index" class="image-item">
                <el-image :src="image" fit="cover" style="width: 100px; height: 100px"></el-image>
                <el-button link type="primary" size="small" @click="removeImage(index)">删除</el-button>
              </div>
            </div>
            <el-button type="primary" @click="handleUploadImage">上传图片</el-button>
          </el-form-item>
          <div class="dialog-footer">
            <el-button type="default" @click="editDialogVisible = false">取消</el-button>
            <el-button type="primary" native-type="submit">保存</el-button>
          </div>
        </el-form>
      </div>
    </div>

    <input type="file" ref="imageInput" @change="uploadImage" style="display: none" multiple />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

const tableData = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(4);
const searchKeyword = ref('');
const editDialogVisible = ref(false);
const editForm = ref({
  id: '',
  name: '',
  price: '',
  description: '',
  type: '', // 修改为 selectedType
  images: ''
});

const typeOptions = ref([
  { label: '家禽', value: '家禽' },
  { label: '水产品', value: '水产品' },
  { label: '水果', value: '水果' },
  { label: '农作物', value: '农作物' }
]);

const apiUrl = '/api/api/products';

const fetchData = async () => {
  try {
    const response = await axios.get(apiUrl);
    tableData.value = response.data || [];
    console.log(tableData.value); // 检查每个商品是否有 selectedType
  } catch (error) {
    ElMessage.error('获取数据失败');
    console.error('获取数据失败', error);
    tableData.value = [];
  }
};

const displayedTableData = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return filteredTableData.value.slice(startIndex, endIndex);
});

const filteredTableData = computed(() => {
  return tableData.value.filter(item => {
    return item.name.toLowerCase().includes(searchKeyword.value.toLowerCase());
  });
});

const getImagesArray = (images) => {
  if (!images) return [];
  try {
    const imageArray = JSON.parse(images);
    
    return Array.isArray(imageArray) ? imageArray : [];
    
  } catch (error) {
    ElMessage.error('解析图片URL失败');
    console.error('解析图片URL失败', error);
    return [];
  }
};

const handleDelete = async (row) => {
  if (row && row.id) {
    if (window.confirm('确定要删除这个商品吗?')) {
      try {
        await axios.delete(`${apiUrl}/${row.id}`);
        fetchData();
      } catch (error) {
        ElMessage.error('删除商品失败');
        console.error('删除商品失败', error);
      }
    }
  } else {
    ElMessage.error('无效的商品数据');
    console.error('无效的商品数据', row);
  }
};

const handleEdit = (row) => {
  editForm.value = { ...row };
  editDialogVisible.value = true;
};

const handleSave = async () => {
  try {
    const existingProduct = tableData.value.find(item => item.id === editForm.value.id);
    if (existingProduct && existingProduct.id !== editForm.value.id) {
      window.alert('已存在相同的商品ID');
      return;
    }

    await axios.put(`${apiUrl}/${editForm.value.id}`, editForm.value);
    editDialogVisible.value = false;
    fetchData();
  } catch (error) {
    ElMessage.error('更新商品失败');
    console.error('更新商品失败', error);
  }
};

const handleSizeChange = (pageSize) => {
  itemsPerPage.value = pageSize;
  currentPage.value = 1;
};

const handleCurrentChange = (current) => {
  currentPage.value = current;
};

const handleUploadImage = () => {
  const imageInput = document.querySelector('input[type=file]');
  imageInput.click();
};

const uploadImage = async (event) => {
  const files = event.target.files;
  if (!files.length) return;

  const formData = new FormData();
  const productId = editForm.value.id;
  for (const file of files) {
    formData.append('files', file);
  }

  try {
    const response = await axios.post(`/api/api/products/${productId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const existingImages = getImagesArray(editForm.value.images);
    const newImages = response.data;
    editForm.value.images = JSON.stringify([...existingImages, ...newImages]);
    console.log('上传图片成功');
    console.log(newImages);
  } catch (error) {
    ElMessage.error('上传图片失败');
    console.error('上传图片失败', error);
  }
};

const removeImage = async (index) => {
  const existingImages = getImagesArray(editForm.value.images);
  const deleteImages = existingImages.splice(index, 1);
  
  const formData = new FormData();
 formData.append('deleteImages', deleteImages);
  try {
    await axios.post(`/api/api/products/${editForm.value.id}/updateFieldsAndImages`, formData,{
      header:{
        'Content-Type': 'multipart/form-data',
      }
    });
    editForm.value.images = JSON.stringify(existingImages);
    ElMessage.success('删除图片成功');
  } catch (error) {
    ElMessage.error('删除图片失败');
    console.error('删除图片失败', error);
  }
};

onMounted(fetchData);
</script>

<style scoped>
.product-table .el-button {
  margin-left: 10px;
}
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.edit-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index:999;
}
.dialog-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
}
.dialog-footer {
  text-align: right;
}
.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.image-item {
  position: relative;
  display: inline-block;
}
.image-item .el-button {
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
}
</style>
