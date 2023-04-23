Vue.component('c-upload', {
    template: ` 
    <el-upload :class="{'upload-disabled': uploadList.length === 1}" ref="upload" v-bind="$attrs" v-on="$listeners" :multiple="false" v-model="uploadList" :http-request="httpRequest"
        :limit="1" :before-remove="handleRemove">
        <template v-if="listType === 'picture'">
            <el-button size="small" type="primary" v-if="uploadList.length === 0">点击上传</el-button>
        </template>
        <template v-else>
            <i class="el-icon-plus"></i>
        </template>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
    </el-upload>
`,
    model: {
        prop: 'value',
        event: 'change'
    },
    props: {
        ...this.$attrs
    },
    watch: {
        // 设置默认数据
        value: {
            // 首次加载的时候执行函数
            immediate: true,
            handler(val) {
                this.uploadList = this.value || []
            }
        }
    },
    data() {
        return {
            uploadList: [],
            listType: ''
        }
    },
    mounted() {
        this.$nextTick(function () {
            this.listType = this.$refs.upload._props.listType;
        })
    },
    methods: {
        getBase64(file) {
            return new Promise((resolve, reject) => {
                let reader = new FileReader();
                let imgResult = "";
                reader.readAsDataURL(file);
                reader.onload = function () {
                    imgResult = reader.result;
                };
                reader.onerror = function (error) {
                    reject(error);
                };
                reader.onloadend = function () {
                    resolve(imgResult);
                };
            });
        },
        async httpRequest(e) {
            this.uploadList.push(await this.getBase64(e.file))
            this.$emit('change', this.uploadList)
        },
        handleRemove(file, fileList) {
            this.uploadList = []
            this.$refs.upload.clearFiles();
            this.$emit('change', [])
        }
    }
})