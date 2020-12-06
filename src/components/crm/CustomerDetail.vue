<template>
  <div>
    <van-nav-bar title="客户详情"
                 @click-left="onBackClick"
                 left-arrow left-text="返回">
    </van-nav-bar>
    <van-tabs sticky style="margin-bottom: 50px;">
      <van-tab title="基本信息">
        <CustomerInfo v-bind:customer="customer"/>
      </van-tab>
      <van-tab title="跟进信息">
        <CustomerFollowupList ref="followupList" :cus-id="$route.params.id"/>
      </van-tab>
      <van-tab title="操作记录">
        <OperationLogList ref="optLogList" :biz-id="$route.params.id"/>
      </van-tab>
    </van-tabs>

    <van-button type="primary"
                @click="functionVisible=true"
                style="position: fixed;bottom: 0px;left:0px;width: 100%;">功能区
    </van-button>

    <van-popup v-model="functionVisible" position="bottom" style="height:40%;width:100%">
      <van-grid>
        <van-grid-item icon="photo-o" :text="followupOrProcessName"
                       :to="{name:'followupEditor',params:{cusId:customer.id,cusStatus:customer.cusStatus}}">
        </van-grid-item>
        <van-grid-item icon="photo-o" text="联系客户" @click="onContactClick">
        </van-grid-item>
        <van-grid-item v-if="customer.cusStatus!=='WaitProcess'" icon="photo-o"
                       :to="{name:'upDownEditor',params:{cusId:customer.id,cusStatus:customer.cusStatus}}"
                       :text="upOrDownName">
        </van-grid-item>
        <van-grid-item icon="photo-o" text="编辑客户" @click="onCustomerEditClick"></van-grid-item>
        <van-grid-item v-if="customer.cusOwnerType === 'Company'" icon="photo-o" text="拉私客户" @click="onCustomerHideOrOpenClick"></van-grid-item>
        <van-grid-item v-if="customer.cusOwnerType === 'Hide'" icon="photo-o" text="公开客户" @click="onCustomerHideOrOpenClick"></van-grid-item>
      </van-grid>
    </van-popup>

    <CustomerEditor ref="customerEditor" :editor="true" :visible="customerEditVisible"
                    :on-submit-ok="onCustomerEditSubmitOk" :on-cancel="onCustomerEditCancel"/>

  </div>
</template>

<script>
import {NavBar, Tabs, Tab, Popup, Row, Col, Button, Sticky, Dialog, Grid, GridItem} from 'vant';
import {request} from "../base/CiiUtils";
import CustomerInfo from './CustomerInfo';
import OperationLogList from "../basic/log/OperationLogList";
import CustomerFollowupList from "./followup/CustomerFollowupList";
import CustomerEditor from "./CustomerEditor";

export default {
  name: "CustomerDetail",
  components: {
    CustomerEditor,
    CustomerFollowupList,
    CustomerInfo,
    OperationLogList,
    [NavBar.name]: NavBar,
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
    [Popup.name]: Popup,
    [Row.name]: Row,
    [Col.name]: Col,
    [Button.name]: Button,
    [Sticky.name]: Sticky,
    [Dialog.Component.name]: Dialog.Component,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem
  },
  data: function () {
    return {
      customer: {},
      functionVisible: false,
      customerEditVisible: false
    }
  },
  computed: {
    upOrDownName: function () {
      if (this.customer.cusStatus === 'HasDown') {
        return "上架客户";
      } else {
        return '下架客户';
      }
    },
    followupOrProcessName: function () {
      if (this.customer.cusStatus === 'WaitProcess') {
        return "处理客户";
      } else {
        return '新增跟进';
      }
    }
  },
  beforeRouteEnter: function (to, from, next) {
    next((vm) => {
      if (from.name !== 'followupEditor') {
        vm.loadData();
        if (vm.$refs) {
          if (vm.$refs.followupList) {
            vm.$refs.followupList.loadData(true);
          }
          if (vm.$refs.optLogList) {
            vm.$refs.optLogList.loadData(true);
          }
        }
      }
    });
  },
  methods: {
    loadData: function () {
      request({
        conf: {
          url: 'customerIndustry/detail',
          data: {
            entity: {
              id: this.$route.params.id
            }
          }
        },
        success: (response) => {
          this.customer = response.result;
        }
      })
    },
    onBackClick: function () {
      this.$router.back()
    },
    onContactClick: function () {
      request({
        conf: {
          url: 'customerIndustry/callPhone',
          data: {
            entity: {
              id: this.$route.params.id
            }
          }
        },
        success: (response) => {
          Dialog.confirm({
            title: '电话号码如下',
            message: response.result,
            confirmButtonText: '拨号'
          }).then(() => {
            window.location.href = 'tel:' + response.result;
          }).catch(() => {

          })
        }
      })
    },

    onCustomerHideOrOpenClick:function (){
      if (this.customer.cusOwnerType == "Company" || this.customer.cusOwnerType == "Hide") {
        request({
          conf: {
            url: this.customer.cusOwnerType == "Company" ? 'customerIndustry/hide' : 'customerIndustry/open',
            data: {
              entity: {
                id: this.customer.id
              }
            }
          },
          success: () => {
            // this.onMenuSelect({key: this.state.cusOwnerType});
            this.loadData();
          },
        });
      }
    },

    onCustomerEditClick() {
      this.customerEditVisible = true;
      this.$refs.customerEditor.initCurrentData(this.customer);
    },
    onCustomerEditCancel() {
      this.customerEditVisible = false;
    },
    onCustomerEditSubmitOk() {
      this.customerEditVisible = false;
      this.loadData();
    }
  }
}
</script>

<style scoped>

</style>