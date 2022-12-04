import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

/*
    MongoDB 실행하기
    1. 'sudo service mongodb start'를 입력하여 mongoDB Service를 시작
    2. 'mongosh(or mongo)'를 입력하여 mongo shell로 이동한다.
    3. 작업을 마친 뒤 'sudo service mongodb stop'mongoDB Service를 종료
    : 'sudo service mongodb status'를 입력하면 mongoDB Service가 실행 중인지 알 수 있다.
*/
const handleOpen = () => console.log("✅ Connected to DB");
const handleError = (error) => console.log("❌ DB Error", error);

db.on("error", handleError);
db.once("open", handleOpen);
/* 
    MongoDB Command
    : show dbs; 가지고 있는 db 목록을 표시
    : db; 현재 사용 중인 db 이름을 표시
    : use dbName; 사용할 db 선택
    : show collections; db 내 collection들을 표시
    : db.collectionName.find(); db collection 안의 doc들을 표시
    : db.collectionName.remove({}); doc을 모두 제거
*/
/*
    MongoDB Error
    : code ~/.zshrc 입력 후 하단에 alias mongodb="sudo mongod --dbpath ~/data/db" 입력
    : 'sudo service mongodb start'를 입력했을 때 [fail]이 뜬다면 다음을 시도해볼 것
        1. 터미널에서 'cd /'를 입력해서 root 경로로 이동
        2. 'sudo cat var/log/mongodb/mongodb.log'를 입력하여 log 확인
        3. 최하단에 'aborting after fassert() failure' 가 나온다면
        'sudo rm /tmp/mongodb-27017.sock' 입력 후 터미널 재시작
*/
