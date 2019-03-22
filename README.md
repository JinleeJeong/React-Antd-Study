### create-react-app > Front && express-generator > Backend


### ant Design >  import "antd/dist/antd.css"; && config-overrides.js >> Default Function Overriding


### Source Tree Commit


**[
    1. Clone
    2. npm i -g yarn
    3. yarn @package-Name
    4. yarn
    yarn에서 모든 node_modules 출력
]**

psql -U postgres -d 'dbName'

compStringReverse = (a,b) => {
        if(a > b) return -1;
        if(b > a) return 1;
        return 0;
      } 

Sotring Function about Korean

19/03/15 배열 값을 비교하기 위한 delete 함수

한개의 행의 State를 Rowkey로 받아서, users를 setState를 하여 update하는 과정

express에서 $in $gt .limit .sort 등 여러가지 기능을 이용하여 Json 형태 가공

Postgres express React axios Delete 검사! 


for(var i = 0 ; i < this.state.users.length ; i++){
          usersTime = moment(this.state.users.map(test => test.created), 'YYYY/M/D HH:mm').format();
          console.log(usersTime);
        }

        length를 이용하여 users의 개수를 측정, map으로 내부 객체 진입

19/03/20
filter function > filtering ===> new Array
const users = [{a: '1', b: "aa"}, {a: '2', b: "bb" }, {a: '3', b: "cc"}]

    const arr1 = [{a: '1', b: "aa"}, {a: '2', b: "bb" }];


    const arr2 = [{a: '3', b: "cc"}]


   function arrFilter(obj){
     for (let i=0; i< arr1.length; i++ ){
         if (obj.a !== arr1[i].a){
            console.log('a= ', obj.a)
            return true
         }
     }

     return false
   }

    var tempArr = users.filter(arrFilter)

    console.log ('temparr =', tempArr);

Sorting Testing

------------------------------------------------------------- DB 2주차

Crud 작성시, 사용한 express와 postgres sequelize를 사용하여 쿼리 작성 필수
기존의 MongoDB, MySQL과는 다른 형식으로 작성

Fx) findByIdAndUpdate >> update
    delete >> destroy

    각 변수들은 의미론적으로 설계 
------------------------------------------------------------------------------------------

https://canvasjs.com/react-charts/drilldown-chart/

recharts Victory 

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
