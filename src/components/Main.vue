<template>
  <div style="margin-top: 100px">
    <div style="width: 20%;" class="box">
      <div style="padding: 24px">
        <div>
          <el-form v-model="auth" label-width="50px">
            <el-form-item label="用户">
              <el-input v-model="auth.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="auth.password" type="password"></el-input>
            </el-form-item>
            <el-col :span="8">
              <el-form-item label="修改">
                <el-switch v-model="options.write"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="删除">
                <el-switch v-model="options.delete"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="新增">
                <el-switch v-model="options.create"></el-switch>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
        <div>
          <el-card class="box-card">
            <div slot="header" class="clearfix text">
              <span>Tips: </span>
            </div>
            <div class="text item">
              1.通过选项配置操作时是否需要认证
            </div>
            <div class="text item">
              2.默认选项与后台无关联,只是惯用逻辑
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <div style="width: 50%;" class="box">
      <div style="padding: 24px">
        <el-row>
          <el-form :inline="true" size="mini" label-width="60px" style="float: left" title="">
            <el-form-item>
              <el-button size="mini" type="primary" @click="createRootNode">新增根节点</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <el-row>
          <el-tree
            :props="props"
            :load="loadChildren"
            lazy
            ref="tree"
            node-key="key"
            :expand-on-click-node="false"
          >
        <span class="el-tree-node custom-tree-node" slot-scope="{node, data}">
          <span>
            <i class="node-key">{{data.name}}</i>
            <i v-if="data.value !== ''">{{' : '}}</i>
            <i class="node-value">{{data.value}}</i></span>
          <span>
            <el-button type="text" size="mini" @click="() => showWriteNode(node)">
              修改
            </el-button>
            <el-button type="text" size="mini" @click="() => showDeleteNode(node)">
              删除
            </el-button>
            <el-button type="text" size="mini" @click="() => showCreateChild(node)">
              新增子节点
            </el-button>
          </span>
        </span>
          </el-tree>
        </el-row>
      </div>
    </div>
    <create-child
      :path="path.create"
      :auth.sync='auth'
      :options.sync="options"
      ref="create-child"
      @reloadNode="reloadNode"/>

    <write-node
      :path="path.write"
      :auth.sync="auth"
      :options.sync="options"
      ref="write-node"
      @reloadNode="reloadNode"/>
    <delete-node
      :path="path.delete"
      :auth.sync="auth"
      :options.sync="options"
      ref="delete-node"
      @reloadNode="reloadNode"/>
  </div>
</template>

<script>
    import {getChildren} from "@/api";
    import CreateChild from "@/components/CreateChild";
    import WriteNode from "@/components/WriteNode";
    import DeleteNode from "@/components/DeleteNode";

    export default {
        name: "Main",
        components: {
            CreateChild,
            WriteNode,
            DeleteNode
        },
        data() {
            return {
                props: {
                    label: 'name',
                    isLeaf: 'leaf'
                },
                auth: {
                    username: '',
                    password: '',
                },
                options: {
                    create: false,
                    delete: false,
                    write: false
                },
                path: {
                    create: '',
                    delete: '',
                    write: ''
                }
            }
        },
        methods: {
            dirname(node) {
                let path = ''
                let currentNode = node
                while (currentNode.level !== 0) {
                    path = '/' + currentNode.data.name + path;
                    currentNode = currentNode.parent;
                }
                return path;
            },
            loadChildren(node, resolve) {
                let path = this.dirname(node);
                getChildren(path).then(res => {
                    resolve(res.data.data)
                }).catch(err => {
                    console.log(err)
                    this.$message.error('加载数据失败')
                    resolve([])
                })
            },
            showCreateChild(node) {
                if (this.options.create) {
                    if (this.auth.username === '' || this.auth.password === '') {
                        this.$message.error('用户及密码为空,请确认左侧认证选项.');
                        return
                    }
                }
                this.path.create = this.dirname(node)
                this.$refs['create-child'].show()
            },
            showDeleteNode(node) {
                if (this.options.delete) {
                    if (this.auth.username === '' || this.auth.password === '') {
                        this.$message.error('用户及密码为空,请确认左侧认证选项.');
                        return
                    }
                }
                this.path.delete = this.dirname(node)
                this.$refs['delete-node'].show()
            },
            showWriteNode(node) {
                if (this.options.write) {
                    if (this.auth.username === '' || this.auth.password === '') {
                        this.$message.error('用户及密码为空,请确认左侧认证选项.');
                        return
                    }
                }
                this.path.write = this.dirname(node)
                this.$refs['write-node'].show()
            },
            reloadNode(path, parent) {
                let node = path === '/' ? this.$refs['tree'].root : this.$refs['tree'].getNode({key: path});
                if (parent) {
                    node = node.parent;
                }
                node.loaded = false;
                node.expand()
            },
            createRootNode() {
                if (this.options.create) {
                    if (this.auth.username === '' || this.auth.password === '') {
                        this.$message.error('用户及密码为空,请确认左侧认证选项.');
                        return
                    }
                }
                this.path.create = '/';
                this.$refs['create-child'].show()
            }
        },
    }
</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 20px;
    padding-right: 8px;
  }

  .box {
    border-radius: 4px;
    border: 2px solid;
    margin-left: 50px;
    float: left;
  }

  .text {
    font-size: 14px;
    text-align: left;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:after {
    clear: both
  }

  .node-key {
    text-align: left;
    margin-left: 0;
    font-family: 'Source Code Pro', monospace;
    font-weight: bold;
  }

  .node-value {
    text-align: left;
    margin-left: 0;
    font-family: "Source Code Pro", monospace;
    font-style: italic;
  }
</style>
