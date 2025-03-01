## AIで投稿にフィルターをかけることができるSNS

投稿に「お嬢様風」, 「ギャル風」など投稿内容をAIで変換することができます
***

フロントエンド: Next.js 15.1.3

バックエンド Spring Boot 3.4.1

データベース PostgreSQL latest

***
docker-composeと同じディレクトリに.envを作成し、環境変数として

```text:.env


#データベース設定
DB_HOST=your_db_host #docker-comopse内のservice名を指定する。デフォルトでpostgres
DB_NAME=yoru_db_name
DB_PASS=yoru_db_password
DB_PORT=your_db_port
DB_USER=yoru_db_user

#Gemini API設定
GEMINI_API_KEY=your_gemini_api_key
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models

JWT_SECRET=your_jwt_secret
SECURE=true #httpsを使用する場合true
API_SERVER_URL=http://backend:8080/api
```

を定義し、
dokcer-compose up --build
で実行可能
