<template>
      <div>
        <form @submit.prevent>
            <q-file dark filled bottom-slots v-model="model" @update:model-value="uploadFile($event)" ref="fileSelector" label="новый проект" label-color="grey-3">
                <template v-slot:prepend>
                <q-icon name="cloud_upload" color="grey-3" @click.stop />
                </template>
            </q-file>
            <div style="color:#A0A0A0;" :hidden="!uploaderVisible">
                Для продолженя, нужно загрузить дополнительно два файла:
                {{ anatPath }}
                <q-file ref="anatLoader"
                    :label-color=anatColor
                    :color=anatColor
                    dense
                    dark
                    v-model="anatModel"
                    label="Анатомический файл"
                    filled
                    style="max-width: 300px"
                    @update:model-value="Validate(1)"
                    ></q-file>
                {{ funcPath }}
                <q-file 
                    :label-color="funcColor"
                    :color="funcColor"
                    dense
                    dark
                    v-model="funcModel"
                    label="Функциональный файл"
                    filled
                    style="max-width: 300px"
                    @update:model-value="Validate(2)"
                    ></q-file>
            </div>
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
            connProject:false,
            funcModel:ref(null),
            anatModel:ref(null),
            uploaderVisible:false,
            anatPath:null,
            anatColor:"grey-3",

            funcColor:"grey-3",
            funcPath:null,
            readyFiles:[false,false],
        }
    },
    methods:{
        uploadFile(event){
            this.$emit('loadNewFile',event);
            this.uploaderVisible = true;
        },
        loadFile(projectName){this.$emit('loadProjectFile',projectName);},
        showExtraUploader(anat,func){
            console.log(this.model)
            this.anatPath = anat;
            this.funcPath = func;
            console.log(this.anatPath)
            console.log(this.funcPath)
        },
        Validate(FieldID){
            console.log(this.aname)
            console.log(this.aname==undefined)
            console.log(this.fname)
            console.log(this.fname==undefined)
            switch(FieldID){
                case 1:
                    if(this.anatPath.length>0){
                        var aname = this.anatPath.split('\\')
                        aname = aname[aname.length-1]
                    }else
                        var aname = undefined;
                    if((this.anatModel.name == aname) || (aname == undefined)){
                        this.anatColor = "positive"
                        this.readyFiles[0] = true;
                    }
                    else{
                        this.anatColor = "negative"
                        this.readyFiles[0] = false;
                    }
                    break;
                case 2:
                    if(this.funcPath.length>0){
                        var fname = this.funcPath.split('\\')
                        fname = fname[fname.length-1]
                    }else
                        var fname = undefined;
                    if((this.funcModel.name == fname) || (fname == undefined)){
                        this.funcColor = "positive"
                        this.readyFiles[1] = true;
                    }
                    else{
                        this.funcColor = "negative"
                        this.readyFiles[1] = false;
                    }
                    break;
            }
            console.log(this.anatModel)
            console.log(this.funcModel)
            if(this.readyFiles[0] && this.readyFiles[1]){
                if(this.$emit('uploadNII',this.anatModel,this.funcModel,this.model.name))
                    this.uploaderVisible = false;
                this.$emit('loadProjectList');
            }
        }
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