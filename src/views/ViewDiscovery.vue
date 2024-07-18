<template>
  <div>
    <!-- 搜索框 -->
    <el-input v-model="searchKeyword" placeholder="请输入搜索关键字(标题,内容,类型)" style="width: 1200px; margin-bottom: 20px;" />

    <!-- 表格 -->
    <el-table :data="displayedTableData" stripe style="width: 100%" class="product-table">
      <el-table-column prop="id" label="新闻 ID" width="200" align="center" />
      <el-table-column prop="title" label="标题" width="200" align="center" />
      <el-table-column prop="content" label="内容" width="200" align="center" />
      <el-table-column prop="type" label="图片类型" width="200" align="center" />
      <el-table-column label="图片" width="200" align="center">
        <template #default="scope">
          <el-carousel :interval="5000" type="card" height="100px">
            <el-carousel-item v-for="(image, index) in getImagesArray(scope.row.imageUrls)" :key="index">
              <el-image v-if="image" :src="image" fit="cover" style="width: 100px; height: 100px"></el-image>
            </el-carousel-item>
          </el-carousel>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
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
        <h3>编辑新闻</h3>
        <el-form @submit.prevent="handleSave">
          <el-form-item label="新闻 ID:" :label-width="'100px'">
            <el-input v-model="editForm.id" disabled />
          </el-form-item>
          <el-form-item label="标题:" :label-width="'100px'">
            <el-input v-model="editForm.title" />
          </el-form-item>
          <el-form-item label="内容:" :label-width="'100px'">
            <el-input v-model="editForm.content" />
          </el-form-item>
          <el-form-item label="图片类型:" :label-width="'100px'">
            <el-select v-model="editForm.type" placeholder="请选择新闻类型">
              <el-option
                v-for="(type, index) in typeOptions"
                :key="index"
                :label="type.label"
                :value="type.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="图片:" :label-width="'100px'">
            <div class="image-list">
              <div v-for="(image, index) in getImagesArray(editForm.imageUrls)" :key="index" class="image-item">
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
const currentPage = ref(1); // 当前页码
const itemsPerPage = ref(4); // 每页显示的数据条数，根据实际需求设置
const searchKeyword = ref('');
const editDialogVisible = ref(false);
const editForm = ref({
  id: '',
  title: '',
  content: '',
  type: '',
  imageUrls: '',
  uploadFiles: [],
  deleteImages: []
});

const typeOptions = ref([
  { label: 'text', value: 'text' },
  { label: 'single_image', value: 'single_image' },
  { label: 'three_images', value: 'three_images' },
]);

const apiUrl = '/api/api/news';

// 获取数据
const fetchData = async () => {
  try {
    const response = await axios.get(apiUrl);
    tableData.value = response.data || [];
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
    return (
      item.title.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      item.content.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      item.type.toLowerCase().includes(searchKeyword.value.toLowerCase())
    );
  });
});

const getImagesArray = (images) => {
  if (!images) return [];
  if (typeof images === 'string') {
    return images.split(','); // 将逗号分隔的字符串转换为数组
  }
  if (Array.isArray(images)) {
    return images;
  } else {
    ElMessage.error('传入的图片数据不是一个有效的数组或字符串');
    console.error('传入的图片数据不是一个有效的数组或字符串');
    return [];
  }
};

// 编辑新闻
const handleEdit = (row) => {
  editForm.value = { ...row, uploadFiles: [], deleteImages: [] };
  editDialogVisible.value = true;
};

// 删除新闻
const handleDelete = async (row) => {
  if (row && row.id) {
    if (window.confirm('确定要删除这条新闻吗?')) {
      try {
        await axios.delete(`${apiUrl}/${row.id}`);
        fetchData(); // 删除成功后重新获取数据
      } catch (error) {
        console.error('删除新闻失败', error);
      }
    }
  } else {
    ElMessage.error('无效的新闻数据');
  }
};

// 保存编辑
const handleSave = async () => {
  const formData = new FormData();
  formData.append('updates', JSON.stringify({
    title: editForm.value.title,
    content: editForm.value.content,
    type: editForm.value.type,
  }));

  if (editForm.value.uploadFiles) {
    editForm.value.uploadFiles.forEach(file => {
      formData.append('uploadFiles', file);
    });
  }

  try {
    await axios.post(`/api/api/news/${editForm.value.id}/updateFieldsAndImages`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    editDialogVisible.value = false;
    fetchData();
  } catch (error) {
    ElMessage.error('更新新闻失败');
    console.error('更新新闻失败', error);
  }
};

// 处理文件上传
const handleUploadImage = () => {
  const imageInput = document.querySelector('input[type=file]');
  imageInput.click();
};

const uploadImage = async (event) => {
  const files = event.target.files;
  if (!files.length) return;

  editForm.value.uploadFiles = Array.from(files); // 将文件存储在表单数据中
};

// 删除图片
const removeImage = async (index) => {
  const existingImages = getImagesArray(editForm.value.imageUrls);
  const [deleteImage] = existingImages.splice(index, 1); // 从现有图片中删除指定图片

  const formData = new FormData();
  formData.append('deleteImages', deleteImage);

  try {
    await axios.post(`/api/api/news/${editForm.value.id}/updateFieldsAndImages`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    editForm.value.imageUrls = existingImages.join(','); // 更新表单中的图片列表
    ElMessage.success('删除图片成功');
  } catch (error) {
    ElMessage.error('删除图片失败');
    console.error('删除图片失败', error);
  }
};

const handleSizeChange = (pageSize) => {
  itemsPerPage.value = pageSize;
  currentPage.value = 1; // 修改每页条数时，回到第一页
};

const handleCurrentChange = (current) => {
  currentPage.value = current;
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
  z-index: 999;
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
