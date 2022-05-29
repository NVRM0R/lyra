<template>
    <div class="row">
        <div class="flex-break" id="navBar">
            <div >
                <fileMenu ref="fileMenu" v-bind:files="onServerFiles" @loadProjectList="loadProjectList" @loadNewFile="loadNewFile" @loadProjectFile="loadProjectFile" @uploadNII="uploadNII" />
            </div>
        </div>
        <div class="visual" v-bind:fileDataName="selectedFile">
            <visual ref="visializator"></visual>
        </div>
        <properties
        ref="properties"
        v-bind:colorMapsV="colorMapsV"
        v-bind:currentObj="currentObj"
        v-bind:colorSelectorModel="colorSelectorModel"
        v-bind:anatSelectorModel="anatSelectorModel"
        v-bind:QualitySelector="QualitySelector"
        @superDelete="superDelete"
        @updateProject="updateProject"
        @downloadProject="downloadProject"
        @setColorScheme="setColorScheme"
        @loadImage="loadImage"
        @parcellate="parcellate"
        @calcCorr="calcCorr"
        />
    </div>
</template>

<script>
import fileMenu from "@/components/fileMenu.vue"
import properties from "@/components/properties.vue"
import axios from 'axios';
import {ref} from 'vue'
let SERVER_ADDR = "http://192.168.1.27:5000"
export default{
    components:{
        fileMenu,
        properties,
    },
    data(){
        return{
            onServerFiles:[],
            selectedFile:ref(null),
            colorMapsV:ref(null),
            currentObj:ref(null),
            anatSelectorModel:ref(null),
            colorSelectorModel:ref(null),
            QualitySelector:ref(null),
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
        prepareURL(raw = false){
            let request = SERVER_ADDR+'/data/'+this.selectedFile;
            if(!raw){
                if(this.$refs.properties.QualitySelector=='big')
                    request+='@BIG'
                else
                    request+='@NORM'
                if(this.$refs.properties.anatSelectorModel!='Исходный снимок')
                    request+='@'+this.$refs.properties.anatSelectorModel
            }
            else
                request+='@RAW'
            return request;
        },
        async loadProjectFile(name){
            if(name!=null)
                this.selectedFile = name;
            if(this.selectedFile == null)
                return;
            var infoURL = SERVER_ADDR+'/info/'+this.selectedFile;
            this.colorSelectorModel = 'gray'
            this.anatSelectorModel = 'Исходный снимок'
            this.QualitySelector = "norm"
            return axios.get(infoURL).then((res) => {
                    this.currentObj = res.data
                    var tmp = parseFloat(this.currentObj.maskThresh)*100
                    this.currentObj.maskThresh = tmp.toString()
                    tmp = parseFloat(this.currentObj.corrThresh)*100
                    this.currentObj.corrThresh = tmp.toString()
                    console.log(res.data)
                    switch(res.data['status']){
                        case 'new':
                            this.currentObj.cyrStatus = 'Загрузка файлов'
                        break
                        case 'calculating':
                            this.currentObj.cyrStatus = 'вычисляется матрица корреляций'
                        break
                        case 'ready':
                            this.currentObj.cyrStatus = 'готово'
                        break
                        case 'parcellating':
                            this.currentObj.cyrStatus = 'производится разбиение'
                        break
                        case 'setup':
                            this.currentObj.cyrStatus = 'настройка параметров'
                        break
                        default:
                            this.currentObj.cyrStatus = '???'
                    }
                    /*
                    if(res.data['status']=='ready'){
                        let request = SERVER_ADDR+'/data/'+this.selectedFile;
                        this.$refs.visializator.loadImage(request)
                        }
                    */
                    this.loadImage()
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
        setColorScheme(){this.$refs.visializator.setColorScheme(this.$refs.properties.colorSelectorModel);},
        downloadProject(){window.open(this.prepareURL());},
        updateProject(){this.loadProjectFile(null);},
        superDelete(){return axios.get(SERVER_ADDR+'/delete/'+this.selectedFile);},
        parcellate(){
            let k = this.$refs.properties.ParcNumModel;
            var infoURL = SERVER_ADDR+'/parcellate';
            const hdr = {
                headers: {
                "projectName":this.selectedFile,
                "clusters":k,
                },
            };
            console.log(hdr);
            axios.get(infoURL,hdr);
            
        },
        loadImage(){
            let request = undefined
            if(this.currentObj['status']=='ready')
                request = this.prepareURL();
            else
                if(this.currentObj['status']=='setup')
                   request = this.prepareURL(true);
            if(request!=undefined)
                this.$refs.visializator.loadImage(request);
            console.log('=========');
            console.log(request);
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
                return true;
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
        calcCorr(corrThresh,maskThresh){
            if(this.currentObj.status == 'setup'){
                let calcCorrURL = SERVER_ADDR+'/calcCorr';
                const hdr = {
                    headers: {
                    "projectName":this.selectedFile,
                    "corrThresh":corrThresh,
                    "maskThresh":maskThresh,
                    },
                }
                axios.get(calcCorrURL,hdr);
            }

        }
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
</style>
