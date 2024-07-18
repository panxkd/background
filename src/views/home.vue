<template>
  <div class="common-layout">
    <el-container>
      <!-- 头部 -->
      <el-header class="titel">助农购物小程序后台管理系统</el-header>
      
      <el-container>
        <!-- 侧边栏 -->
        <el-aside width="200px">
          <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
            @select="handleSelect"
          >
            <el-sub-menu index="1">
              <template #title>
                <span>商品管理</span>
              </template>
              <el-menu-item index="1-1">查看商品</el-menu-item>
              <el-menu-item index="1-2">添加商品</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title>
                <span>订单管理</span>
              </template>
              <el-menu-item index="2-1">查看订单</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="3">
              <template #title>
                <span>发现管理</span>
              </template>
              <el-menu-item index="3-1">查看发现</el-menu-item>
              <el-menu-item index="3-2">添加发现</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        
        <!-- 主内容区域 -->
        <el-main>
          <component :is="currentComponent" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, defineComponent } from 'vue';

// 引入各个组件
import ViewProduct from './ViewProduct.vue';
import AddProduct from './AddProduct.vue';
import ViewOrder from './ViewOrder.vue';
import ViewDiscovery from './ViewDiscovery.vue';
import AddDiscovery from './AddDiscovery.vue';

const currentComponent = ref(ViewProduct);

const handleSelect = (key) => {
  switch (key) {
    case '1-1':
      currentComponent.value = ViewProduct;
      break;
    case '1-2':
      currentComponent.value = AddProduct;
      break;
    case '2-1':
      currentComponent.value = ViewOrder;
      break;
    case '3-1':
      currentComponent.value = ViewDiscovery;
      break;
    case '3-2':
      currentComponent.value = AddDiscovery;
      break;
  }
};
</script>

<style scoped>
.titel {
      display: flex;
    align-items: center; /* 垂直居中 */
    
  border-bottom: 1px solid #dcdfe6;
}
.common-layout {
  height: 100vh;
}
.el-menu-vertical-demo {
  height: 100%;
}
</style>
