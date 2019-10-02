<template>
  <el-dialog title="删除节点" :visible.sync="dialogVisible" width="25%" center>
    <el-form v-model="form">
      <el-form-item label="操作节点">
        <el-input v-model="path" disabled></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="el-dialog__footer">
      <el-button type='primary' @click="submit">确认</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
    import {deleteNode} from '@/api';

    export default {
        name: "DeleteNode",
        data() {
            return {
                dialogVisible: false,
                form: {}
            }
        },
        methods: {
            show() {
                this.dialogVisible = true
            },
            submit() {
                deleteNode(this.path, this.auth, this.options).then(res => {
                    if (res.data.success) {
                        this.dialogVisible = false;
                        this.$message.success(res.data.msg);
                        this.$emit('reloadNode', this.path, true);
                    } else {
                        this.$message.error(res.data.msg)
                    }
                }).catch(err => {
                    console.log(err)
                    this.$message.error('操作失败')
                })
            }
        },
        props: ['path', 'auth', 'options']
    }
</script>

<style scoped>

</style>
