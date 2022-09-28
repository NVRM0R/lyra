#  Front-end Server

This repo is a front-end side the final qualifying project. The main aim of the web application is to parcellate brain voxels into specific regions based on rs-fMRI data. The algorithm is based on the paper: [Craddock, R. C.; James, G. A.; Holtzheimer, P. E.; Hu, X. P. & Mayberg, H. S.
 A whole brain fMRI atlas generated via spatially constrained spectral
 clustering Human Brain Mapping, 2012, 33, 1914-1928 doi: 10.1002/hbm.21333.](http://www.ncbi.nlm.nih.gov/pubmed/21769991).

 Info about back-end server can be found [here](https://github.com/NVRM0R/vega)


### Table of Content:
+ [General Description](#General-Description)


### General Description
Final qualifing project is a web-based application for fMRI brain research. This part (front-end side) is used to generate HTML-based user interface from one side, and communicate with back server from another.

### GUI
<p align="center">
<img src="images/showcase.png"></img>
<p style="color:red">brain image blurred intentionally</p>
</p>
User interface consist of three parts:  

* <span style="color:#ac5bfe">purple</span> - project selection area  
User can select existing project or create new 
* <span style="color:#82ff5a">green</span> - brain exproling area
There user can view parcellated brain in different axes or switch to 3d reconstruction.
* <span style="color:#f44b78">red</span> - area where user can specify project settings, create new parcellation to N areas or download files.  

### Tech specs
To create flexible and efficient application, following stack has been choosen: **javascript + vue.js**

**Quasar framework** has been used for user elements (buttons, text fields, radio switches, etc);

To render brain image slices and complex 3D models, **niivue** package has been used. 

### Demo example
Firstly, user needs to upload files, it can be done by pressing button "new project" ("Новый проект" in russian)
<p align="center">
<img src="images/demo1.png"></img>
</p>
Then user need to specify files by clicking on filds (open file dialog will be popped out)
<p align="center">
<img width="250px" src="images/demo2.png"></img>
</p>
Next, in right section anatomical mask threshold and correlation threshold can be specified. To start first step "calculation correlation marix", used have to press "GO" ("ПУСК" in russian)
<p align="center">
<img src="images/demo3.png"></img>
<p style="color:red">brain image blurred intentionally</p>
</p>
After a while, matrix will be calculated and user will be able to select desired amount of ROIs
<p align="center">
<img src="images/demo4.png"></img>
<p style="color:red">brain image blurred intentionally</p>
</p>
By selecting one on the color schemes, user can increase the readability of the image as shown below
<p align="center">
<img src="images/demo5.png"></img>
<p style="color:red">brain image blurred intentionally</p>
</p>
User also can swtich to 3D mode to rotate and explore brain surface
<p align="center">
<img src="images/demo6.png"></img>
<p style="color:red">brain image blurred intentionally</p>
</p>