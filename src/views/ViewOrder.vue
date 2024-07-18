<template>
   <div>
   <!-- 搜索框 -->
  <el-input v-model="searchKeyword" placeholder="请输入搜索关键字(顾客名字)" style="width: 1200px; margin-bottom: 20px;" />
  
   <!-- 表格 -->
   <el-table :data="displayedTableData" stripe style="width: 100%" class="order-table">
  <el-table-column prop="id" label="订单 ID" width="200" align="center" />
   <el-table-column prop="userName" label="顾客" width="200" align="center"/>
   <el-table-column prop="orderDate" label="下单时间" width="200" align="center" />
   <el-table-column prop="totalAmount" label="购买金额" width="200" align="center"/>
   <el-table-column prop="address" label="顾客地址" width="200" align="center"/>
   <el-table-column prop="phone" label="联系电话" width="200" align="center"/>
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
   </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import axios from 'axios';
  
  const tableData = ref([]);
  const currentPage = ref(1); // 当前页码
  const itemsPerPage = ref(4); // 每页显示的数据条数，根据实际需求设置
  const searchKeyword = ref('');
  
  const apiUrl = '/api/api/orders'; // 假设订单数据的 API URL
  
  const fetchData = async () => {
   try {
    console.log('请求 URL:', apiUrl);
    const response = await axios.get(apiUrl);
    console.log('API response:', response.data);
    tableData.value = response.data;
   } catch (error) {
    console.error('获取数据失败', error);
   }
  };
  
  const displayedTableData = computed(() => {
   const startIndex = (currentPage.value - 1) * itemsPerPage.value;
 const endIndex = startIndex + itemsPerPage.value;
   return filteredTableData.value.slice(startIndex, endIndex);
  });
  
  const filteredTableData = computed(() => {
   return tableData.value.filter(item => {
   return item.userName.toLowerCase().includes(searchKeyword.value.toLowerCase());
   });
  });
  
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
  .order-table .el-button {
   margin-left: 10px;
  }
  .pagination-container {
   display: flex;
   justify-content: center;
   margin-top: 20px;
  }
  </style>