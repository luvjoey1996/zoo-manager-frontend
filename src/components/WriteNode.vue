<template>
  <el-dialog title="修改节点" :visible.sync="dialogVisible" width="25%" center>
    <el-form v-model="form">
      <el-form-item label="操作节点">
        <el-input v-model="path" disabled style="font-weight: bold;"></el-input>
      </el-form-item>
      <el-form-item label="节点值">
        <el-input v-model="form.value"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="el-dialog__footer">
      <el-button type='primary' @click="submit">确认</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
    import {writeNode} from '@/api';

    export default {
        name: "WriteNode",
        data() {
            return {
                dialogVisible: false,
                form: {
                    value: ''
                }
            }
        },
        props: ['path', 'auth', 'options'],
        methods: {
            submit() {
                writeNode(this.path, this.form.value, this.auth, this.options).then(res => {
                    if (res.data.success) {
                        this.dialogVisible = false;
                        this.$message.success(res.data.msg);
                        this.form.value = '';
                        this.$emit('reloadNode', this.path, true)
                    } else {
                        this.$message.error(res.data.msg)
                    }
                }).catch(err => {
                    console.log(err);
                    this.$message.error('操作失败')
                })
            },
            show() {
                this.dialogVisible = true
            }
        }
    }
</script>

<style scoped>

</style>
