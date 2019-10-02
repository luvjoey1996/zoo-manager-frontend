<template>
  <el-dialog title="新建子节点" :visible.sync="dialogVisible" width="25%" center>
    <el-form v-model="form">
      <el-form-item label="操作节点">
        <el-input v-model="path" disabled></el-input>
      </el-form-item>
      <el-form-item label="节点名">
        <el-input v-model="form.name"></el-input>
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
    import {createChild} from '@/api';

    export default {
        name: "CreateChild",
        data() {
            return {
                dialogVisible: false,
                form: {
                    name: '',
                    value: ''
                },
                node: ''
            }
        },
        props: ['path', 'auth', 'options'],
        methods: {
            show() {
                this.dialogVisible = true
            },
            submit() {
                createChild(this.path, this.form.name, this.form.value, this.auth, this.options).then(res => {
                    if (res.data.success) {
                        this.$message.success(res.data.msg);
                        this.dialogVisible = false;
                        this.form.name = '';
                        this.form.value = '';
                        this.$emit('reloadNode', this.path, false)
                    } else {
                        this.$message.error(res.data.msg)
                    }
                }).catch(err => {
                    console.log(err);
                    this.$message.error('操作失败')
                })
            }
        }
    }
</script>

<style scoped>

</style>
