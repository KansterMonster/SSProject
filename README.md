# SSProject

This project was created for the Nueva Software Studio class fall semester taught by Wes Chao.

# Set Up

First, set up an SSH key on your local device
```
ssh-keygen
```

Second, clone the repository locally:

```
git clone git@github.com:KansterMonster/SSProject.git
```
Third, download the necessary node modules:

```
npm install react
npm install mathjs
npm install @tensorflow-models/universal-sentence-encoder
npm install @tensorflow/tfjs
```

# Library Resources

This project uses the File System Access API in React. More information on the API here: https://web.dev/file-system-access/. 
One of the limiting factors surrounding this API is that it doesn't allow "system files" when opening a folder. There is no specific documentation detailing what exactly a "system file" is, but folders such as "Desktop", "Download", "Documents" that are built-in to the computer do not work for this API.

# Natural Language Processing Resources

This project uses the Univeral Sentence Encoder pretrained model from tensorflow.j. More information on the API here: https://github.com/tensorflow/tfjs-models/tree/master/universal-sentence-encoder.

# How to run 

Navigate to the "frontend1" folder in terminal. Then, enter the command `npm start` to launch the React Web App. Enter `localhost:3000` into a new browser tab in order to view the React Web App.

# Current MVP Features/How the code works

Currently, the user can click on the blue button titled "Open Directory" to open. The user then navigates to a file directory that they would like to view. Due to the limitations of the API, the directory cannot be a directory built-in to the computer, as described above. After the user opens a directory, they reload the page. Then, the directory's files and subfolders will be displayed in the window. Clicking on a file will display the most similar files (by name)

# Future Features/To-dos (in order)

1. The folder icons in the desktop integration currently do not do anything when pressed. Ideally, clicking on one of the folders would allow the user to navigate into the various subfolders within that folder, as well as return to the previous parent directory.
2. Currently, the Natural Language Processing model runs using the similarities of the titles of the files. However, the final goal requires the Natural Language Processing model to run on the content of the files. This change would be difficult, as reading the contents of some file types such as pdfs or images are quite challenging. 
3. Add a to-do list on the left side of the screen, allowing the user to add items, delete items, check off items, or edit items.
4. Add gmail integration, allowing the user to get a view of their gmail inbox in the same window as their desktop. The gmail should split the screen with the desktop in half, so that the user can see both at once. Additionally, the user requested that they be able to categorize their emails into folders.
5. Add google drive integration, similar to gmail-integration. 

# Contributors

Adam Kan wrote Similarity.js and functions.js.
Mason Choey wrote index.js, index.css, App.js, setupTests.test.js, and DesktopManager.js. 
