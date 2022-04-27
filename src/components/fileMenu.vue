<template>
      <div>
        <form @submit.prevent>
            <q-file filled bottom-slots v-model="model" @update:model-value="uploadFile($event)" ref="fileSelector" label="новый проект" label-color="grey-3">
                <template v-slot:prepend>
                <q-icon name="cloud_upload" color="grey-3" @click.stop />
                </template>
            </q-file>
            
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

import { ref } from 'vue' 
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
            },
            model:ref(null),
        }
    },
    methods:{
        uploadFile(event){
            this.$emit('loadNewFile',event);
        },
        loadFile(projectName){
            this.$emit('loadProjectFile',projectName);
        },
  }
}
</script>

<style>
.loadNewFile{
    border: 1px solid gray;
    padding: 10px;
    margin: 5%;
    background: none;
    display:none;
}
</style>