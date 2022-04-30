<template>
    <div class="row">
        <div class="flex-break" id="navBar">
            <div >
                <fileMenu ref="fileMenu" v-bind:files="onServerFiles" @loadNewFile="loadNewFile" @loadProjectFile="loadProjectFile" @uploadNII="uploadNII" />
            </div>
        </div>
        <div class="visual" v-bind:fileDataName="selectedFile">
            <visual ref="visializator"></visual>
        </div>
        <div class="settings" v-if="this.currentObj!=null" color="grey-8">
                <div class="plainText">
                    Файл:<span class="brighterPlainText"><b>{{this.currentObj.name}}</b></span><br />
                    Статус:<span class="brighterPlainText"><b>{{this.currentObj.cyrStatus}}</b></span><br />
                    <hr/>
                    Цветовая схема:
                    <q-select dark class="row inline longInp" dense v-model="colorSelectorModel" ref="anatSelector" :options="this.colorMapsV"  @update:model-value="setColorScheme()" bg-color="grey-8"/>
                    Доступные разбиения:
                    <q-select dark class="row inline longInp" dense v-model="anatSelectorModel" ref="anatSelector" :options="this.currentObj.parc"  @update:model-value="loadParcellation()" bg-color="grey-8" color="white" />
                Новое разбиение:
                </div>
                <div class="parcBox">
                    <q-input class="row inline" v-model.number="ParcNumModel" type="number" id="parcs" min="1" max="500" bg-color="grey-7" dense/> 
                    <q-btn class="row inline" dense unelevated color="grey-8" label="Обработать" @click="parcellate()"/>
                </div>
                <div class="deleteProject">
                    <q-btn unelevated color="grey-7" label-color="grey-4" label="Удалить проект" @click="superDelete()"/>
                </div>
            </div>
    </div>
</template>

<script>
import fileMenu from "@/components/fileMenu.vue"
import axios from 'axios';
import {ref} from 'vue'
let SERVER_ADDR = "http://192.168.1.27:5000"
export default{
    components:{
        fileMenu
    },
    data(){
        return{
            onServerFiles:[],
            selectedFile:null,
            colorMapsV:null,
            currentObj:null,
            anatSelectorModel:ref(null),
            colorSelectorModel:ref(null),
            ParcNumModel:ref(null),
        }
    },
    methods:{
        async loadProjectList(){
            try{
                const query = SERVER_ADDR+'/listProjects'
                const response = await axios.get(query)
                this.onServerFiles = response.data['list']
            }catch(e){
                alert('Не удалось получить список проектов')
            }
        },
        loadNewFile(file){
            const formData = new FormData();
            let connProject = false;
            if(file.name.split('.')[1] == 'mat')
                connProject = true
            formData.append('connFile',file)
            const hdr = {
                headers: {
                "Content-Type": 'multipart/form-data',
                "projectName":file.name,
                "connProject":connProject,
                },
            };
            let url = SERVER_ADDR+'/newProject';
            console.log("HERE");
            return axios.post(url, formData, hdr).then((res) => {
                let anatPath = res.data['anat']
                let funcPath = res.data['func']
                this.callExtreaUploader(anatPath,funcPath);
                })
                .catch((err) => {
                    console.log("Error:"+err);
                    return {
                        status: err.response ? err.response.status : 0,
                        data: {},
                        error: err.message,
                    };
                })
        },
        async loadProjectFile(name){

            this.selectedFile = name;
            var infoURL = SERVER_ADDR+'/info/'+this.selectedFile;
            this.colorSelectorModel = 'gray'
            this.anatSelectorModel = 'Исходный снимок'
            return axios.get(infoURL).then((res) => {
                    this.currentObj = res.data
                    console.log(res.data)
                    switch(res.data['status']){
                        case 'new':
                            this.currentObj.cyrStatus = 'вычисляется матрица корреляций'
                        break
                        case 'ready':
                            this.currentObj.cyrStatus = 'готово'
                        break
                        case 'parcellating':
                            this.currentObj.cyrStatus = 'производится разбиение'
                        break
                        default:
                            this.currentObj.cyrStatus = '???'
                    }
                    if(res.data['status']=='ready'){
                        let request = SERVER_ADDR+'/data/'+this.selectedFile;
                        this.$refs.visializator.loadImage(request)
                        }
                })
                .catch((err) => {
                    return {
                        status: err.response ? err.response.status : 0,
                        data: {},
                        error: err.message,
                    };
                })

        },
        callExtreaUploader(anat,func){this.$refs.fileMenu.showExtraUploader(anat,func);},
        setColorScheme(){this.$refs.visializator.setColorScheme(this.colorSelectorModel);},
        parcellate(){
            let k = this.ParcNumModel
            var infoURL = SERVER_ADDR+'/parcellate';
            const hdr = {
                headers: {
                "projectName":this.selectedFile,
                "clusters":k,
                },
            };
            console.log(hdr);
            return axios.get(infoURL,hdr);
        },
        loadParcellation(){

            if(this.currentObj['status']=='ready'){
                let request = SERVER_ADDR+'/data/'+this.selectedFile;
                if(this.anatSelectorModel!='Исходный снимок')
                    request+='@'+this.anatSelectorModel
                this.$refs.visializator.loadImage(request)
                }
        },
        uploadNII(anatFile,funcFile,projectName){
            const formData = new FormData();
            formData.append('anatomical',anatFile)
            formData.append('functional',funcFile)
             const hdr = {
                headers: {
                "Content-Type": 'multipart/form-data',
                "projectName":projectName,
                },
            };
            let url = SERVER_ADDR+'/uploadProjectFiles';
            return axios.post(url, formData, hdr).then((res) => {
                })
                .catch((err) => {
                    console.log("Error: "+err);
                    return {
                        status: err.response ? err.response.status : 0,
                        data: {},
                        error: err.message,
                    };
                })
        },
        superDelete(){
            var delURL = SERVER_ADDR+'/delete/'+this.selectedFile;
            return axios.get(delURL);
        },
    },
    mounted(){
        this.loadProjectList();
        this.colorMapsV = this.$refs.visializator.getColorScheme();
    }
}
</script>


<style>
body{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: #202020;
}
#navBar{
    width:20%;
}
.settings{
    margin-left:auto;
    float:right;
    justify-content: flex-end;
    width: 20%;
}
.plainText{
    color:#A0A0A0;
}
.brighterPlainText{
    color:#D0D0D0
}
.parcInput{
    max-width:50px;
}
.longInp{
    width:100%;
}
</style>
