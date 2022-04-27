<template>
      <div style="width:200px; background-color:#DDD;">
        <form @submit.prevent>
            <input class="loadNewFile" ref="fileSelector" type="file" @change="uploadFile" />
            <div id="parcellationsList">
                <div v-for="item in files" :key="item">
                    <openButton @click="loadFile(item)">
                    {{ item }}
                    </openButton>
                </div>
            </div>
        </form>
        </div>
</template>

<script>


export default {
    props:{
        files:{
            type: Array,
            required: true
        }
    },
    data(){
        return {
            pFile:{
                file:null
            }
        }
    },
    methods:{
        uploadFile(event){
            const newFile = this.$refs.fileSelector.files[0];
            this.$emit('loadNewFile',newFile);
        },
        loadFile(projectName){
            this.$emit('loadProjectFile',projectName);
        },
  }
}
</script>

<style>
.loadNewFile{
    width:90%;
    border: 1px solid gray;
    padding: 10px;
    margin: 5%;
    background: none;
}
</style>